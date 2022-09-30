import { useEffect, useState } from "react";
import Textinput from "../components/Textinput";
import FormTracker from "../partials/FormTracker";
import { useForm } from "react-hook-form"
import Datepicker from "../components/Datepicker";
import Numberinput from "../components/Numberinput";
import Textareainput from "../components/Textareainput";
import liff from '@line/liff';
import axios from 'axios'
import Timepicker from "../components/Timepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useScript } from "../apis/useScript";
import Dropdown from "../components/Dropdown";
import { createBooking } from "../apis/backend";
import { geocode } from "../apis/google";

const Booking = () => {
  const [bookingType, setType] = useState("A2B")
  const [placeInfo, setPlaceInfo] = useState({})
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState("")
  const { register, setValue, handleSubmit, unregister } = useForm()
  const scriptStatus = useScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyACgdM4gHsoZA-JBVSdUPy5B2h70tq2ATU&libraries=places")
  let autocomplete1
  let autocomplete2

  const catagory = [
    {
      title: <div>From A - To B</div>,
      detail: "Pick up from your place to your destination."
    },
    {
      title: "Hourly, Daily with driver",
      detail: "Sightseeing, Shopping, Business or Others"
    }
  ]

  const initLine = () => {
    liff.init({ liffId: '1657246657-jMPaJLl0' }, () => {
      if (liff.isLoggedIn()) {
        runApp();
      } else {
        liff.login();
      }
    }, err => console.error(err));
  }

  const runApp = () => {
    const idToken = liff.getIDToken();
    liff.getProfile().then(profile => {
      setUserId(profile.userId)
    }).catch(err => console.error(err));
  }

  const fillInAddress = (type, inputEl) => {
    // Get the place details from the autocomplete object.
    const place = type === "from" ? autocomplete1.getPlace() : autocomplete2.getPlace()
    const placeName = inputEl.value.replace(/[^0-9a-zA-Z]+$/g, "")
    inputEl.value = placeName
    return {
      placeId: place.place_id,
      name: placeName
    }
  }

  useEffect(() => {
    console.log(placeInfo)
  }, [placeInfo])

  useEffect(() => {
    if (scriptStatus !== "ready") return
    unregister("")
    const from = document.querySelector("#from")
    const to = document.querySelector("#to")
    const placeState = {} //State doesnt update in listener
    autocomplete1 = new window.google.maps.places.Autocomplete(from, {
      componentRestrictions: { country: ["th"] },
      fields: ["place_id"],
      type: ["establishment"]
    });
    autocomplete2 = new window.google.maps.places.Autocomplete(to, {
      componentRestrictions: { country: ["th"] },
      fields: ["place_id"],
      type: ["establishment"]
    });
    autocomplete1.addListener("place_changed", () => {
      const placeObj = fillInAddress("from", from)
      placeState.from = placeObj
      setPlaceInfo({
        ...placeState
      })
    });
    autocomplete2.addListener("place_changed", () => {
      const placeObj = fillInAddress("to", to)
      placeState.to = placeObj
      setPlaceInfo({
        ...placeState
      })
    });
  }, [scriptStatus, bookingType]);

  useEffect(() => {
    initLine();
  }, [])

  const onSubmit = async (data) => {
    // setLoading(true)
    data.userId = userId
    data.bookingType = bookingType
    if (bookingType === "A2B") {
      data.bookingInfo.from = placeInfo.from
      data.bookingInfo.to = placeInfo.to
    } else {
      data.bookingInfo.start.place = placeInfo.from
      data.bookingInfo.end.place = placeInfo.to
    }
    console.log(data)
    await createBooking(data)
    liff.closeWindow()
  }

  return (
    <div className="grid pt-20 h-screen w-full">
        {scriptStatus === "ready" && <form onSubmit={handleSubmit(onSubmit)} className="w-full text-center">
          <div className="flex w-10/12 mx-auto mb-5">
            <div onClick={() => bookingType === "R&H" && setType("A2B")} className={"py-2 text-lg font-semibold w-full rounded-l-lg " + (bookingType === "A2B" ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-500")}>A  <FontAwesomeIcon className="mx-1" icon={faArrowRightLong} />  B</div>
            <div onClick={() => bookingType === "A2B" && setType("R&H")} className={"py-2 text-lg w-full rounded-r-lg " + (bookingType === "R&H" ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-500")}>Rent & Hire</div>
          </div>
          <div className="text-xl font-semibold w-10/12 mx-auto mb-3">{catagory[bookingType === "A2B" ? 0 : 1].title}</div>
          <div className="w-10/12 mx-auto mb-5 text-sm">{catagory[bookingType === "A2B" ? 0 : 1].detail}</div>
          <FormTracker currentStep={bookingType === "A2B" ? 0 : 1} body={[
            <AToBCourse setType={setType} register={register} setValue={setValue} />,
            <RentAndHire unregister={unregister} register={register} setValue={setValue} />
          ]} />
          <input type="submit" value="Send" className="py-2 bg-blue-900 text-white text-lg w-10/12 mx-auto rounded-lg mt-8 mb-14" />
        </form>}
    </div>
  );
}

export default Booking;

//first page of the booking form
const AToBCourse = ({ setType, register, setValue }) => {
  const [time, setTime] = useState(new Date())
  const [asap, setAsap] = useState(false)

  return (
    <div>
      <div className="flex mb-2">
        <div className="w-8/12 mr-2"><Datepicker register={register("bookingInfo.pickupDate")} time={time} setTime={setTime} asap={asap} setAsap={setAsap} title="Pickup Date" setValue={setValue} /></div>
        <div className="w-4/12"><Timepicker register={register("bookingInfo.pickupTime")} time={time} setTime={setTime} asap={asap} setAsap={setAsap} title="Time" setValue={setValue} /></div>
      </div>
      <div className="flex items-center mb-4">
        <input onClick={() => setAsap(current => !current)} id="asap" type="checkbox" className="font-semibold" />
        <label htmlFor="asap" className='underline decoration-red-500 text-red-600 text-sm ml-2 text-left font-medium'>I want as soon as possible</label>
      </div>
      <div className={"mb-3 " }>
        <Textinput id="from" onChange={() => {}} register={register("bookingInfo.from")} title="From" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput id="to" onChange={() => {}} register={register("bookingInfo.to")} title="To" setValue={setValue} />
      </div>
      <div className="mb-3"><Numberinput onChange={() => {}} register={register("bookingInfo.passenger")} title="All Passengers (with Child)" setValue={setValue} /></div>
      <div className="mb-3"><Numberinput onChange={() => {}} register={register("bookingInfo.luggage")} title="Lugggage (Big + Mid size)" setValue={setValue} /></div>
      <div className="mb-3"><Textareainput register={register("bookingInfo.message")} title="Additional Order and Message" setValue={setValue} /></div>
    </div>
  )
}

//last page of the booking form
const RentAndHire = ({ unregister, register, setValue }) => {
  const [time, setTime] = useState(new Date())
  const [asap, setAsap] = useState(false)
  const [asap1, setAsap1] = useState(false)
  const [areaToVisit, setAreaToVisit] = useState({1: ""})
  const [increment, setIncrement] = useState(1)
  
  const addAreaHandle = (id, type, index) => {
    let temp = areaToVisit
    if (type === "add") {
      temp[increment + 1] = ""
      setAreaToVisit(temp)
      setIncrement(increment + 1)
      return
    }
    unregister(`bookingInfo.visit`)
    delete temp[id]
    setAreaToVisit(temp)
    setIncrement(increment + 1)
  }

  return (
    <div>
      <div className="flex mb-2">
        <div className="w-8/12 mr-2"><Datepicker register={register("bookingInfo.start.pickupDate")} time={time} setTime={setTime} asap={asap} setAsap={setAsap} title="Starting Date" setValue={setValue} /></div>
        <div className="w-4/12"><Timepicker register={register("bookingInfo.start.pickupTime")} time={time} setTime={setTime} asap={asap} setAsap={setAsap} title="Time" setValue={setValue} /></div>
      </div>
      <div className="flex items-center mb-4">
        <input onClick={() => setAsap(current => !current)} id="asap" type="checkbox" className="font-semibold" />
        <label htmlFor="asap" className='text-sm ml-2 text-left font-medium'>Want as soon as possible?</label>
      </div>
      <div className={"mb-3 " }>
        <Dropdown onChange={() => {}} register={register("bookingInfo.type")} title="Trip title" options={["Sightseeing (Tour)", "Shopping", "Business", "Others"]} setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput id="from" onChange={() => {}} register={register("bookingInfo.start.place")} title="Starting Place to Pickup" setValue={setValue} />
      </div>
      {increment && Object.keys(areaToVisit).map((area, index) => {
        return (
          <div key={area} className={"relative " + (index !== areaToVisit - 1 ? "mb-3" : "mb-2")}>
            <Textinput onChange={() => {}} reRender={increment} register={register(`bookingInfo.visit.[${index}].place`)} title="Place info to visit" setValue={setValue} />
            {index !== 0 && <div onClick={() => addAreaHandle(area, "remove", index)} style={{ aspectRatio: "1" }} className="bg-blue-900 h-7 rounded-md grid place-items-center top-1/2 -translate-y-1/2 right-3 absolute"><FontAwesomeIcon className="text-sm text-white" icon={faTrash} /></div>}
          </div>
        )
      })}
      <div onClick={() => addAreaHandle("", "add")} className="text-white rounded-md bg-blue-900 w-max py-2 px-2 text-xs cursor-pointer text-left mb-5">+ Add Place</div>
      <div className="flex">
        <div className="mb-3 w-8/12 mr-2"><Datepicker register={register("bookingInfo.end.pickupDate")} time={time} setTime={setTime} asap={asap1} setAsap={setAsap1} title="Ending Date" setValue={setValue} /></div>
        <div className="mb-3 w-4/12"><Timepicker register={register("bookingInfo.end.pickupTime")} time={time} setTime={setTime} asap={asap1} setAsap={setAsap1} title="Time" setValue={setValue} /></div>
      </div>
      <div className={"mb-3 " }>
        <Textinput id="to" onChange={() => {}} register={register("bookingInfo.end.place")} title="Ending Place (Final destination)" setValue={setValue} />
      </div>
      <div className="mb-3"><Numberinput onChange={() => {}} register={register("bookingInfo.passenger")} title="All Passengers (with Child)" setValue={setValue} /></div>
      <div className="mb-3"><Numberinput onChange={() => {}} register={register("bookingInfo.luggage")} title="Lugggage (Big + Mid size)" setValue={setValue} /></div>
      <div className="mb-3"><Textareainput register={register("bookingInfo.message")} title="Additional Order and Message" setValue={setValue} /></div>
    </div>
  )
}
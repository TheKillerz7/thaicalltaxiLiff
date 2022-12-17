import { useEffect, useState } from "react";
import Textinput from "../components/Textinput";
import FormTracker from "../partials/FormTracker";
import { useForm } from "react-hook-form"
import Datepicker from "../components/Datepicker";
import Numberinput from "../components/Numberinput";
import Textareainput from "../components/Textareainput";
import liff from '@line/liff';
import Timepicker from "../components/Timepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faCropSimple, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useScript } from "../apis/useScript";
import Dropdown from "../components/Dropdown";
import { createBooking, getUserById, updateUserById } from "../apis/backend";
import he from "he"
import { translations } from "../apis/google";

const placeState = {
  visits: []
} //State doesnt update in listener

const Booking = () => {
  const [bookingType, setType] = useState("A2B")
  const [placeInfo, setPlaceInfo] = useState({})
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState([])
  const [termsAndCon, setTermsAndCon] = useState(false)
  const [locationValue, setLocationValue] = useState({
    from: "",
    visits: [{1: ""}],
    to: ""
  })
  const [userId, setUserId] = useState("")
  const [increment, setIncrement] = useState(1)

  const { register, setValue, handleSubmit, unregister, formState: { errors } } = useForm()
  const scriptStatus = useScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyACgdM4gHsoZA-JBVSdUPy5B2h70tq2ATU&libraries=places&sensor=false&language=en")
  let autocomplete1
  let autocomplete2

  const catagory = [
    {
      title: <div>From A - To B</div>,
      detail: "From your place to your destination."
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

  const fillInAddress = async (obj, input, index) => {
    // Get the place details from the autocomplete object.
    const place = obj.getPlace()
    const placeName = place.name.split(",")?.[0] || place.name
    setLocationValue(curr => {
      const temp = curr
      if (typeof index === "number") {
        temp[input][index][Object.keys(temp[input][index])[0]] = placeName
      } else {
        temp[input] = placeName
      }
      return temp
    })
    const province = place.address_components.find((addr) => addr.types.includes("administrative_area_level_1"))
    try {
      const translated = await translations(province.long_name, "th")
      const provinceObj = {
        en: province.long_name,
        th: he.decode(translated.data.data.translations[0].translatedText) === "กรุงเทมหานคร" ? "กรุงเทพมหานคร" : he.decode(translated.data.data.translations[0].translatedText)
      } 
      return {
        placeId: place.place_id,
        name: placeName,
        province: provinceObj
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (scriptStatus !== "ready") return
    const from = document.querySelector("#from")
    const to = document.querySelector("#to")
    from.placeholder = ""
    to.placeholder = ""
    autocomplete1 = new window.google.maps.places.Autocomplete(from, {
      componentRestrictions: { country: ["th"] },
      fields: ["place_id", "name", "address_components"],
      type: ["establishment"]
    });
    autocomplete2 = new window.google.maps.places.Autocomplete(to, {
      componentRestrictions: { country: ["th"] },
      fields: ["place_id", "name", "address_components"],
      type: ["establishment"]
    });
    
    autocomplete1.addListener("place_changed", async () => {
      const placeObj = await fillInAddress(autocomplete1, "from")
      placeState.from = placeObj
      setPlaceInfo({
        ...placeState
      })
    });
    autocomplete2.addListener("place_changed", async () => {
      const placeObj = await fillInAddress(autocomplete2, "to")
      placeState.to = placeObj
      setPlaceInfo({
        ...placeState
      })
    });
    unregister("")
    setLocationValue({
      from: "",
      visits: [{1: ""}],
      to: ""
    })
    if (userInfo.length || !userId) return
    const callback = async () => {
      const user = (await getUserById(userId)).data[0]
      console.log(user)
      if (user.userTermsAndCon) setTermsAndCon(true)
      setUserInfo([user])
    } 
    callback()
  }, [scriptStatus, bookingType, userId]);

  useEffect(() => {
    if (scriptStatus !== "ready") return
    const visits = document.querySelectorAll("#visit")
    visits.forEach((visit, index) => {
      visit.placeholder = ""
      const autocompleteObj = new window.google.maps.places.Autocomplete(visit, {
        componentRestrictions: { country: ["th"] },
        fields: ["place_id", "name", "address_components"],
        type: ["establishment"]
      });
      autocompleteObj.addListener("place_changed", async () => {
        const placeObj = await fillInAddress(autocompleteObj, "visits", index)
        placeState.visits.push(placeObj)
        setPlaceInfo({
          ...placeState
        })
      });
    })
  }, [scriptStatus, bookingType, increment])

  useEffect(() => {
    initLine();
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    data.userId = userId
    data.bookingType = bookingType
    const translatedMessage = await translations(data.bookingInfo.message.en, "th")
    data.bookingInfo.message.th = he.decode(translatedMessage.data.data.translations[0].translatedText)
    if (bookingType === "A2B") {
      data.bookingInfo.from = placeInfo.from
      data.bookingInfo.to = placeInfo.to
    } else {
      data.bookingInfo.start.place = placeInfo.from
      data.bookingInfo.visit = placeInfo.visits
      data.bookingInfo.end.place = placeInfo.to
    }
    await updateUserById({userTermsAndCon: termsAndCon}, userId)
    await createBooking(data)
    setLoading(false)
    liff.closeWindow()
  }

  return (
    <div className="grid pt-10 h-screen w-full">
        {scriptStatus === "ready" && <form onSubmit={handleSubmit(onSubmit)} className="w-full text-center">
          <div className="flex w-10/12 mx-auto mb-5">
            <div onClick={() => bookingType === "R&H" && setType("A2B")} className={"py-2 text-lg font-semibold w-full rounded-l-lg border-2 border-blue-900 transition " + (bookingType === "A2B" ? "bg-blue-900 text-white" : "bg-white text-blue-900")}>A  <FontAwesomeIcon className="mx-1" icon={faArrowRightLong} />  B</div>
            <div onClick={() => bookingType === "A2B" && setType("R&H")} className={"py-2 text-lg font-semibold w-full rounded-r-lg border-2 border-blue-900 transition " + (bookingType === "R&H" ? "bg-blue-900 text-white" : "bg-white text-blue-900")}>Rent & Hire</div>
          </div>
          <div className="text-xl font-semibold w-10/12 mx-auto mb-3">{catagory[bookingType === "A2B" ? 0 : 1].title}</div>
          <div className="w-10/12 mx-auto mb-5 text-sm">{catagory[bookingType === "A2B" ? 0 : 1].detail}</div>
          <FormTracker currentStep={bookingType === "A2B" ? 0 : 1} body={[
            <AToBCourse errors={errors} locationValue={locationValue} setLocationValue={setLocationValue} setType={setType} register={register} setValue={setValue} />,
            <RentAndHire errors={errors} locationValue={locationValue} setLocationValue={setLocationValue} placeInfo={placeInfo} setPlaceInfo={setPlaceInfo} increment={increment} setIncrement={setIncrement} unregister={unregister} register={register} setValue={setValue} />
          ]} />
          {!userInfo[0]?.userTermsAndCon &&
            <div className="flex items-center mt-5 w-10/12 mx-auto ">
              <input onChange={() => setTermsAndCon(curr => !curr)} id="terms" type="checkbox" className="font-semibold" />
              <label htmlFor="terms" className='text-sm ml-2 text-left font-medium'>I agree to <span onClick={() => window.location.replace("https://www.instagram.com/")} className="underline inline text-blue-400">Terms & Conditions</span></label>
            </div>
          }
          <input type="submit" value="Send" className={"py-2 bg-blue-900 text-white text-lg w-10/12 mx-auto rounded-lg mt-3 mb-10 " + (loading || !termsAndCon && "opacity-70 pointer-events-none")} />
        </form>}
    </div>
  );
}

export default Booking;

//first page of the booking form
const AToBCourse = ({ setType, register, setValue, locationValue, setLocationValue, errors }) => {
  const [time, setTime] = useState(new Date())
  const [asap, setAsap] = useState(false)

  return (
    <div>
      <div className="flex mb-2">
        <div className="w-8/12 mr-2"><Datepicker error={errors?.bookingInfo?.pickupDate?.message} register={register("bookingInfo.pickupDate", { required: "Please fill this info" })} time={time} setTime={setTime} asap={asap} setAsap={setAsap} title="Pickup Date" setValue={setValue} /></div>
        <div className="w-4/12"><Timepicker error={errors?.bookingInfo?.pickupDate?.message} register={register("bookingInfo.pickupTime", { required: "Please fill this info" })} time={time} setTime={setTime} asap={asap} setAsap={setAsap} title="Time" setValue={setValue} /></div>
      </div>
      <div className="flex items-center mb-4">
        <input onClick={() => setAsap(current => !current)} id="asap" type="checkbox" className="font-semibold" />
        <label htmlFor="asap" className='underline decoration-red-500 text-red-600 text-sm ml-2 text-left font-medium'>I want now(ASAP)</label>
      </div>
      <div className={"mb-3 " }>
        <Textinput id="from" error={errors?.bookingInfo?.from?.message} controlledValue={locationValue.from} onChange={(e) => {
          setLocationValue(curr => {
            const temp = curr
            temp.from = e
            return temp
          })
        }} register={register("bookingInfo.from", { required: "Please fill this info" })} title="From" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput id="to" error={errors?.bookingInfo?.to?.message} controlledValue={locationValue.to} onChange={(e) => {
          console.log(e)
          setLocationValue(curr => {
            const temp = curr
            temp.to = e
            return temp
          })
        }} register={register("bookingInfo.to", { required: "Please fill this info" })} title="To" setValue={setValue} />
      </div>
      <div className="grid grid-cols-2 gap-x-2 mb-3">
        <Numberinput onChange={() => {}} error={errors?.bookingInfo?.passenger?.adult?.message} register={register("bookingInfo.passenger.adult", { required: "Please fill this info" })} title="Adult" setValue={setValue} />
        <Numberinput onChange={() => {}} error={errors?.bookingInfo?.passenger?.child?.message} register={register("bookingInfo.passenger.child", { required: "Please fill this info" })} title="Child/Baby" setValue={setValue} />
      </div>
      <div className="grid grid-cols-2 gap-x-2 mb-3">
        <Numberinput onChange={() => {}} error={errors?.bookingInfo?.luggage?.big?.message} register={register("bookingInfo.luggage.big", { required: "Please fill this info" })} title="Big luggage" setValue={setValue} />
        <Numberinput onChange={() => {}} error={errors?.bookingInfo?.luggage?.medium?.message} register={register("bookingInfo.luggage.medium", { required: "Please fill this info" })} title="Mid luggage" setValue={setValue} />
      </div>
      <div className="mb-3"><Textareainput register={register("bookingInfo.message.en")} title="Additional Order and Message" setValue={setValue} /></div>
    </div>
  )
}

//last page of the booking form
const RentAndHire = ({ unregister, register, setValue, increment, setIncrement, locationValue, setLocationValue, errors }) => {
  const [time, setTime] = useState(new Date())
  const [asap, setAsap] = useState(false)
  const [asap1, setAsap1] = useState(false)
  const [areaToVisit, setAreaToVisit] = useState({1: ""})
  console.log(locationValue)
  const addAreaHandle = (id, type, index) => {
    let temp = areaToVisit
    let locationValueTemp = locationValue
    if (type === "add") {
      temp[increment + 1] = ""
      const obj = {}
      obj[increment + 1] = ""
      locationValueTemp.visits.push(obj)
      setLocationValue(locationValueTemp)
      setAreaToVisit(temp)
      setIncrement(increment + 1)
      return
    }
    unregister(`bookingInfo.visit`)
    delete temp[id]
    locationValueTemp.visits.splice(index, 1)
    setLocationValue(locationValueTemp)
    setAreaToVisit(temp)
    setIncrement(increment + 1)
  }
 
  return (
    <div>
      <div className="flex mb-2">
        <div className="w-8/12 mr-2"><Datepicker error={errors?.bookingInfo?.start?.pickupDate?.message} register={register("bookingInfo.start.pickupDate", { required: "Please fill this info" })} time={time} setTime={setTime} asap={asap} setAsap={setAsap} title="Starting Date" setValue={setValue} /></div>
        <div className="w-4/12"><Timepicker error={errors?.bookingInfo?.start?.pickupTime?.message} register={register("bookingInfo.start.pickupTime", { required: "Please fill this info" })} time={time} setTime={setTime} asap={asap} setAsap={setAsap} title="Time" setValue={setValue} /></div>
      </div>
      <div className="flex items-center mb-4">
        <input onClick={() => setAsap(current => !current)} id="asap" type="checkbox" className="font-semibold" />
        <label htmlFor="asap" className='underline decoration-red-500 text-red-600 text-sm ml-2 text-left font-medium'>I want now(ASAP)</label>
      </div>
      <div className={"mb-3 " }>
        <Dropdown onChange={() => {}} error={errors?.bookingInfo?.type?.message} register={register("bookingInfo.type", { required: "Please fill this info" })} title="Trip title" options={["Sightseeing (Tour)", "Shopping", "Business", "Others"]} setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput id="from" error={errors?.bookingInfo?.start?.place?.message} controlledValue={locationValue.from} onChange={(e) => {
          setLocationValue(curr => {
            const temp = curr
            temp.from = e
            return temp
          })
        }} register={register("bookingInfo.start.place", { required: "Please fill this info" })} title="Starting Place to Pickup" setValue={setValue} />
      </div>
      {increment && Object.keys(areaToVisit).map((area, index) => {
        return (
          <div key={area} className={"relative " + (index !== areaToVisit - 1 ? "mb-3" : "mb-2")}>
            <Textinput id="visit" error={errors?.bookingInfo?.visit?.[index]?.message} controlledValue={locationValue.visits[index][Object.keys(locationValue.visits[index])[0]]} onChange={(e) => {
              setLocationValue(curr => {
                const temp = curr
                temp.visits[index][Object.keys(locationValue.visits[index])[0]] = e
                return temp
              })
            }} reRender={increment} register={register(`bookingInfo.visit.[${index}].place`, { required: "Please fill this info" })} title="Place info to visit" setValue={setValue} />
            {index !== 0 && <div onClick={() => addAreaHandle(area, "remove", index)} style={{ aspectRatio: "1" }} className="bg-blue-900 h-7 rounded-md grid place-items-center top-1/2 -translate-y-1/2 right-3 absolute"><FontAwesomeIcon className="text-sm text-white" icon={faTrash} /></div>}
          </div>
        )
      })}
      <div onClick={() => addAreaHandle("", "add")} className="text-white rounded-md bg-blue-900 w-max py-2 px-2 text-xs cursor-pointer text-left mb-5">+ Add Place</div>
      <div className="flex">
        <div className="mb-3 w-8/12 mr-2"><Datepicker error={errors?.bookingInfo?.end?.pickupDate?.message} register={register("bookingInfo.end.pickupDate", { required: "Please fill this info" })} time={time} setTime={setTime} asap={asap1} setAsap={setAsap1} title="Ending Date" setValue={setValue} /></div>
        <div className="mb-3 w-4/12"><Timepicker error={errors?.bookingInfo?.end?.pickupTime?.message} register={register("bookingInfo.end.pickupTime", { required: "Please fill this info" })} time={time} setTime={setTime} asap={asap1} setAsap={setAsap1} title="Time" setValue={setValue} /></div>
      </div>
      <div className={"mb-3 " }>
        <Textinput id="to" error={errors?.bookingInfo?.end?.place?.message} controlledValue={locationValue.to} onChange={(e) => {
          setLocationValue(curr => {
            const temp = curr
            temp.to = e
            return temp
          })
        }} register={register("bookingInfo.end.place", { required: "Please fill this info" })} title="Ending Place (Final destination)" setValue={setValue} />
      </div>
      <div className="grid grid-cols-2 gap-x-2 mb-3">
        <Numberinput onChange={() => {}} error={errors?.bookingInfo?.passenger?.adult?.message} register={register("bookingInfo.passenger.adult", { required: "Please fill this info" })} title="Adult" setValue={setValue} />
        <Numberinput onChange={() => {}} error={errors?.bookingInfo?.passenger?.child?.message} register={register("bookingInfo.passenger.child", { required: "Please fill this info" })} title="Child/Baby" setValue={setValue} />
      </div>
      <div className="grid grid-cols-2 gap-x-2 mb-3">
        <Numberinput onChange={() => {}} error={errors?.bookingInfo?.luggage?.big?.message} register={register("bookingInfo.luggage.big", { required: "Please fill this info" })} title="Big luggage" setValue={setValue} />
        <Numberinput onChange={() => {}} error={errors?.bookingInfo?.luggage?.medium?.message} register={register("bookingInfo.luggage.medium", { required: "Please fill this info" })} title="Mid luggage" setValue={setValue} />
      </div>
      <div className="mb-3"><Textareainput register={register("bookingInfo.message.en")} title="Additional Order and Message" setValue={setValue} /></div>
    </div>
  )
}
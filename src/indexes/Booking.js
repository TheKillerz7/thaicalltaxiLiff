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
import PlaceSearch from "../components/PlaceSearch";

const placeState = {
  visits: []
} //State doesnt update in listener

const Booking = () => {
  const [bookingType, setType] = useState("A2B")
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState([])
  const [termsAndCon, setTermsAndCon] = useState(false)
  const [userId, setUserId] = useState("")
  const [increment, setIncrement] = useState(1)

  const { register, setValue, handleSubmit, unregister, formState: { errors } } = useForm()
  const scriptStatus = useScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyACgdM4gHsoZA-JBVSdUPy5B2h70tq2ATU&libraries=places")

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

  useEffect(() => {
    if (scriptStatus !== "ready") return
    unregister("")
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
    initLine();
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    data.userId = userId
    data.bookingType = bookingType
    if (data.bookingInfo.message.en) {
      const translatedMessage = await translations(data.bookingInfo.message.en, "th")
      data.bookingInfo.message.th = he.decode(translatedMessage.data.data.translations[0].translatedText)
    }
    if (!data.bookingInfo.luggage.medium) data.bookingInfo.luggage.medium = 0
    if (!data.bookingInfo.luggage.big) data.bookingInfo.luggage.big = 0
    if (!data.bookingInfo.passenger.adult) data.bookingInfo.passenger.adult = 0
    if (!data.bookingInfo.passenger.child) data.bookingInfo.passenger.child = 0
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
            <AToBCourse errors={errors} setType={setType} register={register} setValue={setValue} />,
            <RentAndHire errors={errors} increment={increment} setIncrement={setIncrement} unregister={unregister} register={register} setValue={setValue} />
          ]} />
          {!userInfo[0]?.userTermsAndCon &&
            <div className="flex items-center mt-5 w-10/12 mx-auto ">
              <input onChange={() => setTermsAndCon(curr => !curr)} id="terms" type="checkbox" className="font-semibold" />
              <label htmlFor="terms" className='text-sm ml-2 text-left font-medium'>I agree to <span onClick={() => window.location.replace("https://www.thai-taxi.com/q-and-a")} className="underline inline text-blue-400">Terms & Conditions</span></label>
            </div>
          }
          <input type="submit" value="Send" className={"py-2 bg-blue-900 text-white text-lg w-10/12 mx-auto rounded-lg mt-3 mb-10 " + (loading || !termsAndCon && "opacity-70 pointer-events-none")} />
        </form>}
    </div>
  );
}

export default Booking;

//first page of the booking form
const AToBCourse = ({ setType, register, setValue, errors }) => {
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
        <PlaceSearch onChange={() => {}} error={errors?.bookingInfo?.from?.message} register={register("bookingInfo.from", { required: "Please fill this info" })} title="From" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <PlaceSearch onChange={() => {}} error={errors?.bookingInfo?.to?.message} register={register("bookingInfo.to", { required: "Please fill this info" })} title="To" setValue={setValue} />
      </div>
      <div className="grid grid-cols-2 gap-x-2 mb-3">
        <Numberinput onChange={() => {}} register={register("bookingInfo.passenger.adult")} title="Adult" setValue={setValue} />
        <Numberinput onChange={() => {}} register={register("bookingInfo.passenger.child")} title="Child/Baby" setValue={setValue} />
      </div>
      <div className="grid grid-cols-2 gap-x-2 mb-3">
        <Numberinput onChange={() => {}} register={register("bookingInfo.luggage.big")} title="Big luggage" setValue={setValue} />
        <Numberinput onChange={() => {}} register={register("bookingInfo.luggage.medium")} title="Mid luggage" setValue={setValue} />
      </div>
      <div class="flex items-center mb-5"><input onChange={(e) => setValue("meetingService", e.target.value)} id="terms" type="checkbox" class="font-semibold" /><label for="terms" class="text-sm ml-2 text-left font-medium">I want<span class="ml-1 underline inline text-blue-400">Airport Meeting Service</span><span class="ml-1 inline text-red-500">+ 100B</span></label></div>
      <div className="mb-3"><Textareainput register={register("bookingInfo.message.en")} title="Additional Order and Message" setValue={setValue} /></div>
    </div>
  )
}

//last page of the booking form
const RentAndHire = ({ unregister, register, setValue, increment, setIncrement, errors }) => {
  const [time, setTime] = useState(new Date())
  const [asap, setAsap] = useState(false)
  const [asap1, setAsap1] = useState(false)
  const [areaToVisit, setAreaToVisit] = useState({1: ""})

  const addAreaHandle = (id, type, index) => {
    let temp = areaToVisit
    if (type === "add") {
      temp[increment + 1] = ""
      const obj = {}
      obj[increment + 1] = ""
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
        <PlaceSearch onChange={() => {}} error={errors?.bookingInfo?.start?.place?.message} register={register("bookingInfo.start.place", { required: "Please fill this info" })} title="Starting Place to Pickup" setValue={setValue} />
      </div>
      {increment && Object.keys(areaToVisit).map((area, index) => {
        return (
          <div key={area} className={"relative " + (index !== areaToVisit - 1 ? "mb-3" : "mb-2")}>
            <PlaceSearch onChange={() => {}} error={errors?.bookingInfo?.visits?.[index].message} reRender={increment} register={register(`bookingInfo.visit.[${index}].place`)} title="Place info to visit" setValue={setValue} />
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
        <PlaceSearch onChange={() => {}} error={errors?.bookingInfo?.end?.place?.message} register={register("bookingInfo.end.place", { required: "Please fill this info" })} title="Ending Place (Final destination)" setValue={setValue} />
      </div>
      <div className="grid grid-cols-2 gap-x-2 mb-3">
        <Numberinput onChange={() => {}} register={register("bookingInfo.passenger.adult")} title="Adult" setValue={setValue} />
        <Numberinput onChange={() => {}} register={register("bookingInfo.passenger.child")} title="Child/Baby" setValue={setValue} />
      </div>
      <div className="grid grid-cols-2 gap-x-2 mb-3">
        <Numberinput onChange={() => {}} register={register("bookingInfo.luggage.big")} title="Big luggage" setValue={setValue} />
        <Numberinput onChange={() => {}} register={register("bookingInfo.luggage.medium")} title="Mid luggage" setValue={setValue} />
      </div>
      <div class="flex items-center mb-5"><input id="terms" type="checkbox" class="font-semibold" /><label for="terms" class="text-sm ml-2 text-left font-medium">I want<span class="ml-1 underline inline text-blue-400">Airport Meeting Service</span><span class="ml-1 inline text-red-500">+ 100B</span></label></div>
      <div className="mb-3"><Textareainput register={register("bookingInfo.message.en")} title="Additional Order and Message" setValue={setValue} /></div>
    </div>
  )
}
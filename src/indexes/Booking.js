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
import { faArrowRight, faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

const Booking = () => {
  const [currentStep, setStep] = useState(0)
  const [bookData, setBookData] = useState({})
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState("")
  const { register, setValue, handleSubmit } = useForm()
  const catagory = [
    {
      title: <div>From A - To B</div>,
      detail: "It is a long established fact that a reader will be distracted by the readable content of a page when looking"
    },
    {
      title: "Hourly / Daily with driver",
      detail: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
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
    // initLine();
  }, []);

  useEffect(() => {
    // initLine();
  }, []);

  const onSubmit = (data) => {
    setStep(currentStep + 1)
    setBookData(data)
  }

  const onConfirm = async () => {
    setLoading(true)
    let dataTemp = bookData
    dataTemp.userId = userId || "U2330f4924d1d5faa190c556e978bee23"
    await axios.post("/booking", dataTemp)
    liff.closeWindow()
  }

  return (
    <div className="grid pt-20 h-screen w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full text-center">
          <div className="flex w-10/12 mx-auto mb-5">
            <div onClick={() => currentStep === 1 && setStep(currentStep - 1)} className={"py-2 text-lg font-semibold w-full rounded-l-lg " + (currentStep === 0 ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-500")}>A  <FontAwesomeIcon className="mx-1" icon={faArrowRightLong} />  B</div>
            <div onClick={() => currentStep === 0 && setStep(currentStep + 1)} className={"py-2 text-lg w-full rounded-r-lg " + (currentStep === 1 ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-500")}>Rent & Hire</div>
          </div>
          <div className="text-xl font-semibold w-10/12 mx-auto mb-3">{catagory[currentStep].title}</div>
          <div className="w-10/12 mx-auto mb-5">{catagory[currentStep].detail}</div>
          <FormTracker currentStep={currentStep} body={[
            <AToBCourse setStep={setStep} register={register} setValue={setValue} />,
            <RentAndHire setStep={setStep} register={register} setValue={setValue} />
          ]} />
          <input type="submit" value="Send" className="py-2 bg-blue-900 text-white text-lg w-10/12 mx-auto rounded-lg mt-8 mb-14" />
        </form>
    </div>
  );
}

export default Booking;

//first page of the booking form
const AToBCourse = ({ setStep, register, setValue }) => {
  const [time, setTime] = useState(new Date())
  const [asap, setAsap] = useState(false)

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-2">
        <div className="mb-3"><Datepicker register={register("pickupDate")} time={time} setTime={setTime} asap={asap} setAsap={setAsap} title="Pickup Date" setValue={setValue} /></div>
        <div className="mb-3"><Timepicker register={register("pickupTime")} time={time} setTime={setTime} asap={asap} setAsap={setAsap} title="Pickup Time" setValue={setValue} /></div>
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("from")} title="From" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("to")} title="To" setValue={setValue} />
      </div>
      <div className="mb-3"><Numberinput onChange={() => {}} register={register("passenger")} title="Passenger (including Child)" setValue={setValue} /></div>
      <div className="mb-3"><Numberinput onChange={() => {}} register={register("luggage")} title="Lugggage (Big + Medium size)" setValue={setValue} /></div>
      <div className="mb-3"><Textareainput register={register("message")} title="Other requests for the correct price" setValue={setValue} /></div>
    </div>
  )
}

//last page of the booking form
const RentAndHire = ({ setStep, register, setValue }) => {
  const [time, setTime] = useState(new Date())
  const [asap, setAsap] = useState(false)
  const [areaToVisit, setAreaToVisit] = useState(1)
  
  useEffect(() => {
    
  }, [])

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-2">
        <div className="mb-3"><Datepicker register={register("pickupDate")} time={time} setTime={setTime} asap={asap} setAsap={setAsap} title="Starting Date" setValue={setValue} /></div>
        <div className="mb-3"><Timepicker register={register("pickupTime")} time={time} setTime={setTime} asap={asap} setAsap={setAsap} title="Starting Time" setValue={setValue} /></div>
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("from")} title="Starting Place" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        {[...Array(areaToVisit)].map((area, index) => <Textinput onChange={() => {}} register={register("to")} title="Area info to visit" setValue={setValue} />)}
      </div>
      <div className="grid grid-cols-2 gap-x-2">
        <div className="mb-3"><Datepicker register={register("pickupDate")} time={time} setTime={setTime} asap={asap} setAsap={setAsap} title="Ending Date" setValue={setValue} /></div>
        <div className="mb-3"><Timepicker register={register("pickupTime")} time={time} setTime={setTime} asap={asap} setAsap={setAsap} title="Ending Time" setValue={setValue} /></div>
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("from")} title="Ending Place (Final destination)" setValue={setValue} />
      </div>
      <div className="mb-3"><Numberinput onChange={() => {}} register={register("passenger")} title="Passenger (including Child)" setValue={setValue} /></div>
      <div className="mb-3"><Numberinput onChange={() => {}} register={register("luggage")} title="Lugggage (Big + Medium size)" setValue={setValue} /></div>
      <div className="mb-3"><Textareainput register={register("message")} title="Other requests for the correct price" setValue={setValue} /></div>
    </div>
  )
}
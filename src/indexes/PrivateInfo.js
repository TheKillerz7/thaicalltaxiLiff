import { useEffect, useState } from "react";
import Textinput from "../components/Textinput";
import FormTracker from "../partials/FormTracker";
import { useForm } from "react-hook-form"
import liff from '@line/liff';
import { updateBooking } from "../apis/backend";
import Numberinput from "../components/Numberinput";
import Dropdown from "../components/Dropdown";

const PrivateInfo = () => {
  const [currentStep, setStep] = useState(0)
  const [bookData, setBookData] = useState({})
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState("")
  const catagory = [
    {
      title: "Booking for Yourself, Your Group",
      detail: ""
    },
    {
      title: "Booking for other person",
      detail: "For your Friends, Family or Agent's customers"
    }
  ]
  const { register, setValue, handleSubmit } = useForm()

  const initLine = () => {
    liff.init({ liffId: '1657246657-9zmMqva5' }, () => {
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
    initLine();
  }, []);

  useEffect(() => {
    
  }, [currentStep]);

  const onSubmit = (data) => {
    // setStep(currentStep + 1)
    console.log(data)
    setBookData(data)
  }

  const onConfirm = async () => {
    const params = new URLSearchParams(window.location.search)
    setLoading(true)
    let dataTemp = bookData
    await updateBooking(params.get("bookingId"), userId, dataTemp)
    liff.closeWindow()
  }

  return (
    <div className="grid pt-20 h-screen w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full text-center">
          <div className="flex w-10/12 mx-auto mb-5">
            <div onClick={() => currentStep === 1 && setStep(currentStep - 1)} className={"py-2 text-lg w-full rounded-l-lg " + (currentStep === 0 ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-500")}>For me</div>
            <div onClick={() => currentStep === 0 && setStep(currentStep + 1)} className={"py-2 text-lg w-full rounded-r-lg " + (currentStep === 1 ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-500")}>For others</div>
          </div>
          <div className="text-md font-semibold w-10/12 mx-auto mb-3">{catagory[currentStep].title}</div>
          <div className="w-10/12 mx-auto mb-5 text-sm">{catagory[currentStep].detail}</div>
          <FormTracker currentStep={currentStep} body={[
            <ForMeForm setStep={setStep} register={register} setValue={setValue} />,
            <AgentForm setStep={setStep} register={register} setValue={setValue} />
          ]} />
          <input type="submit" value="Send" className="py-2 bg-blue-900 text-white text-lg w-10/12 mx-auto rounded-lg mt-8 mb-14" />
        </form>
    </div>
  );
}

export default PrivateInfo;

//first page of the booking form
const ForMeForm = ({ register, setValue }) => {
  return (
    <div>
      <div className={"mb-3" }>
        <Dropdown onChange={() => {}} register={register("customerName")} options={["Mr.", "Ms."]} title="Title" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("name")} title="Meeting Name (English)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Numberinput onChange={() => {}} register={register("phone")} title="Mobile Number" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("flight")} title="Contact for urgent (Optional)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("flight")} title="Arrival Flight No. (Airport Pickup)" setValue={setValue} />
      </div>
    </div>
  )
}

//last page of the booking form
const AgentForm = ({ setStep, register, setValue }) => {
  useEffect(() => {
    
  }, [])

  return (
    <div>
      <div className={"mb-3" }>
        <Dropdown onChange={() => {}} register={register("customerName")} options={["Mr.", "Ms."]} title="Passenger's Title" setValue={setValue} />
      </div>
      <div className={"mb-3" }>
        <Textinput onChange={() => {}} register={register("customerName")} title="Passenger's Name (English)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("customerPhone")} title="Passenger's Contact (Mobile, App)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("agentName")} title="Agent/Your Name (English)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("agentPhone")} title="Agent/Your Contact (Mobile, App)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Dropdown onChange={() => {}} register={register("agentPhone")} title="Payment Method (Needed before service)" options={["Cash", "Online banking", "Others (Discuss with driver)"]} setValue={setValue} />
      </div>
      <div className="text-left mt-2">
        <input {...register("meetingName")} className="mr-3" type="checkbox" id="agent" name="agent" value={true} />
        <label className="text-sm" for="agent">Use agent's name for meeting?</label><br></br>
      </div>
    </div>
  )
}
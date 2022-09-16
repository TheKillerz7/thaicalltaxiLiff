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
import { updateBooking } from "../apis/backend";
import { useParams } from "react-router-dom";

const PrivateInfo = () => {
  const [currentStep, setStep] = useState(0)
  const [bookData, setBookData] = useState({})
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState("")

  const { register, setValue, handleSubmit } = useForm()
  const { bookingId } = useParams()

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

  const onSubmit = (data) => {
    setStep(currentStep + 1)
    setBookData(data)
  }

  const onConfirm = async () => {
    setLoading(true)
    let dataTemp = bookData
    await updateBooking(bookingId, dataTemp)
    liff.closeWindow()
  }

  return (
    <div className="grid pt-20 h-screen w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full text-center">
            <div className="text-4xl font-semibold mb-10">Private Form</div>
            <FormTracker currentStep={currentStep} body={[
              <PickupInfoForm setStep={setStep} register={register} setValue={setValue} />,
              <ConfirmInfoForm setStep={setStep} register={register} setValue={setValue} />
            ]} />
            {currentStep === 0 && <input type="submit" value="Next" className="py-2 bg-blue-900 text-white text-lg w-10/12 mx-auto rounded-lg mt-10" />}
            {currentStep === 1 &&
              <div className="w-10/12 mx-auto grid grid-cols-2 gap-x-5">
                <div onClick={() => setStep(currentStep - 1)} className="py-2 bg-blue-900 text-white text-lg w-full rounded-lg mt-10">Back</div>
                <div onClick={onConfirm} className={"py-2 bg-blue-900 text-white text-lg w-full rounded-lg mt-10 transition " + (!loading ? "opacity-100" : "opacity-80 pointer-events-none")}>Confirm</div>
              </div>
            }
        </form>
    </div>
  );
}

export default PrivateInfo;

//first page of the booking form
const PickupInfoForm = ({ register, setValue }) => {
  return (
    <div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("name")} title="Name" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("phone")} title="Phone" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("flight")} title="Flight No." setValue={setValue} />
      </div>
    </div>
  )
}

//last page of the booking form
const ConfirmInfoForm = ({ setStep, register, setValue }) => {
  useEffect(() => {
    
  }, [])

  return (
    <div>
      <div className="text-xl font-medium text-left mb-3">Confirmation</div>
      
    </div>
  )
}
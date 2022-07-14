import { useEffect, useState } from "react";
import Textinput from "../components/Textinput";
import FormTracker from "../partials/FormTracker";
import { useForm } from "react-hook-form"
import Datepicker from "../components/Datepicker";
import Numberinput from "../components/Numberinput";
import Textareainput from "../components/Textareainput";
import liff from '@line/liff';

const Booking = () => {
  const [currentStep, setStep] = useState(0)
  const { register, setValue } = useForm()

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
    setIdToken(idToken);
    liff.getProfile().then(profile => {
      console.log(profile);
    }).catch(err => console.error(err));
  }

  useEffect(() => {
    initLine();
  }, []);

  return (
    <div className="grid pt-20 h-screen w-full">
        <div className="w-full text-center">
            <div className="text-4xl font-semibold mb-10">Booking Form</div>
            <FormTracker currentStep={currentStep} body={[
              <PickupInfoForm setStep={setStep} register={register} setValue={setValue} />,
              <PersonalInfoForm setStep={setStep} register={register} setValue={setValue} />,
              <ConfirmInfoForm setStep={setStep} register={register} setValue={setValue} />
            ]} />
            {currentStep === 0 && <div onClick={() => setStep(currentStep + 1)} className="py-2 bg-blue-900 text-white text-lg w-10/12 mx-auto rounded-lg mt-10">Next</div>}
            {currentStep === 1 &&
              <div className="w-10/12 mx-auto grid grid-cols-2 gap-x-5">
                <div onClick={() => setStep(currentStep - 1)} className="py-2 bg-blue-900 text-white text-lg w-full rounded-lg mt-10">Back</div>
                <div className="py-2 bg-blue-900 text-white text-lg w-full rounded-lg mt-10">Confirm</div>
              </div>
            }
        </div>
    </div>
  );
}

export default Booking;

//first page of the booking form
const PickupInfoForm = ({ setStep, register, setValue }) => {
  return (
    <div>
      <div className="text-xl font-medium text-left mb-3">Pick-up Information</div>
      <div className="grid grid-cols-2 gap-x-2">
        <div className="mb-3"><Datepicker register={register("pickupDate")} title="Pickup Date" setValue={setValue} /></div>
        <div className="mb-3"><Datepicker register={register("pickupDate")} title="Pickup Time" setValue={setValue} /></div>
      </div>
      <div className="mb-3"><Textinput register={register("pickupDate")} title="From" setValue={setValue} /></div>
      <div className="mb-3"><Textinput register={register("pickupDate")} title="To" setValue={setValue} /></div>
      <div className="grid grid-cols-2 gap-x-2">
        <div className="mb-3"><Numberinput register={register("pickupDate")} title="Passenger" setValue={setValue} /></div>
        <div className="mb-3"><Numberinput register={register("pickupDate")} title="Lugggage" setValue={setValue} /></div>
      </div>
      <div className="mb-3"><Textareainput register={register("pickupDate")} title="Message to drivers" setValue={setValue} /></div>
    </div>
  )
}

//second page of the booking form
const PersonalInfoForm = ({ setStep, register, setValue }) => {
  return (
    <div>
      <div className="text-xl font-medium text-left mb-3">Pick-up Information</div>
      <div className="mb-3"><Textinput register={register("pickupDate")} title="Name" setValue={setValue} /></div>
      <div className="mb-3"><Textareainput register={register("pickupDate")} title="Message to drivers" setValue={setValue} /></div>
    </div>
  )
}

//last page of the booking form
const ConfirmInfoForm = ({ setStep, register, setValue }) => {
  return (
    <div>
      <div className="text-xl font-medium text-left mb-3">Pick-up Information</div>
      <div className="mb-3"><Datepicker register={register("pickupDate")} title="Pickup Date" setValue={setValue} /></div>
      <div className="mb-3"><Textinput register={register("pickupDate")} title="From" setValue={setValue} /></div>
      <div className="mb-3"><Textinput register={register("pickupDate")} title="To" setValue={setValue} /></div>
      <div className="grid grid-cols-2 gap-x-2">
        <div className="mb-3"><Numberinput register={register("pickupDate")} title="Passenger" setValue={setValue} /></div>
        <div className="mb-3"><Numberinput register={register("pickupDate")} title="Lugggage" setValue={setValue} /></div>
      </div>
    </div>
  )
}
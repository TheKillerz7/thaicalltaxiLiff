import { useState } from "react";
import Textinput from "../components/Textinput";
import FormTracker from "../partials/FormTracker";
import { useForm } from "react-hook-form"
import Datepicker from "../components/Datepicker";
import Numberinput from "../components/Numberinput";
import Textareainput from "../components/Textareainput";

const Booking = () => {
  const [currentStep, setStep] = useState(1)
  const { register, setValue } = useForm()

  return (
    <div className="grid place-items-center h-screen w-full">
        <div className="w-full h-2/3 text-center">
            <div className="text-4xl font-semibold mb-10">Booking Form</div>
            <FormTracker currentStep={currentStep} body={[
              <PickupInfoForm setStep={setStep} register={register} setValue={setValue} />,
              <PersonalInfoForm setStep={setStep} register={register} setValue={setValue} />,
              <ConfirmInfoForm setStep={setStep} register={register} setValue={setValue} />
            ]} />
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
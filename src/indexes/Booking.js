import FormTracker from "../partials/FormTracker";

const Booking = () => {
  return (
    <div className="grid place-items-center h-screen w-full">
        <div className="w-full text-center">
            <div className="text-3xl font-semibold mb-5">Booking Form</div>
            <FormTracker />
        </div>
    </div>
  );
}

export default Booking;

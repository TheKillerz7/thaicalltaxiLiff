import PlaceSearch from "../components/PlaceSearch"
import { useForm } from "react-hook-form"
import { useScript } from "../apis/useScript"

const Test = () => {
    const { register, setValue, handleSubmit } = useForm()
    const scriptStatus = useScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyACgdM4gHsoZA-JBVSdUPy5B2h70tq2ATU&libraries=places")

    const onSubmit = async (data) => {
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid place-items-center px-3 py-20">
            {scriptStatus === "ready" && <div className="w-full"><PlaceSearch onChange={() => {}} register={register("bookingInfo.passenger.adult")} title="Adult" setValue={setValue} /></div>}
            <button type="submit">ds</button>
        </form>
    )
}

export default Test
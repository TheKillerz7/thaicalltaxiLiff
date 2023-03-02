import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import liff from '@line/liff';
import Textareainput from "../components/Textareainput";
import { getRatingByBookingId, ratingDriver } from "../apis/backend";

const RateDriver = () => {
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState("")
  const [rating, setRating] = useState(5)

  const { register, setValue, handleSubmit, unregister } = useForm()

  const initLine = () => {
    liff.init({ liffId: '1657246657-bq6mzakA' }, () => {
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
    const params = new URLSearchParams(window.location.search)
    const callback = async () => {
      const rating = await getRatingByBookingId(params.get("bookingId"))
      if (!rating.length) {
        alert("You've already rated your driver.")
        liff.closeWindow()
      }
    }
    callback()
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    const params = new URLSearchParams(window.location.search)
    data.starRate = rating
    data.userId = userId
    data.bookingId = params.get("bookingId")
    data.driverId = params.get("driverId")
    console.log(data)
    await ratingDriver(data)
    alert("Thank you\nHave a nice time!")
    setLoading(false)
    liff.closeWindow()
  }

  return (
    <div className="flex pt-20 h-screen w-full items-center justify-start flex-col px-5">
      <div className="text-2xl font-semibold mb-10"></div>
      <form onSubmit={handleSubmit(onSubmit)} style={{ boxShadow: "0px 2px 5px 1px rgba(0, 0, 0, 0.15)" }} className="w-full px-5 py-3 mb-20">
        <div className="font-bold text-xl">How's your driver?</div>
        <div className="flex items-center mt-2">
          <div className="mr-2">Your Rating:</div>
          <div className="flex items-center">
            <svg aria-hidden="true" onClick={() => setRating(1)} className={"w-7 h-7 transition " + (rating >= 1 ? "text-yellow-400" : "text-gray-300")} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path className="cursor-pointer" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <svg aria-hidden="true" onClick={() => setRating(2)} className={"w-7 h-7 transition " + (rating >= 2 ? "text-yellow-400" : "text-gray-300")} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path className="cursor-pointer" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <svg aria-hidden="true" onClick={() => setRating(3)} className={"w-7 h-7 transition " + (rating >= 3 ? "text-yellow-400" : "text-gray-300")} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path className="cursor-pointer" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <svg aria-hidden="true" onClick={() => setRating(4)} className={"w-7 h-7 transition " + (rating >= 4 ? "text-yellow-400" : "text-gray-300")} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path className="cursor-pointer" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <svg aria-hidden="true" onClick={() => setRating(5)} className={"w-7 h-7 transition " + (rating >= 5 ? "text-yellow-400" : "text-gray-300")} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path className="cursor-pointer" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          </div>
        </div>
        <div className="mt-3"><Textareainput register={register("comment")} title="Comment" setValue={setValue} /></div>
        <input type="submit" value="Send" className={"py-2 bg-blue-900 text-white w-full rounded-lg mt-3 " + (loading && "opacity-70 pointer-events-none")} />
      </form>
    </div>
  );
}

export default RateDriver;
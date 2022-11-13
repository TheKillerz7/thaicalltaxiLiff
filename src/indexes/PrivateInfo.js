import { useEffect, useState } from "react";
import Textinput from "../components/Textinput";
import FormTracker from "../partials/FormTracker";
import { useForm } from "react-hook-form"
import liff from '@line/liff';
import { getBookingById, updateBooking } from "../apis/backend";
import Numberinput from "../components/Numberinput";
import Dropdown from "../components/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faBook, faBriefcase, faUser } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const PrivateInfo = () => {
  const [bookerType, setBookerType] = useState("forme")
  const [bookData, setBookData] = useState({})
  const [bookingInfo, setBookingInfo] = useState({})
  const [loading, setLoading] = useState(false)
  const [onConfirmation, setOnConfirmation] = useState(false)
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

  const { register, setValue, handleSubmit, unregister } = useForm()

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
    unregister("")
  }, [bookerType])

  const onNext = async (data) => {
    const params = new URLSearchParams(window.location.search)
    const booking = (await getBookingById("PG0Xx91dZU")).data[0]
    booking.bookingInfo = JSON.parse(booking.bookingInfo)
    console.log(data)
    setBookingInfo(booking)
    setBookData({...data})
    setOnConfirmation(true)
  }

  const onSubmit = async () => {
    const params = new URLSearchParams(window.location.search)
    setLoading(true)
    let dataTemp = {
      bookerType: bookerType,
      personalInfo: JSON.stringify(bookData.personalInfo)
    }
    console.log(dataTemp)
    await updateBooking("PG0Xx91dZU", userId, dataTemp)
    liff.closeWindow()
  }

  return (
    <div className="grid pt-10 h-screen w-full">
        <form onSubmit={handleSubmit(onNext)} className="w-full">
          {!onConfirmation &&
            <>
              <div className="flex w-10/12 mx-auto mb-5 text-center">
                <div onClick={() => bookerType === "forothers" && setBookerType("forme")} className={"py-2 text-lg w-full rounded-l-lg " + (bookerType === "forme" ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-500")}>For me</div>
                <div onClick={() => bookerType === "forme" && setBookerType("forothers")} className={"py-2 text-lg w-full rounded-r-lg " + (bookerType === "forothers" ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-500")}>For others</div>
              </div>
              <div className="text-md font-semibold w-10/12 mx-auto mb-3 text-center">{catagory[bookerType === "forme" ? 0 : 1].title}</div>
              <div className="w-10/12 mx-auto mb-5 text-sm text-center">{catagory[bookerType === "forme" ? 0 : 1].detail}</div>
            </>
          }
          <div className={"" + (onConfirmation && "hidden")}>
            <FormTracker currentStep={bookerType === "forme" ? 0 : 1} body={[
              <ForMeForm setBookerType={setBookerType} register={register} setValue={setValue} />,
              <AgentForm setBookerType={setBookerType} register={register} setValue={setValue} />
            ]} />
          </div>
          {onConfirmation && 
            <div className="w-11/12 mx-auto">
              <div className="text-2xl font-semibold text-center mb-8">Confirmation</div>
              <div className="text-xl text-left mb-3 font-medium"><span><FontAwesomeIcon className="text-blue-800 mr-3" icon={faBook} /></span>Booking Info</div>
              <div className="bg-blue-50 rounded-lg py-4 px-4 mb-5">
                {bookingInfo.bookingType === "R&H" ?
                  <div className="">
                    <div className="font-semibold">{bookingInfo.bookingInfo.start.place.name}</div>
                    <div className="-mt-1"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} /></div>
                    {bookingInfo.bookingInfo.visit.length && (
                      <div>
                          <div>
                              {bookingInfo.bookingInfo.visit.map((place, index) => {
                                  return (
                                      <div className="flex items-center">
                                          <div style={{ aspectRatio: "1" }} className="relative border-4 w-4 h-4 rounded-full border-yellow-600 font-bold mr-2">
                                              {index !== 0 && <div className="absolute bottom-full h-5 left-1/2 -translate-x-1/2 w-1 bg-yellow-600"></div>}
                                          </div>
                                          {place.place}
                                      </div>
                                  )
                              })}
                          </div>
                          <div className="-mb-1"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} /></div>
                      </div>
                    )}
                    <div className="font-semibold mb-3">{bookingInfo.bookingInfo.end.place.name}</div>
                    <table className="">
                      <tbody>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Course:</td>
                          <td className="align-top pl-2">Rent & Hire</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Type:</td>
                          <td className="align-top pl-2">{bookingInfo.bookingInfo.type}</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Starting:</td>
                          <td className="align-top pl-2">{bookingInfo.bookingInfo.start.pickupDate}</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Ending:</td>
                          <td className="align-top pl-2">{bookingInfo.bookingInfo.end.pickupDate}</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Car Type:</td>
                          <td className="align-top pl-2">{bookingInfo.bookingInfo.carType}</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Passenger:</td>
                          <td className="align-top pl-2">{`${bookingInfo.bookingInfo.passenger.adult} adults, ${bookingInfo.bookingInfo.passenger.adult} children`}</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Luggage:</td>
                          <td className="align-top pl-2">{`${bookingInfo.bookingInfo.luggage.big} big, ${bookingInfo.bookingInfo.luggage.medium} medium`}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  :
                  <div className="">
                    <div className="font-semibold">{bookingInfo.bookingInfo.from.name}</div>
                    <div className="-my-1"><FontAwesomeIcon className="text-blue-900 mr-2" icon={faArrowDown} /></div>
                    <div className="font-semibold mb-3">{bookingInfo.bookingInfo.to.name}</div>
                    <table className="">
                      <tbody>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Course:</td>
                          <td className="align-top pl-2">A to B Course</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Date:</td>
                          <td className="align-top pl-2">{bookingInfo.bookingInfo.pickupDate}</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Car Type:</td>
                          <td className="align-top pl-2">{bookingInfo.bookingInfo.carType}</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Passenger:</td>
                          <td className="align-top pl-2">{`${bookingInfo.bookingInfo.passenger.adult} adults, ${bookingInfo.bookingInfo.passenger.adult} children`}</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Luggage:</td>
                          <td className="align-top pl-2">{`${bookingInfo.bookingInfo.luggage.big} big, ${bookingInfo.bookingInfo.luggage.medium} medium`}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                }
              </div>
              <div className="text-xl text-left mb-3 font-medium"><span><FontAwesomeIcon className="text-blue-800 mr-3" icon={faUser} /></span>Personal Info</div>
              <div className="bg-blue-50 rounded-lg py-4 px-4 mb-5">
                {bookerType === "forme" ?
                  <div>
                    <table className="">
                      <tbody>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Book For:</td>
                          <td className="align-top pl-2">For myself</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Name:</td>
                          <td className="align-top pl-2">{bookData.personalInfo.title + bookData.personalInfo.name}</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Phone:</td>
                          <td className="align-top pl-2">{bookData.personalInfo.phone}</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Contact:</td>
                          <td className="align-top pl-2">{bookData.personalInfo.contact || "None"}</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Flight:</td>
                          <td className="align-top pl-2">{bookData.personalInfo.flight || "None"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  :
                  <div>
                    <div className="text-lg mb-2"><span className="font-semibold">Book:</span> Agent/For others</div>
                    <div className="font-medium mb-1">Passenger info</div>
                    <table className="mb-2">
                      <tbody>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium pl-3">Name:</td>
                          <td className="align-top pl-2">{bookData.personalInfo.passenger.title + bookData.personalInfo.passenger.name}</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium pl-3">Contact:</td>
                          <td className="align-top pl-2">{bookData.personalInfo.passenger.contact}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="font-medium mb-1">Your info</div>
                    <table className=" pl-3">
                      <tbody>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium pl-3">Name:</td>
                          <td className="align-top pl-2">{bookData.personalInfo.agent.name}</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium pl-3">Contact:</td>
                          <td className="align-top pl-2">{bookData.personalInfo.agent.contact}</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium pl-3">Payment:</td>
                          <td className="align-top pl-2">{bookData.personalInfo.agent.payment}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                }
              </div>
              <div>
                <div className="bg-blue-50 rounded-lg relative">
                  <div className="border-b-2 border-gray-400 h-full w-full border-dashed py-4 px-4">
                    <div className="text-lg mb-3"><span className="font-semibold">Car Type:</span> dsa</div>
                    <table>
                      <tbody>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Course Price:</td>
                          <td className="align-top pl-2">25</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Tollway:</td>
                          <td className="align-top pl-2">36</td>
                        </tr>
                        <tr>
                          <td className="align-top whitespace-nowrap font-medium">Payment:</td>
                          <td className="align-top pl-2">25</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="absolute w-5 h-5 border bg-white border-gray-400 top-full left-0 -translate-y-1/2 -translate-x-1/2 rounded-full">
                    <div style={{ left: "-2px" }} className="absolute w-5 h-10 bg-white -translate-x-1/2 top-1/2 -translate-y-1/2"></div>
                  </div>
                  <div className="absolute w-5 h-5 border bg-white border-gray-400 top-full right-0 -translate-y-1/2 translate-x-1/2 rounded-full">
                    <div className="absolute w-5 h-10 bg-white translate-x-1/2 top-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
                <div className="flex bg-blue-50 rounded-md py-3 px-4">
                  <div className="text-lg font-semibold mr-2">Total:</div>
                  <div className="text-lg font-semibold text-green-600">B 3215</div>
                </div>
              </div>
              <div className="mt-6 mb-3 text-red-600 text-sm font-medium">Note: If you want to change booking info, please contact your driver by using our "Chatting Room" menu.</div>
            </div>
          }
          {onConfirmation ?
            <div className="grid grid-cols-2 gap-x-3 w-11/12 mx-auto">
              <div onClick={() => setOnConfirmation(false)} className="py-2 bg-blue-900 text-center text-white text-lg rounded-lg mb-14">Back</div>
              <div onClick={onSubmit} className="py-2 bg-blue-900 text-center text-white text-lg rounded-lg mb-14">Confirm</div>
            </div>
            :
            <div className="w-10/12 mx-auto" ><input className="py-2 bg-blue-900 text-center text-white text-lg w-full rounded-lg mt-8 mb-14" type="submit" value="Next"  /></div>
          }
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
        <Dropdown onChange={() => {}} register={register("personalInfo.title")} options={["Mr.", "Ms."]} title="Title" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("personalInfo.name")} title="Meeting Name (English)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Numberinput onChange={() => {}} register={register("personalInfo.phone")} title="Mobile Number" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("personalInfo.contact")} title="Contact for urgent (Optional)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("personalInfo.flight")} title="Arrival Flight No. (Airport Pickup)" setValue={setValue} />
      </div>
    </div>
  )
}

//last page of the booking form
const AgentForm = ({ register, setValue }) => {
  return (
    <div>
      <div className={"mb-3" }>
        <Dropdown onChange={() => {}} register={register("personalInfo.passenger.title")} options={["Mr.", "Ms."]} title="Passenger's Title" setValue={setValue} />
      </div>
      <div className={"mb-3" }>
        <Textinput onChange={() => {}} register={register("personalInfo.passenger.name")} title="Passenger's Name (English)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("personalInfo.passenger.contact")} title="Passenger's Contact (Mobile, App)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("personalInfo.agent.name")} title="Agent/Your Name (English)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("personalInfo.agent.contact")} title="Agent/Your Contact (Mobile, App)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Dropdown onChange={() => {}} register={register("personalInfo.agent.payment")} title="Payment Method (Needed before service)" options={["Cash", "Online banking", "Others (Discuss with driver)"]} setValue={setValue} />
      </div>
      <div className="text-left mt-2">
        <input {...register("personalInfo.useAgentName")} className="mr-3" type="checkbox" id="agent" name="agent" value={true} />
        <label className="text-sm" for="agent">Use agent's name for meeting?</label><br></br>
      </div>
    </div>
  )
}
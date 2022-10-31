import { useEffect, useState } from "react";
import Textinput from "../components/Textinput";
import FormTracker from "../partials/FormTracker";
import { useForm } from "react-hook-form"
import Datepicker from "../components/Datepicker";
import Numberinput from "../components/Numberinput";
import Textareainput from "../components/Textareainput";
import liff from '@line/liff';
import axios from 'axios'
import Dropdown from "../components/Dropdown";
import Imageinput from "../components/Imageinput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { createDriver } from "../apis/backend";

const Driver = () => {
  const [currentStep, setStep] = useState(0)
  const [userId, setUserId] = useState("")
  const { register, setValue, handleSubmit, unregister } = useForm()

  const initLine = () => {
    liff.init({ liffId: '1657246657-4pdxrLem' }, () => {
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
      console.log(profile);
      setUserId(profile.userId)
    }).catch(err => console.error(err));
  }

  useEffect(() => {
    initLine();
  }, []);

  const onConfirm = async (data) => {
    let dataTemp = data
    dataTemp.driverId = userId
    console.log(dataTemp)
    await createDriver(dataTemp)
    liff.closeWindow()
  }

  return (
    <div className="grid pt-20 h-screen w-full">
        <form onSubmit={handleSubmit(onConfirm)} className="w-full text-center">
            <div className="text-4xl font-semibold mb-10">Register Driver</div>
            <div className={"w-10/12 mx-auto " + (!currentStep ? "block" : "hidden")}>
              <PickupInfoForm setStep={setStep} register={register} unregister={unregister} setValue={setValue} />
            </div>
            <div className={"w-10/12 mx-auto " + (currentStep ? "block" : "hidden")}>
              <ConfirmInfoForm setStep={setStep} register={register} setValue={setValue} />
            </div>
            {currentStep === 0 && <div onClick={() => setStep(currentStep + 1)} className="py-2 bg-blue-900 mx-auto w-10/12 mx-auto mb-10 text-white text-lg w-full rounded-lg mt-10">Next</div>}
            {currentStep === 1 &&
              <div className="w-10/12 mx-auto grid grid-cols-2 gap-x-5 mt-10">
                <div onClick={() => setStep(currentStep - 1)} className="py-2 bg-blue-900 text-white text-lg w-full rounded-lg">Back</div>
                <input type="submit" value="Send" className="py-2 bg-blue-900 text-white text-lg rounded-lg" />
              </div>
            }
        </form>
    </div>
  );
}

export default Driver;

//first page of the booking form
const PickupInfoForm = ({ setStep, register, unregister, setValue }) => {
  const [reRender, setRender] = useState(1)
  const [tableCount, setTableCount] = useState({1: ""})
  const [years, setYears] = useState([])

  useEffect(() => {
    const date = new Date()
    let yearArray = []
    for (let i = date.getFullYear() - 18; i >= date.getFullYear() - 60; i--) {
      yearArray.push(i.toString())
    } 
    setYears([...yearArray])
  }, []);

  const addContactHandle = (id, type, index) => {
    let temp = tableCount
    if (type === "add") {
      temp[reRender + 1] = ""
      setTableCount(temp)
      setRender(reRender + 1)
      return
    }
    unregister(`personalInfo.contact`)
    delete temp[id]
    setTableCount(temp)
    setRender(reRender + 1)
  }

  return (
    <div>
      <div className="text-xl font-medium text-left mb-3">ข้อมูลส่วนตัว</div>
      <div className={"mb-3 " }>
        <Dropdown onChange={() => {}} register={register("personalInfo.title")} title="คำนำหน้า" options={["Mr.", "Mrs."]} setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("personalInfo.name")} title="ชื่อจริง-นามสกุล (อังกฤษ)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Dropdown onChange={() => {}} register={register("personalInfo.birth")} title="ปีเกิด" options={years} setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Numberinput onChange={() => {}} register={register("personalInfo.citizenId")} title="หมายเลขบัตรประชาชน" setValue={setValue} />
      </div>
      <div className={"mb-3 grid grid-cols-2 gap-x-3 " }>
        <Numberinput onChange={() => {}} register={register("personalInfo.driverLicense")} title="หมายเลขใบขับขี่" setValue={setValue} />
        <Textinput onChange={() => {}} register={register("personalInfo.driverLicenseType")} title="ประเภทใบขับขี่" setValue={setValue} />
      </div>
      {reRender && Object.keys(tableCount).map((count, index) => {
        return (
          <div key={count} className={"flex " + (Object.keys(tableCount).length !== index + 1 ? "mb-3" : "mb-2")}>
            <div className="grid grid-cols-2 gap-x-2">
              <Textinput onChange={() => {}} register={register(`personalInfo.contact.[${index}].title`)} title="ช่องทางติดต่อ" setValue={setValue} />
              <Textinput onChange={() => {}} register={register(`personalInfo.contact.[${index}].id`)} title="ไอดี/เบอร์" setValue={setValue} />
            </div>
            {index !== 0 && <div onClick={() => addContactHandle(count, "remove", index)} style={{ aspectRatio: "1" }} className="ml-2 bg-blue-900 h-8 rounded-md grid place-items-center"><FontAwesomeIcon className="text-sm text-white" icon={faTrash} /></div>}
          </div>
        )
      })}
      <div onClick={() => addContactHandle("", "add")} className="text-white font-medium rounded-md bg-blue-900 w-max py-2 px-2 text-sm cursor-pointer text-left mb-5">+ เพิ่มช่องทางการติดต่อ</div>
      <div className="mb-3">
        <Textareainput onChange={() => {}} register={register("personalInfo.address")} title="ที่อยู่ปัจจุบัน" setValue={setValue} />
      </div>
      <div className="text-left font-semibold mt-3 mb-1">ช่องทางการติดต่อฉุกเฉิน</div>
      <div className="flex mb-3">
        <div className="grid grid-cols-2 gap-x-2">
          <Textinput onChange={() => {}} register={register(`personalInfo.urgentContact.title`)} title="เจ้าของเบอร์" setValue={setValue} />
          <Textinput onChange={() => {}} register={register(`personalInfo.urgentContact.id`)} title="เบอร์โทรศัพท์" setValue={setValue} />
        </div>
      </div>
      {/* <div className="mb-3">
        <Textinput onChange={() => {}} register={register("personalInfo.team")} title="ชื่อทีม (ไม่บังคับ)" setValue={setValue} />
      </div> */}
    </div>
  )
}

//last page of the booking form
const ConfirmInfoForm = ({ setStep, register, setValue }) => {
  const [years, setYears] = useState([])

  useEffect(() => {
    const date = new Date()
    let yearArray = []
    for (let i = date.getFullYear(); i >= date.getFullYear() - 10; i--) {
      yearArray.push(i.toString())
    } 
    setYears(yearArray)
  }, []);

  return (
    <div>
      {years.length > 0 && 
        <>
          <div className="text-xl font-medium text-left mb-3">ข้อมูลยานพาหนะ</div>
          <div className={"mb-3 grid grid-cols-2 gap-x-3 " }>
            <Dropdown onChange={() => {}} register={register("vehicleInfo.carSize")} title="ขนาดของรถ" options={["Economy size", "Sedan size", "Family size", "Minibus size", "VIP Van", "VIP Car"]} setValue={setValue} />
            <Textinput onChange={() => {}} register={register("vehicleInfo.carModel")} title="ชื่อรุ่นของรถ" setValue={setValue} />
          </div>
          <div className={"mb-3 " }>
            <Dropdown onChange={() => {}} register={register("vehicleInfo.birth")} title="ปีเกิดของรถ" options={years} setValue={setValue} />
          </div>
          <div className={"mb-3 grid grid-cols-2 gap-x-3 " }>
            <Textinput onChange={() => {}} register={register("vehicleInfo.plateNo")} title="เลขทะเบียนรถ" setValue={setValue} />
            <Dropdown onChange={() => {}} register={register("vehicleInfo.plateColor")} title="สีทะเบียนรถ" options={["Green", "Yellow", "White"]} setValue={setValue} />
          </div>
          <div className={"mb-3 " }>
            <Dropdown onChange={() => {}} register={register("vehicleInfo.insurance")} title="ชั้นของประกันรถ" options={["Level 1", "Level 2", "Level 3"]} setValue={setValue} />
          </div>
          {/* <div className={"mb-3 " }>
            <Imageinput onChange={() => {}} register={register("image.")} title="Address (Current address)" setValue={setValue} />
          </div>
          <div className={"mb-3 " }>
            <Imageinput onChange={() => {}} register={register("image.")} title="Address (Current address)" setValue={setValue} />
          </div>
          <div className={"mb-3 " }>
            <Imageinput onChange={() => {}} register={register("image.")} title="Address (Current address)" setValue={setValue} />
          </div> */}
        </>
      }
    </div>
  )
}
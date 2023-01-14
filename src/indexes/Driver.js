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
import { createDriver, getDriverById, getDriverImage, uploadImage } from "../apis/backend";

const Driver = () => {
  const [currentStep, setStep] = useState(0)
  const [userId, setUserId] = useState("")
  const [driverInfo, setDriverInfo] = useState([])
  const [images, setImages] = useState([])
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

  useEffect(() => {
    if (!userId) return
    const callback = async () => {
      const driver = (await getDriverById(userId)).data[0]
      if (!driver) return
      const image = (await getDriverImage(userId)).data
      setImages([...image])
      driver.personalInfo = JSON.parse(driver.personalInfo)
      driver.vehicleInfo = JSON.parse(driver.vehicleInfo)
      setDriverInfo([driver])
    }
    callback()
  }, [userId]);

  const onConfirm = async (data) => {
    let dataTemp = data
    dataTemp.driverId = userId
    await createDriver(dataTemp)
    liff.closeWindow()
  }

  return (
    <div className="grid pt-20 h-screen w-full">
        <form onSubmit={handleSubmit(onConfirm)} className="w-full text-center">
            <div className="text-4xl font-semibold mb-10">Register Driver</div>
            <div className={"w-10/12 mx-auto " + (!currentStep ? "block" : "hidden")}>
              <PickupInfoForm driverInfo={driverInfo} setStep={setStep} register={register} unregister={unregister} setValue={setValue} />
            </div>
            <div className={"w-10/12 mx-auto " + (currentStep ? "block" : "hidden")}>
              <ConfirmInfoForm driverInfo={driverInfo} images={images} setStep={setStep} register={register} setValue={setValue} />
            </div>
            {currentStep === 0 && <div onClick={() => setStep(currentStep + 1)} className="py-2 bg-blue-900 mx-auto w-10/12 mx-auto mb-10 text-white text-lg w-full rounded-lg mt-10">Next</div>}
            {currentStep === 1 &&
              <div className="w-10/12 mx-auto grid grid-cols-2 gap-x-5 mt-10 mb-10">
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
const PickupInfoForm = ({ driverInfo, setStep, register, unregister, setValue }) => {
  const [reRender, setRender] = useState(1)
  const [tableCount, setTableCount] = useState({1: ""})
  const [years, setYears] = useState([])

  useEffect(() => {
    const date = new Date()
    let yearArray = []
    for (let i = date.getFullYear() - 25; i >= date.getFullYear() - 95; i--) {
      yearArray.push((i + 543).toString())
    } 
    setYears([...yearArray])
  }, []);

  useEffect(() => {
    if (!driverInfo.length) return
    driverInfo[0]?.personalInfo.contact.forEach((contact, index) => {
      if (index != 0) {
        const temp = tableCount 
        temp[index + 2] = ""
        setTableCount(temp)
      }
    })
    setRender(driverInfo[0]?.personalInfo.contact.length)
  }, [driverInfo]);

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
        <Textinput onChange={() => {}} register={register("personalInfo.recommend")} title="รหัสผู้แนะนำ" options={years} setValue={setValue} prefill={driverInfo[0]?.personalInfo.recommend} />
      </div>
      <div style={{ gridTemplateColumns: "0.5fr 1fr" }} className={"mb-3 grid gap-x-2 " }>
        <Dropdown onChange={() => {}} register={register("personalInfo.title", { required: "" })} required title="คำนำหน้า" options={["Mr.", "Ms."]} setValue={setValue} prefill={driverInfo[0]?.personalInfo.title} />
        <Textinput onChange={() => {}} register={register("personalInfo.name", { required: "" })} required title="ชื่อจริง-นามสกุล (อังกฤษ)" setValue={setValue} prefill={driverInfo[0]?.personalInfo.name} />
      </div>
      <div className={"mb-3 " }>
        <Dropdown onChange={() => {}} register={register("personalInfo.birth", { required: "" })} required title="ปีเกิด" options={years} setValue={setValue} prefill={driverInfo[0]?.personalInfo.birth} />
      </div>
      <div className={"mb-3 " }>
        <Numberinput onChange={() => {}} register={register("personalInfo.citizenId", { required: "" })} required title="หมายเลขบัตรประชาชน" setValue={setValue} prefill={driverInfo[0]?.personalInfo.citizenId} />
      </div>
      <div className={"mb-3 " }>
        <Numberinput onChange={() => {}} register={register("personalInfo.phone", { required: "" })} required title="เบอร์โทรศัพท์" setValue={setValue} prefill={driverInfo[0]?.personalInfo.citizenId} />
      </div>
      {reRender && Object.keys(tableCount).map((count, index) => {
        return (
          <div key={count} className={"flex " + (Object.keys(tableCount).length !== index + 1 ? "mb-3" : "mb-2")}>
            <div className="grid grid-cols-2 gap-x-2">
              <Dropdown onChange={() => {}} register={register(`personalInfo.contact.[${index}].title`, { required: "" })} required title="ชื่่อแอพ" options={["Line", "Facebook", "Whatsapp"]} setValue={setValue} prefill={driverInfo[0]?.personalInfo.contact[index].title} />
              <Textinput onChange={() => {}} register={register(`personalInfo.contact.[${index}].id`, { required: "" })} required title="ไอดี" setValue={setValue} prefill={driverInfo[0]?.personalInfo.contact[index].id} />
            </div>
            {index !== 0 && <div onClick={() => addContactHandle(count, "remove", index)} style={{ aspectRatio: "1" }} className="ml-2 bg-blue-900 h-8 rounded-md grid place-items-center"><FontAwesomeIcon className="text-sm text-white" icon={faTrash} /></div>}
          </div>
        )
      })}
      <div onClick={() => addContactHandle("", "add")} className="text-white font-medium rounded-md bg-blue-900 w-max py-2 px-2 text-sm cursor-pointer text-left mb-5">+ เพิ่มแอพ</div>
      <div className="mb-3">
        <Textareainput onChange={() => {}} register={register("personalInfo.address", { required: "" })} required title="ที่อยู่ปัจจุบัน" setValue={setValue} prefill={driverInfo[0]?.personalInfo.address} />
      </div>
      <div className="text-left font-semibold mt-3 mb-1">ช่องทางการติดต่อฉุกเฉินคนใกล้ชิด</div>
      <div className="flex mb-3">
        <div className="grid grid-cols-2 gap-x-2">
          <Textinput onChange={() => {}} register={register(`personalInfo.urgentContact.title`, { required: "" })} required title="ความสัมพันธ์" setValue={setValue} prefill={driverInfo[0]?.personalInfo.urgentContact.title} />
          <Textinput onChange={() => {}} register={register(`personalInfo.urgentContact.id`, { required: "" })} required title="เบอร์โทรศัพท์" setValue={setValue} prefill={driverInfo[0]?.personalInfo.urgentContact.id} />
        </div>
      </div>
    </div>
  )
}

//last page of the booking form
const ConfirmInfoForm = ({ driverInfo, images, setStep, register, setValue }) => {
  const [years, setYears] = useState([])

  useEffect(() => {
    const date = new Date()
    let yearArray = []
    for (let i = date.getFullYear(); i >= date.getFullYear() - 30; i--) {
      yearArray.push(i.toString())
    } 
    setYears(yearArray)
  }, []);

  return (
    <div>
      {years.length > 0 && 
        <>
          <div className="text-xl font-medium text-left mb-3">ข้อมูลยานพาหนะ</div>
          <div className={"mb-1 grid grid-cols-2 gap-x-3 " }>
            <Dropdown onChange={() => {}} register={register("vehicleInfo.carType", { required: "" })} required title="ประเภทของรถ" options={["Economy type", "Sedan type", "Family type", "Van type"]} setValue={setValue} prefill={driverInfo[0]?.vehicleInfo.carType} />
            <Textinput onChange={() => {}} register={register("vehicleInfo.carModel", { required: "" })} required title="ชื่อรุ่นของรถ" setValue={setValue} prefill={driverInfo[0]?.vehicleInfo.carModel} />
          </div>
          <div onClick={() => window.location.replace("https://www.thai-taxi.com/car-type")} className='underline decoration-red-500 text-red-600 text-sm mb-5 text-left font-medium'>กดเพื่อเช็คประเภทรถ</div>
          <div className={"mb-3 " }>
            <Dropdown onChange={() => {}} register={register("vehicleInfo.birth", { required: "" })} required title="ปีเกิดของรถ" options={years} setValue={setValue} prefill={driverInfo[0]?.vehicleInfo.birth} />
          </div>
          <div className={"mb-3 grid grid-cols-2 gap-x-3 " }>
            <Textinput onChange={() => {}} register={register("vehicleInfo.plateNo", { required: "" })} required title="เลขทะเบียนรถ" setValue={setValue} prefill={driverInfo[0]?.vehicleInfo.plateNo} />
            <Dropdown onChange={() => {}} register={register("vehicleInfo.plateColor", { required: "" })} required title="ประเภททะเบียนรถ" options={["ป้ายเขียว", "ป้ายเหลือง", "อื่นๆ"]} setValue={setValue} prefill={driverInfo[0]?.vehicleInfo.plateColor} />
          </div>
          <div className={"mb-5 " }>
            <Dropdown onChange={() => {}} register={register("vehicleInfo.insurance", { required: "" })} required title="ชั้นของประกันรถ" options={["ชั้น 1", "ชั้น 2", "ชั้น 3"]} setValue={setValue} prefill={driverInfo[0]?.vehicleInfo.insurance} />
          </div>
        </>
      }
    </div>
  )
}
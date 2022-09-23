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

const Driver = () => {
  const [currentStep, setStep] = useState(0)
  const [bookData, setBookData] = useState({})
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

  const onSubmit = (data) => {
    setStep(currentStep + 1)
    setBookData(data)
    console.log(data)
  }

  const onConfirm = async () => {
    let dataTemp = bookData
    dataTemp.driverId = userId || "U2330f4924d1d5faa190c556e978bee23"
    await axios.post("/driver", bookData)
    liff.closeWindow()
    // console.log(bookData)
  }

  return (
    <div className="grid pt-20 h-screen w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full text-center">
            <div className="text-4xl font-semibold mb-10">Register Driver</div>
            <FormTracker currentStep={currentStep} body={[
              <PickupInfoForm setStep={setStep} register={register} unregister={unregister} setValue={setValue} />,
              <ConfirmInfoForm setStep={setStep} register={register} setValue={setValue} />
            ]} />
            {currentStep === 0 && <input type="submit" value="Next" className="py-2 mb-14 bg-blue-900 text-white text-lg w-10/12 mx-auto rounded-lg mt-10" />}
            {currentStep === 1 &&
              <div className="w-10/12 mx-auto grid grid-cols-2 gap-x-5">
                <div onClick={() => setStep(currentStep - 1)} className="py-2 bg-blue-900 text-white text-lg w-full rounded-lg mt-10">Back</div>
                <div onClick={onConfirm} className="py-2 bg-blue-900 text-white text-lg w-full rounded-lg mt-10">Send</div>
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

  const tableHandler = (item, type) => {
    let tableTemp = {...tableCount}
    if (type === "-") {
      unregister(`table`)
      delete tableTemp[item]
      setRender(reRender+1)
      setTableCount({...tableTemp})
      return
    }
    tableTemp[reRender+1] = ""
    setRender(reRender+1)
    console.log(tableTemp)
    setTableCount({...tableTemp})
  }

  return (
    <div>
      <div className="text-xl font-medium text-left mb-3">ข้อมูลส่วนตัว</div>
      <div className={"mb-3 " }>
        <Dropdown onChange={() => {}} register={register("carType")} title="คำนำหน้า" options={["Mr.", "Mrs."]} setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("name")} title="ชื่อจริง-นามสกุล (อังกฤษ)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Datepicker onChange={() => {}} register={register("name")} title="ปีเกิด" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Numberinput onChange={() => {}} register={register("phone")} title="หมายเลขบัตรประชาชน" setValue={setValue} />
      </div>
      <div className={"mb-3 grid grid-cols-2 gap-x-3 " }>
        <Numberinput onChange={() => {}} register={register("phone")} title="หมายเลขใบขับขี่" setValue={setValue} />
        <Textinput onChange={() => {}} register={register("carModel")} title="ประเภทใบขับขี่" setValue={setValue} />
      </div>
      {Object.keys(tableCount).map((count, index) => {
        return (
          <div className={Object.keys(tableCount).length !== index + 1 ? "mb-3" : "mb-1"}>
            <Textinput onChange={() => {}} register={register("carModel")} title="ช่องทางการติดต่อ" setValue={setValue} />
          </div>
        )
      })}
      <div className="text-sm text-blue-400 text-left mb-3">+ Add more</div>
      <div className={"mb-3 " }>
        <Textareainput onChange={() => {}} register={register("carModel")} title="ที่อยู่ปัจจุบัน" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("carModel")} title="ติดต่อฉุกเฉิน (เพื่อน หรือคนใกล้ชิด)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Textinput onChange={() => {}} register={register("carModel")} title="ชื่อทีม (ไม่บังคับ)" setValue={setValue} />
      </div>
    </div>
  )
}

//last page of the booking form
const ConfirmInfoForm = ({ setStep, register, setValue }) => {

  return (
    <div>
      <div className="text-xl font-medium text-left mb-3">ข้อมูลยานพาหนะ</div>
      <div className={"mb-3 grid grid-cols-2 gap-x-3 " }>
        <Dropdown onChange={() => {}} register={register("carType")} title="ประเภทรถ" options={["Economy car", "Sedan car", "Family car", "Minibus", "VIP Van", "VIP Car"]} setValue={setValue} />
        <Textinput onChange={() => {}} register={register("name")} title="ชื่อรุ่นของรถ" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Datepicker onChange={() => {}} register={register("name")} title="ปีเกิดของรถ" setValue={setValue} />
      </div>
      <div className={"mb-3 grid grid-cols-2 gap-x-3 " }>
        <Textinput onChange={() => {}} register={register("phone")} title="เลขทะเบียนรถ" setValue={setValue} />
        <Dropdown onChange={() => {}} register={register("carType")} title="สีทะเบียนรถ" options={["Green", "Yellow", "White"]} setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Dropdown onChange={() => {}} register={register("carType")} title="ชั้นของประกันรถ" options={["Level 1", "Level 2", "Level 3"]} setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Imageinput onChange={() => {}} register={register("carModel")} title="Address (Current address)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Imageinput onChange={() => {}} register={register("carModel")} title="Address (Current address)" setValue={setValue} />
      </div>
      <div className={"mb-3 " }>
        <Imageinput onChange={() => {}} register={register("carModel")} title="Address (Current address)" setValue={setValue} />
      </div>
    </div>
  )
}
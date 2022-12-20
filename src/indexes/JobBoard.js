import { useEffect, useState } from "react";
import liff from '@line/liff';
import DataTable from "../components/DataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faMagnifyingGlass, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import JobPage from "../partials/JobPage";
import { getBookingByStatusWithoutDriverId, getDriverById, getJobsByDriverId, updateDriver } from "../apis/backend";
import { useNavigate, useSearchParams } from "react-router-dom";

const provincesJSON = [
  "กรุงเทพมหานคร",
  "สมุทรปราการ",
  "นนทบุรี",
  "ปทุมธานี",
  "พระนครศรีอยุธยา",
  "อ่างทอง",
  "ลพบุรี",
  "สิงห์บุรี",
  "ชัยนาท",
  "สระบุรี",
  "ชลบุรี",
  "ระยอง",
  "จันทบุรี",
  "ตราด",
  "ฉะเชิงเทรา",
  "ปราจีนบุรี",
  "นครนายก",
  "สระแก้ว",
  "นครราชสีมา",
  "บุรีรัมย์",
  "สุรินทร์",
  "ศรีสะเกษ",
  "อุบลราชธานี",
  "ยโสธร",
  "ชัยภูมิ",
  "อำนาจเจริญ",
  "หนองบัวลำภู",
  "ขอนแก่น",
  "อุดรธานี",
  "เลย",
  "หนองคาย",
  "มหาสารคาม",
  "ร้อยเอ็ด",
  "กาฬสินธุ์",
  "สกลนคร",
  "นครพนม",
  "มุกดาหาร",
  "เชียงใหม่",
  "ลำพูน",
  "ลำปาง",
  "อุตรดิตถ์",
  "แพร่",
  "น่าน",
  "พะเยา",
  "เชียงราย",
  "แม่ฮ่องสอน",
  "นครสวรรค์",
  "อุทัยธานี",
  "กำแพงเพชร",
  "ตาก",
  "สุโขทัย",
  "พิษณุโลก",
  "พิจิตร",
  "เพชรบูรณ์",
  "ราชบุรี",
  "กาญจนบุรี",
  "สุพรรณบุรี",
  "นครปฐม",
  "สมุทรสาคร",
  "สมุทรสงคราม",
  "เพชรบุรี",
  "ประจวบคีรีขันธ์",
  "นครศรีธรรมราช",
  "กระบี่",
  "พังงา",
  "ภูเก็ต",
  "สุราษฎร์ธานี",
  "ระนอง",
  "ชุมพร",
  "สงขลา",
  "สตูล",
  "ตรัง",
  "พัทลุง",
  "ปัตตานี",
  "ยะลา",
  "นราธิวาส",
  "บึงกาฬ"
]

const JobBoard = () => {
  const [isJobOpen, setJobOpen] = useState(false)
  const [jobData, setJobData] = useState({})
  const [onload, setOnload] = useState(false)
  const [search, setSearch] = useState("")
  const [provinceSearch, setProvinceSearch] = useState("")
  const [userId, setUserId] = useState("")
  const [jobList, setJobList] = useState([])
  const [provinces, setProvinces] = useState(() => [...provincesJSON].sort())
  const [selectedProvinces, setSelectedProvinces] = useState([])
  const [onFilter, setOnFilter] = useState(false)
  const [currentJobs, setCurrentJobs] = useState([])
  const [notiOnToggle, setNotiOnToggle] = useState(false)
  const [notiValue, setNotiValue] = useState(false)
  const [onProvinceChange, setOnProvinceChange] = useState(false)
  const [reload, setReload] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()

  const initLine = () => {
    liff.init({ liffId: '1657246657-XxVxBO25' }, () => {
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
    const callback = async () => {
      if (!userId) return
      const driver = (await getDriverById(userId)).data[0]
      setNotiValue(driver.jobNotification ? true : false)
      if (driver.provinceNotification !== "") {
        driver.provinceNotification = JSON.parse(driver.provinceNotification)
        setSelectedProvinces([...driver.provinceNotification])
        setProvinces(curr => {
          const temp = curr
          const filtered = temp.filter((item) => !driver.provinceNotification.includes(item)).sort()
          return filtered
        })
      }
    }
    callback()
  }, [userId])

  useEffect(() => {
    if (!userId && !reload) return
    setOnload(true)
    const callback = async () => {
      const jobs = await getBookingByStatusWithoutDriverId("waiting", userId)
      console.log(jobs)
      setJobList(jobs.data)
    }
    callback()
    setTimeout(() => {
      setOnload(false)
    }, 20);
  }, [reload]);

  useEffect(() => {
    if (!provinceSearch.length) return setProvinces([...provincesJSON].sort())
    const provinceTemp = provincesJSON
    const fitleredAndSortedProvince = provinceTemp.filter((item) => item.includes(provinceSearch) && !selectedProvinces.includes(item)).sort((a, b) => {
      if(a.indexOf(provinceSearch) > b.indexOf(provinceSearch)) {
          return 1;
      } else if (a.indexOf(provinceSearch) < b.indexOf(provinceSearch)) {
          return -1;
      } else {
          if(a > b)
              return 1;
          else
              return -1;
      }
    });
    setProvinces([...fitleredAndSortedProvince])
  }, [provinceSearch])

  useEffect(() => {
    if (!userId && !isJobOpen) return
    const callback = async () => {
      const driver = (await getDriverById(userId)).data
      if (!driver.length) {
        navigate("/driver") 
        return
      }
      if (!driver[0].driverTermsAndCon) {
        liff.closeWindow()
      } 
      const jobs = await getBookingByStatusWithoutDriverId("waiting", userId)
      setJobList(jobs.data)
      if (searchParams.get("bookingId")) {
        const jobTemp = jobs.data.find((job, index) => {
          if (job.bookingId === searchParams.get("bookingId")) return true
        })
        if (jobTemp) {
          setJobOpen(true)
          setJobData(jobTemp)
          setSearchParams({})
        }
      }
      const currentJobsReq = (await getJobsByDriverId(userId)).data
      setCurrentJobs(currentJobsReq)
    }
    callback()
  }, [userId, isJobOpen]);

  const handleJobViewed = (e, data) => {
    console.log(data)
    setJobData(data)
    setJobOpen(true)
  }

  const addProvinceHandle = async (province) => {
    setOnProvinceChange(true)
    const selectedTemp = [...selectedProvinces, province].sort()
    const provinceTemp = provinces
    const index = provinceTemp.indexOf(province);
    if (index > -1) {
      provinceTemp.splice(index, 1); 
    }
    setSelectedProvinces(selectedTemp)
    setProvinces(provinceTemp)
    await updateDriver(userId, { provinceNotification: JSON.stringify(selectedTemp) })
    setTimeout(() => {
      setOnProvinceChange(false)
    }, 20);
  }

  const removeProvinceHandle = async (province) => {
    setOnProvinceChange(true)
    const selectedTemp = selectedProvinces
    const index = selectedTemp.indexOf(province);
    if (index > -1) {
      selectedTemp.splice(index, 1); 
    }
    const provinceTemp = [...provinces, province].sort()
    setProvinces(provinceTemp)
    setSelectedProvinces(selectedTemp)
    await updateDriver(userId, { provinceNotification: JSON.stringify(selectedTemp) })
    setTimeout(() => {
      setOnProvinceChange(false)
    }, 20);
  }

  const toggleNotificationHandle = async (e) => {
    setNotiOnToggle(true)
    await updateDriver(userId, { jobNotification: e.target.checked })
    setNotiValue(curr => !curr)
    setTimeout(() => {
      setNotiOnToggle(false)
    }, 20);
  }

  return (
    <div>
      <div id="job" className="relative pt-10 grid w-full">
        <div className="text-3xl font-semibold text-center mb-8">Job Board</div>
        <div className="px-3 flex justify-between mb-5">
            <div className="w-full mr-2 w-full border-2 border-gray-300 h-full rounded-md px-3 flex items-center">
                <FontAwesomeIcon className="text-blue-900 mr-2" icon={faMagnifyingGlass} />
                <input onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="w-full outline-none" />
            </div>
            <div onClick={() => setOnFilter(true)} style={{ aspectRatio: "1" }} className="text-blue-900 bg-blue-100 p-2 rounded-md h-9 mr-2 grid place-items-center"><FontAwesomeIcon icon={faLocationDot} /></div>
            <div onClick={() => setReload(!reload)} style={{ aspectRatio: "1" }} className="text-blue-900 bg-blue-100 p-2 rounded-md h-9 grid place-items-center"><FontAwesomeIcon icon={faRotateRight} /></div>
        </div>
        <div className={"fixed bg-black bg-opacity-60 h-screen w-full top-0 left-0 grid place-items-center transition " + (onFilter ? "opacity-100" : "opacity-0 pointer-events-none") }>
          <div className="bg-white rounded-md w-11/12 px-5 py-5">
            <div className="flex items-center mb-5">
              <div className="text-2xl font-semibold mr-3">แจ้งเตือนงาน</div>
              <label className={"inline-flex relative items-center mr-2 " + (notiOnToggle && "pointer-events-none")}>
                  <input onChange={toggleNotificationHandle} type="checkbox" checked={notiValue} className="sr-only peer" />
                  <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 outline-none"></div>
              </label>
              {notiOnToggle && 
                <div role="status">
                  <svg aria-hidden="true" className="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>}
            </div>
            <div className="mb-2 font-medium">เลือกจังหวัดที่ต้องการแสดงผลและแจ้งเตือน</div>
            <div className="border border-gray-400 px-3 py-2 flex items-center rounded-t-md">
              <FontAwesomeIcon className="text-gray-400 mr-2" icon={faMagnifyingGlass} />
              <input onChange={(e) => setProvinceSearch(e.target.value)} placeholder="ค้นหา" className="w-full outline-none" />
            </div>
            <div className="h-48 border-b border-l border-r border-gray-400 mb-3 overflow-y-scroll">
              {provinces.map((province, index) => {
                return (
                  <div key={province} onClick={() => addProvinceHandle(province)} className={"py-2 cursor-pointer px-3 flex items-center justify-between text-sm border-b border-b-gray-400 " + (onProvinceChange && "pointer-events-none")}>
                    <div>{province}</div>
                    <div className="font-medium text-blue-700 text-xl">+</div>
                  </div>
                )
              })}
            </div>
            <div className="border border-gray-400 px-3 py-2 flex items-center rounded-t-md">จังหวัดที่เลือกแล้ว</div>
            <div className="h-32 border-b border-l border-r border-gray-400 mb-3 overflow-y-scroll">
              {selectedProvinces.map((province, index) => {
                return (
                  <div key={province} onClick={() => removeProvinceHandle(province)} className={"py-2 cursor-pointer px-3 flex items-center justify-between text-sm border-b border-b-gray-400 " + (onProvinceChange && "pointer-events-none")}>
                    <div>{province}</div>
                    <div className="font-medium text-blue-700 text-xl">-</div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-end">
              <div onClick={() => setOnFilter(false)} className="cursor-pointer py-2 px-4 bg-blue-900 w-min text-sm mt-3 -mb-2 text-white w-full rounded-md">Close</div>
            </div>
          </div>
        </div>
        {onload ? 
          <div role="status" className="flex justify-center mt-5">
              <svg aria-hidden="true" className="mr-2 w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
              </svg>
          </div>
          : 
          <DataTable onClick={handleJobViewed} search={search} data={jobList} />
        }
      </div>
      <JobPage onClick={() => setJobOpen(false)} currentJobs={currentJobs} setJobOpen={setJobOpen} bookingData={jobData} isOpen={isJobOpen} userId={userId} />
    </div>
  );
}

export default JobBoard;
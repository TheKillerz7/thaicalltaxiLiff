import { useEffect, useState } from "react";
import liff from '@line/liff';
import DataTable from "../components/DataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignRight, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import JobPage from "../partials/JobPage";
import { getBookingByStatusWithoutDriverId, getDriverById } from "../apis/backend";
import { useNavigate } from "react-router-dom";

const JobBoard = () => {
  const [isJobOpen, setJobOpen] = useState(false)
  const [jobData, setJobData] = useState({})
  const [search, setSearch] = useState("")
  const [userId, setUserId] = useState("")
  const [jobList, setJobList] = useState([])

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
    if (!userId) return
    const callback = async () => {
      const driver = (await getDriverById(userId)).data
      if (!driver.length) {
        navigate("/driver") 
        return
      }
      const jobs = await getBookingByStatusWithoutDriverId("waiting", userId)
      setJobList(jobs.data)
    }
    callback()
  }, [userId, isJobOpen]);

  const handleJobViewed = (e, data) => {
    setJobData(data)
    setJobOpen(true)
  }

  return (
    <div>
      <div id="job" className="pt-16 grid w-full">
        <div className="text-3xl font-semibold text-center mb-10">Job Board</div>
        <div className="px-3 flex justify-between mb-5">
            <div className="w-full mr-3 w-full border-2 border-gray-300 h-full rounded-md px-3 flex items-center">
                <FontAwesomeIcon className="text-blue-900 mr-2" icon={faMagnifyingGlass} />
                <input onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="w-full outline-none" />
            </div>
            <div style={{ aspectRatio: "1" }} className="text-blue-900 bg-blue-100 p-2 rounded-md h-9 grid place-items-center"><FontAwesomeIcon icon={faAlignRight} /></div>
        </div>
        <DataTable onClick={handleJobViewed} search={search} data={jobList} />
      </div>
      <JobPage onClick={() => setJobOpen(false)} setJobOpen={setJobOpen} bookingData={jobData} isOpen={isJobOpen} userId={userId} />
    </div>
  );
}

export default JobBoard;
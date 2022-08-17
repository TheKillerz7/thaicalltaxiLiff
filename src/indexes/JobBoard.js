import { useEffect, useState } from "react";
import FormTracker from "../partials/FormTracker";
import { useForm } from "react-hook-form"
import liff from '@line/liff';
import axios from 'axios'
import DataTable from "../components/DataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignRight, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Textinput from "../components/Textinput";
import JobPage from "../partials/JobPage";
import { getBookingWithStatus, getDriverById } from "../apis/backend";

const JobBoard = () => {
  const [isJobOpen, setJobOpen] = useState(false)
  const [jobData, setJobData] = useState({})
  const [search, setSearch] = useState("")
  const [userId, setUserId] = useState("")
  const [jobList, setJobList] = useState([])

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
      console.log(profile);
      setUserId(profile.userId)
    }).catch(err => console.error(err));
  }

  useEffect(() => {
    const callback = async () => {
      const driver = await getDriverById(userId || "U2330f4924d1d5faa190c556e978bee23")
      if (!driver) return 
      const jobs = await getBookingWithStatus("waiting")
      console.log(jobs)
      setJobList(jobs.data)
      // initLine();
    }
    callback()
  }, []);

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
      <JobPage onClick={() => setJobOpen(false)} bookingData={jobData} isOpen={isJobOpen} userId={userId} />
    </div>
  );
}

export default JobBoard;
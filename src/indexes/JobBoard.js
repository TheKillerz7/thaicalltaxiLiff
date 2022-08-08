import { useEffect, useState } from "react";
import FormTracker from "../partials/FormTracker";
import { useForm } from "react-hook-form"
import liff from '@line/liff';
import axios from 'axios'
import DataTable from "../components/DataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignRight, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Textinput from "../components/Textinput";

const JobBoard = () => {
  const [currentStep, setStep] = useState(0)
  const [bookData, setBookData] = useState({})
  const { register, setValue, handleSubmit } = useForm()

  const initLine = () => {
    liff.init({ liffId: '1657246657-jMPaJLl0' }, () => {
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
    }).catch(err => console.error(err));
  }

  useEffect(() => {
    // initLine();
  }, []);

  const onSubmit = (data) => {
    setStep(currentStep + 1)
    setBookData(data)
    console.log(data)
  }

  const onConfirm = async () => {
    axios.post("https://d3bf-2405-9800-b650-586-f45e-ac49-d489-cc41.ngrok.io/driver", bookData)
    // console.log(bookData)
  }

  return (
    <div className="grid w-full pt-16">
        <div className="text-3xl font-semibold text-center mb-10">Job Board</div>
        <div className="px-3 flex justify-between mb-5">
            <div className="w-full mr-3 w-full border-2 border-gray-300 h-full rounded-md px-3 flex items-center">
                <FontAwesomeIcon className="text-blue-900 mr-2" icon={faMagnifyingGlass} />
                <input placeholder="Search" className="w-full outline-none" />
            </div>
            <div style={{ aspectRatio: "1" }} className="text-blue-900 bg-blue-100 p-2 rounded-md h-9 grid place-items-center"><FontAwesomeIcon icon={faAlignRight} /></div>
        </div>
        <DataTable />
    </div>
  );
}

export default JobBoard;
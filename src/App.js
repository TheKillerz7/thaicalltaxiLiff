import "./App.css";
import Booking from "./indexes/Booking";
import Driver from "./indexes/Driver";
import JobBoard from "./indexes/JobBoard";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import ChatRoom from "./indexes/ChatRoom";
import Dashboard from "./indexes/Dashboard";
import PrivateInfo from "./indexes/PrivateInfo";
import RateDriver from "./indexes/RateDriver";
import CurrentBooking from "./indexes/CurrentBooking";
import CurrentJob from "./indexes/CurrentJob";
import BookingHistory from "./indexes/BookingHistory";
import JobHistory from "./indexes/JobHistory";
import Test from "./indexes/Text";
import DriverAccount from "./indexes/DriverAccount";
import { useEffect } from "react";

function App() {
  const Maintenance = () => {
    return (
      <>
        <div
          style={{ boxShadow: "5px 0px 10px 4px rgba(0, 0, 0, 0.15)" }}
          className="flex justify-between items-center px-3 py-3"
        >
          <div className="font-semibold text-xl w-max mr-3">BELL-MAN</div>
          <div className="text-sm text-right w-max font-medium">
            Taxi for Tourists & Foreingers
          </div>
        </div>
        <div className="flex flex-col item-center text-center justify-center w-full h-screen pb-40">
          <div className="font-semibold text-2xl mb-5">We'll be back</div>
          <div>We are updating and we will be back soon</div>
          <div className="">Booking is still available via:</div>
          <ul className="flex flex-col items-center justify-center gap-x-5 font-medium mt-5">
            <li>
              Tel/Whatsapp:{" "}
              <a className="text-blue-500 underline" href="tel:+66890117504">
                +66890117504
              </a>
            </li>
            <li>
              Email:{" "}
              <a
                className="text-blue-500 underline"
                href="mailto:thaicalltaxi@gmail.com"
              >
                thaicalltaxi@gmail.com
              </a>
            </li>
            <li>
              Line:{" "}
              <a className="" href="tel:+66890117504">
                0890117504
              </a>
            </li>
          </ul>
        </div>
      </>
    );
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Maintenance />} />
          {/* <Route path="/test" element={<Test />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/driver" element={<Driver />} />
          <Route path="/jobBoard" element={<JobBoard />} />
          <Route path="/booking/private" element={<PrivateInfo />} />
          <Route path="/chat/:userType/:page/:roomId" element={<ChatRoom />} />
          <Route path="/chat/:userType/:page" element={<ChatRoom />} />
          <Route path="/dashboard/:page" element={<Dashboard />} />
          <Route path="/comment" element={<RateDriver />} />
          <Route path="/currentBooking" element={<CurrentBooking />} />
          <Route path="/currentJob" element={<CurrentJob />} />
          <Route path="/bookingHistory" element={<BookingHistory />} />
          <Route path="/jobHistory" element={<JobHistory />} />
          <Route path="/driver/account" element={<DriverAccount />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

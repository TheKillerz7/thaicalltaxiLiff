import './App.css';
import Booking from './indexes/Booking';
import Driver from './indexes/Driver';
import JobBoard from './indexes/JobBoard';
import liff from '@line/liff';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';

function App() {
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
    initLine();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/booking" element={<Booking />} />
          <Route path="/driver" element={<Driver />} />
          <Route path="/jobBoard" element={<JobBoard />} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;

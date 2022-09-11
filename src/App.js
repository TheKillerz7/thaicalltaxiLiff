import './App.css';
import Booking from './indexes/Booking';
import Driver from './indexes/Driver';
import JobBoard from './indexes/JobBoard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatRoom from './indexes/ChatRoom';
import Dashboard from './indexes/Dashboard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/booking" element={<Booking />} />
          <Route path="/driver" element={<Driver />} />
          <Route path="/jobBoard" element={<JobBoard />} />
          <Route path="/chat/:userType/:page/:roomId" element={<ChatRoom />} />
          <Route path="/chat/:userType/:page" element={<ChatRoom />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import './App.css';
import Booking from './indexes/Booking';
import Driver from './indexes/Driver';
import JobBoard from './indexes/JobBoard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatRoom from './indexes/ChatRoom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/booking" element={<Booking />} />
          <Route path="/driver" element={<Driver />} />
          <Route path="/jobBoard" element={<JobBoard />} />
          <Route exact path="/chat" element={<ChatRoom />} />
          <Route path="/chat/:page/:roomId" element={<ChatRoom />} />
          <Route path="/chat/:page" element={<ChatRoom />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

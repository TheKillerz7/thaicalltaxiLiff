import './App.css';
import Booking from './indexes/Booking';
import Driver from './indexes/Driver';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/booking" element={<Booking />} />
          <Route path="/driver" element={<Driver />} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;

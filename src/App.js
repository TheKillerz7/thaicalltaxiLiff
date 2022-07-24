import './App.css';
import Booking from './indexes/Booking';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/booking" element={<Booking />} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;

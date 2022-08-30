import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

axios.defaults.baseURL = process.env.BASE_URL || "https://c9f4-2405-9800-bc00-a226-1cd-e660-4aac-d977.ap.ngrok.io" || 'https://0bbc-2405-9800-bc00-a226-dc79-32b2-a7a8-bb73.ap.ngrok.io'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

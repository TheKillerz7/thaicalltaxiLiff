import axios from "axios";
const baseURL =
  process.env.BASE_URL || "https://thaicalltaxibackend.herokuapp.como";

//get
export const getBookingByStatusWithoutDriverId = (status, driverId) => {
  return axios.get(`${baseURL}/driver/jobBoard/${status}/${driverId}`);
};

export const getAllBooking = (id) => {
  return axios.get(`${baseURL}/booking`);
};

export const getBookingById = (id) => {
  return axios.get(`${baseURL}/booking/id/${id}`);
};

export const getUserById = (id) => {
  return axios.get(`${baseURL}/user/${id}`);
};

export const getDrivers = (option, value) => {
  return axios.get(`${baseURL}/driver`, {
    params: {
      option: option || null,
      value: value || null,
    },
  });
};

export const getSelectedRegisterByBookingId = (id) => {
  return axios.get(`${baseURL}/driver/register/${id}`);
};

export const getDriverById = (id) => {
  return axios.get(`${baseURL}/driver/${id}`);
};

export const getJobsByDriverId = (driverId) => {
  return axios.get(`${baseURL}/driver/jobs/${driverId}`);
};

export const getAllJobsByDriverId = (driverId) => {
  return axios.get(`${baseURL}/driver/jobs/history/${driverId}`);
};

export const getCurrentJobsByDriverId = (driverId) => {
  return axios.get(`${baseURL}/driver/jobs/current/${driverId}`);
};

export const getAllBookingsByUserId = (userId) => {
  return axios.get(`${baseURL}/user/bookings/${userId}`);
};

export const getCurrentBookingsByUserId = (userId) => {
  return axios.get(`${baseURL}/user/bookings/current/${userId}`);
};

export const getRoomsByUserId = (userId, userType) => {
  return axios.get(`${baseURL}/chat/rooms/${userId}/${userType}`);
};

export const getRoomByRoomId = (roomId) => {
  return axios.get(`${baseURL}/chat/room/${roomId}`);
};

export const getChattingMessages = (roomId) => {
  return axios.get(`${baseURL}/chat/message/${roomId}`);
};

export const getDriverImage = (driverId) => {
  return axios.get(`${baseURL}/driver/image/${driverId}`);
};

export const getRatingByBookingId = (bookingId) => {
  return axios.get(`${baseURL}/user/rating/${bookingId}`);
};

//post
export const driverRegisterToBooking = (data) => {
  return axios.post(`${baseURL}/driver/jobBoard`, data);
};

export const uploadImage = (data, driverId) => {
  return axios.post(`${baseURL}/driver/image`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      driverId,
    },
  });
};

export const actionToDriver = (id, action, message) => {
  return axios.post(`${baseURL}/driver/action`, {
    id,
    action,
    message,
  });
};

export const ratingDriver = (data) => {
  return axios.post(`${baseURL}/user/comment`, data);
};

export const createBooking = (data) => {
  return axios.post(`${baseURL}/booking`, data);
};

export const createDriver = (data) => {
  return axios.post(`${baseURL}/driver`, data);
};

export const finishJob = (bookingId, driverId) => {
  return axios.post(`${baseURL}/driver/finish`, { bookingId, driverId });
};

//patch
export const updateBooking = (bookingId, data) => {
  return axios.patch(`${baseURL}/booking`, { bookingId, data });
};

export const updateUserById = (data, id) => {
  return axios.patch(`${baseURL}/user/${id}`, { data });
};

export const transferJob = (driverId, bookingId, newMessage, driverCode) => {
  return axios.patch(`${baseURL}/driver/transfer`, {
    bookingId,
    driverId,
    newMessage,
    driverCode,
  });
};

export const updatePrice = (bookingId, data) => {
  return axios.patch(`${baseURL}/booking/price`, { bookingId, data });
};

export const cancelBooking = (bookingId, userId) => {
  return axios.patch(`${baseURL}/booking/cancel`, { bookingId, userId });
};

export const updateDriver = (driverId, data) => {
  return axios.patch(`${baseURL}/driver`, { driverId, data });
};

export const readChatMessages = (roomId, userType) => {
  return axios.patch(`${baseURL}/chat/message`, { roomId, userType });
};

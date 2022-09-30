import axios from "axios"
const baseURL = process.env.BASE_URL || "https://a2d3-49-228-105-212.ap.ngrok.io"

//get
export const getBookingByStatusWithoutDriverId = (status, driverId) => {
    return axios.get(`${baseURL}/driver/jobBoard/${status}/${driverId}`)
}

export const getBookingById = (id) => {
    
}

export const getDriverById = (id) => {
    return axios.get(`${baseURL}/driver/${id}`)
}

export const getRoomsByUserId = (userId, userType) => {
    return axios.get(`${baseURL}/chat/rooms/${userId}/${userType}`)
}

export const getChattingMessages = (roomId) => {
    return axios.get(`${baseURL}/chat/message/${roomId}`)
}

//post
export const driverRegisterToBooking = (data) => {
    return axios.post(`${baseURL}/driver/jobBoard`, data)
}

export const createBooking = (data) => {
    return axios.post(`${baseURL}/booking`, data)
}

export const createDriver = (data) => {
    return axios.post("/driver", data)
}

//patch
export const updateBooking = (bookingId, userId, data) => {
    return axios.patch(`${baseURL}/booking`, {bookingId, userId, data})
}

export const readChatMessages = (roomId, userType) => {
    return axios.patch(`${baseURL}/chat/message`, {roomId, userType})
}
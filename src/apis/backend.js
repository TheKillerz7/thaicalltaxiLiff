import axios from "axios"
const baseURL = process.env.BASE_URL || "https://24e3-2405-9800-b650-586-b0e7-2c78-7def-6cef.ap.ngrok.io"

//get
export const getBookingByStatusWithoutDriverId = (status, driverId) => {
    return axios.get(`${baseURL}/driver/jobBoard/${status}/${driverId}`)
}

export const getBookingById = (id) => {
    return axios.get(`${baseURL}/booking/id/${id}`)
}

export const getDrivers = (option, value) => {
    return axios.get(`${baseURL}/driver`, {
        params: {
            option: option || null,
            value: value || null
        }
    })
}

export const getSelectedRegisterByBookingId = (id) => {
    return axios.get(`${baseURL}/driver/register/${id}`)
}


export const getDriverById = (id) => {
    return axios.get(`${baseURL}/driver/${id}`)
}

export const getJobsByDriverId = (driverId) => {
    return axios.get(`${baseURL}/driver/jobs/${driverId}`)
}

export const getRoomsByUserId = (userId, userType) => {
    return axios.get(`${baseURL}/chat/rooms/${userId}/${userType}`)
}

export const getRoomByRoomId = (roomId) => {
    return axios.get(`${baseURL}/chat/room/${roomId}`)
}

export const getChattingMessages = (roomId) => {
    return axios.get(`${baseURL}/chat/message/${roomId}`)
}

//post
export const driverRegisterToBooking = (data) => {
    return axios.post(`${baseURL}/driver/jobBoard`, data)
}

export const actionToDriver = (id, action, message) => {
    return axios.post(`${baseURL}/driver/action`, {
        id,
        action,
        message
    })
}

export const createBooking = (data) => {
    return axios.post(`${baseURL}/booking`, data)
}

export const createDriver = (data) => {
    return axios.post(`${baseURL}/driver`, data)
}

//patch
export const updateBooking = (bookingId, userId, data) => {
    return axios.patch(`${baseURL}/booking`, {bookingId, userId, data})
}

export const readChatMessages = (roomId, userType) => {
    return axios.patch(`${baseURL}/chat/message`, {roomId, userType})
}
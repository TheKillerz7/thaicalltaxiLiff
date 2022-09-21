import axios from "axios"

//get
export const getBookingByStatusWithoutDriverId = (status, driverId) => {
    return axios.get(`/driver/jobBoard/${status}/${driverId}`)
}

export const getBookingById = (id) => {
    
}

export const getDriverById = (id) => {
    return axios.get(`/driver/${id}`)
}

export const getRoomsByUserId = (userId, userType) => {
    return axios.get(`/chat/rooms/${userId}/${userType}`)
}

export const getChattingMessages = (roomId) => {
    return axios.get(`/chat/message/${roomId}`)
}

//post
export const driverRegisterToBooking = (data) => {
    return axios.post('/driver/jobBoard', data)
}

//patch
export const updateBooking = (bookingId, userId, data) => {
    return axios.patch('/booking', {bookingId, userId, data})
}

export const readChatMessages = (roomId, userType) => {
    return axios.patch('/chat/message', {roomId, userType})
}
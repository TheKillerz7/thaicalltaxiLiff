import axios from "axios"

//get
export const getBookingWithStatus = (status) => {
    return axios.get(`/booking/${status}`)
}

export const getBookingById = (id) => {
    
}

export const getDriverById = (id) => {
    return axios.get(`/driver/${id}`)
}


//post
export const driverRegisterToBooking = (data) => {
    return axios.post('/driver/jobBoard', data)
}
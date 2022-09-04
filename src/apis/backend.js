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


//post
export const driverRegisterToBooking = (data) => {
    return axios.post('/driver/jobBoard', data)
}
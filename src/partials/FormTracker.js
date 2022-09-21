import { useState } from "react"

//Form components with steps
const FormTracker = ({ steps, currentStep, body }) => {
    return (
        <div>
            <div className="w-10/12 mx-auto">
                {body[currentStep]}
            </div>
        </div>
    )
}

export default FormTracker
import { useState } from "react"

//Form components with steps
const FormTracker = ({ steps, currentStep, body }) => {
    return (
        <div>
            <div className="h-8 w-10/12 mx-auto relative flex justify-around mb-14">
                <div style={{ aspectRatio: 1 }} className="bg-blue-900 h-full relative rounded-full grid place-items-center p-1">
                    <div className="text-white font-medium">1</div>
                    <div className="mt-2 absolute -bottom-7 font-medium w-max text-blue-900">Pick-up Info</div>
                </div>
                <div style={{ aspectRatio: 1 }} className={"h-full relative rounded-full grid place-items-center p-1 " + (currentStep >= 1 ? "bg-blue-900" : "bg-gray-200")}>
                    <div className={"font-medium " + (currentStep >= 1 ? "text-white" : "text-gray-400")}>2</div>
                    <div className={"mt-2 absolute -bottom-7 font-medium w-max "  + (currentStep >= 1 ? "text-blue-900" : "text-gray-400")}>Confirmation</div>
                </div>
                <div style={{ zIndex: -1 }} className={"absolute h-1 w-1/2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 " + (currentStep >= 1 ? "bg-blue-900" : "bg-gray-200")}></div>
            </div>
            <div className="w-10/12 mx-auto">
                {body[currentStep]}
            </div>
        </div>
    )
}

export default FormTracker
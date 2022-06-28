import { useState } from "react"


const FormTracker = ({ steps, currentStep, body }) => {
    const [stateee, s] = useState("")

    return (
        <div>
            <div className="h-8 w-10/12 mx-auto relative flex justify-between">
                <div style={{ aspectRatio: 1 }} className="bg-orange-600 h-full rounded-full grid place-items-center">
                    <div className="text-white font-medium">1</div>
                </div>
                <div style={{ aspectRatio: 1 }} className={"h-full rounded-full grid place-items-center p-1 " + (currentStep >= 2 ? "bg-orange-600" : "bg-gray-200")}>
                    <div className={"font-medium " + (currentStep >= 2 ? "text-white" : "text-gray-400")}>2</div>
                    <div style={{ zIndex: -1 }} className={"absolute h-1 w-1/2 left-1 " + (currentStep >= 2 ? "bg-orange-600" : "bg-gray-200")}></div>
                </div>
                <div style={{ aspectRatio: 1 }} className={"bg-gray-200 h-full rounded-full grid place-items-center p-1 " + (currentStep >= 3 ? "bg-orange-600" : "bg-gray-200")}>
                    <div className={"font-medium " + (currentStep >= 3 ? "text-white" : "text-gray-400")}>3</div>
                    <div style={{ zIndex: -1 }} className={"absolute h-1 w-1/2 right-0 " + (currentStep >= 3 ? "bg-orange-600" : "bg-gray-200")}></div>
                </div>
            </div>
            {body}
        </div>
    )
}

export default FormTracker
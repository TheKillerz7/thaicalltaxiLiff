import { useEffect, useRef, useState } from 'react';

const LocationSearch = ({ title, register, setValue, errors, rendercount, isReset, reRender, onChange }) => {
    const [focus, setFocus] = useState(false)
    const [isFilled, setFilled] = useState(false)
    const [reTitle, setReTitle] = useState("")
    const input = useRef(null)

    useEffect(() => {
        if (!input?.current?.value) return
        setValue(register.name, input.current.value)
        // autocomplete.addListener
    }, [reRender])

    useEffect(() => {
        !isFilled ? setReTitle(errors?.[register.name]?.message) : setReTitle(null)
    }, [rendercount])

    useEffect(() => {
        if (!input?.current?.value) return
        input.current.value = ""
        setFilled(false)
        setFocus(false)
        setReTitle("")
    }, [isReset])

    const handleChanges = (value) => {
        onChange(value.target.value)
        setValue(register.name, value.target.value)
        value.target.value === "" ? setFilled(false) : setFilled(true)
    }

    return(
        <div className={'relative bg-transparent px-4 pb-1 transition-all rounded-xl border-2 ' + (focus ? !reTitle ? "border-blue-900" : "border-red-400" : "border-gray-300")}>
            <div className={'absolute transition-all top-1/2 pointer-events-none ' + ((focus || isFilled) ? `-translate-y-5 text-xs font-medium ${focus ? !reTitle ? "text-blue-900" : "text-red-400" : !reTitle ? "text-gray-400" : "text-red-400"}` : !reTitle ? "text-gray-400 -translate-y-1/2" : "text-red-400 -translate-y-1/2")}>{reTitle || title}{errors?.[register.name]?.message && !reTitle && <span className='text-red-400'>*</span>}</div>
            <input id='autocomplete' ref={input} onChange={(value) => handleChanges(value)} onClick={() => setFocus(true)} onBlur={() => setFocus(false)} type="text" className="outline-none w-full pt-5" />
        </div>
    )
}

export default LocationSearch
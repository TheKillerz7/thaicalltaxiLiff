import { useEffect, useRef, useState } from 'react';

const Numberinput = ({ title, register, setValue, error, onChange, prefill, required }) => {
    const [focus, setFocus] = useState(false)
    const [isFilled, setFilled] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [reTitle, setReTitle] = useState("")
    const input = useRef(null)

    useEffect(() => {
        if (error) return setReTitle(error)
        setReTitle("")
    }, [error])

    useEffect(() => {
        if (prefill && register) {
            setInputValue(prefill)
            setValue(register.name, prefill)
            setFilled(true)
        }
    }, [prefill, register])

    const handleChanges = (item) => {
        onChange(item.target.value)
        setInputValue(item.target.value)
        setValue(register.name, item.target.value)
        item.target.value === "" ? setFilled(false) : setFilled(true)
    }

    return(
        <div className={'relative bg-transparent px-4 pb-1 transition-all rounded-lg border-2 ' + (focus ? !reTitle ? "border-blue-900" : "border-red-400" : "border-gray-300")}>
            <div className={'absolute transition-all text-left top-1/2 pointer-events-none ' + ((focus || isFilled) ? `-translate-y-5 text-xs font-medium ${focus ? !reTitle ? "text-blue-900" : "text-red-400" : !reTitle ? "text-gray-400" : "text-red-400"}` : !reTitle ? "text-gray-400 -translate-y-1/2 text-sm" : "text-red-400 -translate-y-1/2")}>{title}{required && <span className='text-red-400'>*</span>}</div>
            <input ref={input} value={inputValue} onChange={(value) => handleChanges(value)} onClick={() => setFocus(true)} onBlur={() => setFocus(false)} type="number" className="outline-none w-full pt-5" />
        </div>
    )
}

export default Numberinput
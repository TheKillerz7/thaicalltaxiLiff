import { useEffect, useRef, useState } from 'react';

const Textinput = ({ title, register, setValue, error, reRender, onChange, id, prefill, controlledValue, setControlledValue }) => {
    const [focus, setFocus] = useState(false)
    const [isFilled, setFilled] = useState(false)
    const [reTitle, setReTitle] = useState("")
    const [inputValue, setInputValue] = useState("")
    const input = useRef(null)

    useEffect(() => {
        if (!input?.current?.value) return
        setValue(register.name, input.current.value)
    }, [reRender])

    useEffect(() => {
        if (error) return setReTitle(error)
        setReTitle("")
    }, [error])

    useEffect(() => {
        if (prefill) {
            setControlledValue ? setControlledValue(prefill) : setInputValue(prefill)
            setValue(register.name, input.current.value)
            setFilled(true)
        }
    }, [prefill])

    const handleChanges = (value) => {
        onChange(value.target.value)
        setControlledValue ? setControlledValue(value.current.value) : setInputValue(value.target.value)
        setValue(register.name, value.target.value)
        value.target.value === "" ? setFilled(false) : setFilled(true)
    }

    return(
        <div className={'relative bg-transparent px-4 pb-1 transition-all rounded-lg border-2 ' + (focus ? !reTitle ? "border-blue-900" : "border-red-400" : "border-gray-300")}>
            <div className={'absolute transition-all text-left top-1/2 pointer-events-none ' + ((focus || isFilled) ? `-translate-y-5 text-xs font-medium ${focus ? !reTitle ? "text-blue-900" : "text-red-400" : !reTitle ? "text-gray-400" : "text-red-400"}` : !reTitle ? "text-gray-400 -translate-y-1/2 text-sm" : "text-red-400 -translate-y-1/2")}>{title}{!reTitle && <span className='text-red-400'>*</span>}</div>
            <input id={id} ref={input} value={controlledValue || inputValue} onChange={(value) => handleChanges(value)} onClick={() => setFocus(true)} onBlur={() => setFocus(false)} type="text" className="outline-none w-full pt-5" />
        </div>
    )
}

export default Textinput
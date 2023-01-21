import { useEffect, useRef, useState } from 'react';

const Textareainput = ({ title, register, setValue, error, prefill, required }) => {
    const [focus, setFocus] = useState(false)
    const [isFilled, setFilled] = useState(false)
    const [height, setHeight] = useState(0)
    const [reTitle, setReTitle] = useState("")
    const iniHeight = useRef(null)
    const [inputValue, setInputValue] = useState("")
    const input = useRef(null)

    useEffect(() => {
        if (error) return setReTitle(error)
        setReTitle("")
    }, [error])

    useEffect(() => {
        setHeight(iniHeight.current.offsetHeight)
    }, [])

    useEffect(() => {
        if (prefill && register) {
            setInputValue(prefill)
            setValue(register.name, prefill)
            setFilled(true)
        }
    }, [prefill, register])

    const handleChanges = (item) => {
        setValue(register.name, item.target.value)
        setInputValue(item.target.value)
        item.target.value === "" ? setFilled(false) : setFilled(true)
        item.target.style.height = item.target.scrollHeight + "px"
    }

    return(
        <div ref={iniHeight} className={'bg-transparent px-4 transition-all rounded-lg border-2 ' + (focus ? !reTitle ? "border-blue-900" : "border-red-400" : "border-gray-300")}>
            <div style={{ height: height }} className="absolute w-9/12 pointer-events-none -mt-0.5">
                <div className={'absolute transition-all text-left top-1/2 pointer-events-none ' + ((focus || isFilled) ? `-translate-y-5 text-xs ${focus ? !reTitle ? "text-blue-900" : "text-red-400" : !reTitle ? "text-gray-400 text-sm" : "text-red-400"}` : !reTitle ? "text-gray-400 -translate-y-1/2" : "text-red-400 -translate-y-1/2")}>{title}{required && <span className='text-red-400'>*</span>}</div>
            </div>
            <textarea ref={input} value={inputValue} rows={1} onChange={(item) => handleChanges(item)} onClick={() => setFocus(true)} onBlur={() => setFocus(false)} type="text" className="outline-none w-full pt-6 resize-none"></textarea>
        </div>
    )
}

export default Textareainput
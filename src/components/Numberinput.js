import { useEffect, useRef, useState } from 'react';

const Numberinput = ({ between, title, top, register, setValue, errors, rendercount, isReset }) => {
    const [focus, setFocus] = useState(false)
    const [isFilled, setFilled] = useState(false)
    const [height, setHeight] = useState(0)
    const [reTitle, setReTitle] = useState("")
    const iniHeight = useRef(null)
    const input = useRef(null)

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

    const handleChanges = (item) => {
        setValue(register.name, item.target.value)
        item.target.value === "" ? setFilled(false) : setFilled(true)
    }

    return(
        <div className={'relative bg-transparent px-4 pb-2 transition-all border-2 border-white ' + (focus ? !reTitle ? "border-b-blue-500" : "border-b-red-400" : (between || top) && "border-b-gray-100")}>
            <div className={'absolute transition-all top-1/2 -translate-y-1/2 pointer-events-none ' + ((focus || isFilled) ? `-translate-y-5 text-xs ${focus ? !reTitle ? "text-blue-400" : "text-red-400" : !reTitle ? "text-gray-400" : "text-red-400"}` : !reTitle ? "text-gray-400" : "text-red-400")}>{reTitle || title}{errors?.[register.name]?.message && !reTitle && <span className='text-red-400'>*</span>}</div>
            <input ref={input} onChange={(value) => handleChanges(value)} onClick={() => setFocus(true)} onBlur={() => setFocus(false)} type="number" className="outline-none w-full pt-6" />
        </div>
    )
}

export default Numberinput
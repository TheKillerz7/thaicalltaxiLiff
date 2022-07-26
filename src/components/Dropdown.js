import { useEffect, useRef, useState } from 'react';

const Dropdown = ({ between, top, register, setValue, isReset, options, title }) => {
    const [focus, setFocus] = useState(false)
    const [reTitle, setReTitle] = useState("Select here")
    const input = useRef(null)

    useEffect(() => {
        setReTitle("Select here")
        if (!input?.current?.value) return
        input.current.value = ""
        setFocus(false)
    }, [isReset])

    useEffect(() => {
        setValue(register.name, options[0])
        const handleClick = (e) => {
            if(e.path[0] !== input?.current && e.path[1] !== input?.current?.nextSibling){
                setFocus(false)
            }
        }
        document.body.addEventListener("click", handleClick)
        return () => document.body.removeEventListener("click", handleClick)
    }, [])

    const handleChanges = (selected) => {
        setReTitle(selected.innerText)
        setFocus(false)
        setValue(register.name, selected.innerText)
    }

    return(
        <div className={'relative bg-transparent px-4 pb-1 transition-all rounded-xl border-2 ' + (focus ? reTitle ? "border-blue-900" : "border-red-400" : "border-gray-300")}>
            <div className={'absolute transition-all top-1/2 -translate-y-5 pointer-events-none text-xs font-medium ' + (focus ? "text-blue-900" : "text-gray-400")}>{title}</div>
            <div ref={input} onClick={() => setFocus(true)} className="outline-none w-full text-left h-full pt-5 cursor-pointer translate-y-0">{reTitle}</div>
            <div style={{boxShadow: "4px 4px 30px rgba(0, 0, 0, 0.20)"}} className={'absolute z-10 transition top-full bg-white translate-y-1 w-full left-0 ' + (focus ? "opacity-1" : "opacity-0 pointer-events-none")}>
                {options.map((option, index) => {
                    return(
                        <div key={index} onClick={(selected) => handleChanges(selected.target)} className={'hover:bg-blue-100 hover:text-blue-500 text-left cursor-pointer transition w-full h-full py-2.5 px-4 border-b-blue-900 '} >{option}</div>
                    )
                })}
            </div>
            <div className={"absolute transition-all top-1/2 -translate-y-1/2 right-3 pointer-events-none " + (focus && "rotate-180")}>v</div>
        </div>
    )
}

export default Dropdown
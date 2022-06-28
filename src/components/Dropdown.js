import { useEffect, useRef, useState } from 'react';

const Dropdown = ({ between, top, register, setValue, isReset, options, title }) => {
    const [focus, setFocus] = useState(false)
    const [reTitle, setReTitle] = useState(options[0])
    const input = useRef(null)

    useEffect(() => {
        setReTitle(options[0])
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
        <div className={'relative bg-transparent px-4 pb-4 transition-all border-2 border-white h-full ' + (focus ? "border-b-blue-500" : (top || between) && "border-b-gray-100")}>
            <div className={'absolute transition-all top-1/2 -translate-y-5 pointer-events-none text-xs ' + (focus ? "text-blue-400" : "text-gray-400")}>{title}</div>
            <div ref={input} onClick={() => setFocus(true)} className="outline-none w-full h-full pt-4 cursor-pointer translate-y-2">{reTitle}</div>
            <div style={{boxShadow: "4px 4px 30px rgba(0, 0, 0, 0.20)"}} className={'absolute z-10 transition top-full bg-white translate-y-1 w-full left-0 ' + (focus ? "opacity-1" : "opacity-0 pointer-events-none")}>
                {options.map((option, index) => {
                    return(
                        <div key={index} onClick={(selected) => handleChanges(selected.target)} className={'hover:bg-blue-100 hover:text-blue-500 cursor-pointer transition w-full h-full p-4 '} >{option}</div>
                    )
                })}
            </div>
            <div className={"absolute transition-all top-1/2 -translate-y-1/2 right-3 pointer-events-none " + (focus && "rotate-180")}>v</div>
        </div>
    )
}

export default Dropdown
import { useEffect, useRef, useState } from 'react';

const Dropdown = ({ register, setValue, error, options, title, prefill }) => {
    const [focus, setFocus] = useState(false)
    const [reTitle, setReTitle] = useState("Select")
    const input = useRef(null)

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

    useEffect(() => {
        if (prefill) {
            setReTitle(prefill)
            setValue(register.name, input.current.value)
        }
    }, [prefill])

    const handleChanges = (selected) => {
        setReTitle(selected.innerText)
        setFocus(false)
        setValue(register.name, selected.innerText)
    }

    return(
        <div className={'relative bg-transparent px-4 pb-1 transition-all rounded-lg border-2 ' + (focus ? !error ? "border-blue-900" : "border-red-400" : "border-gray-300")}>
            <div className={'absolute transition-all top-1/2 -translate-y-5 pointer-events-none text-xs font-medium ' + (!error ? focus ? "text-blue-900" : "text-gray-400" : "text-red-400")}>{error || title}</div>
            <div ref={input} onClick={() => setFocus(!focus)} className="outline-none w-full text-left h-full pt-5 cursor-pointer translate-y-0">{reTitle}</div>
            <div style={{boxShadow: "4px 4px 30px rgba(0, 0, 0, 0.20)", maxHeight: "300px"}} className={'absolute overflow-y-scroll z-10 transition top-full bg-white translate-y-1 w-full left-0 ' + (focus ? "opacity-1" : "opacity-0 pointer-events-none")}>
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
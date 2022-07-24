import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Datepicker = ({ between, top, register, setValue, isReset, title }) => {
    const [focus, setFocus] = useState(false)
    const [reTitle, setReTitle] = useState("")
    const input = useRef(null)
    const [value, onChange] = useState(new Date());

    useEffect(() => {
        setReTitle(moment().format('DD/mm/yyyy'))
        setFocus(false)
    }, [isReset])

    useEffect(() => {
        setValue(register.name, moment().format('DD/mm/yyyy'))
        const handleClick = (e) => {
            if(e.path[0] !== input?.current && e.path[1] !== input?.current?.nextSibling) {
                if(!e.path[0].className.includes("navigation")) setFocus(false)
            }
        }
        document.body.addEventListener("click", handleClick)
        return () => document.body.removeEventListener("click", handleClick)
    }, [])

    const handleChanges = (dateObj) => {
        const formatDate = moment(dateObj).format('dd/mm/yyyy')
        onChange(dateObj)
        setReTitle(formatDate)
        setFocus(false)
        setValue(register.name, formatDate)
    }

    return(
        <div className={'relative bg-transparent px-4 pb-1 transition-all rounded-xl border-2 h-full ' + (focus ? "border-blue-900" : "border-gray-300")}>
            <div className={'absolute transition-all top-1/2 -translate-y-5 pointer-events-none text-xs font-medium pl-8 ' + (focus ? "text-blue-900" : "text-gray-400")}>{title}</div>
            <div ref={input} onClick={() => setFocus(true)} className="outline-none w-full text-left text-sm font-medium h-full pt-5 pl-8 cursor-pointer">{reTitle}</div>
            <div style={{boxShadow: "4px 4px 30px rgba(0, 0, 0, 0.20)"}} className={'absolute z-10 transition top-full bg-white translate-y-1 w-full right-0 flex justify-center ' + (focus ? "opacity-1" : "opacity-0 pointer-events-none")}>
                <Calendar className="border-none" onChange={handleChanges} value={value} view="month" locale="US" />
            </div>
            <div className="absolute transition-all top-1/2 -translate-y-1/2 left-3 pointer-events-none"><FontAwesomeIcon icon={faCalendarDay} className={"transition mr-1 text-2xl " + (focus ? "text-blue-900" : "text-gray-500")} /></div>
        </div>
    )
}

export default Datepicker
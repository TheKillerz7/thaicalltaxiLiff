import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-mobile-datepicker';
import 'react-calendar/dist/Calendar.css';

const Timepicker = ({ time, setTime, asap, setAsap, register, setValue, isReset, title }) => {
    const [focus, setFocus] = useState(false)
    const [reTitle, setReTitle] = useState("")
    const input = useRef(null)

    useEffect(() => {
        setReTitle(moment(time).format('HH:mm'))
        setFocus(false)
    }, [isReset])

    useEffect(() => {
        setValue(register.name, moment(time).format('HH:mm'))
        const handleClick = (e) => {
            if(e.path[0] !== input?.current && e.path[1] !== input?.current?.nextSibling) {
                if(!e.path[0].className.includes("navigation")) setFocus(false)
            }
        }
        document.body.addEventListener("click", handleClick)
        return () => document.body.removeEventListener("click", handleClick)
    }, [])

    const handleChange = (time) => {
        setTime(time);
        setAsap(false)
        console.log(time)
        const formatDate = moment(time).format('HH:mm')
        setReTitle(formatDate)
        setValue(register.name, formatDate)
      };

    const config = {
        'hour': {
            format: 'hh',
            caption: 'Hour',
            step: 1,
        },
        'minute': {
            format: 'mm',
            caption: 'Min',
            step: 1,
        },
    }

    useEffect(() => {
        const formatDate = moment(time).format('HH:mm')
        setReTitle(asap ? "ASAP" : formatDate)
        setValue(register.name, asap ? "As soon as possible" : formatDate)
    }, [asap])

    return(
        <div className={'relative bg-transparent px-4 pb-1 transition-all rounded-xl border-2 h-full ' + (focus ? "border-blue-900" : "border-gray-300")}>
            <div className={'absolute transition-all top-1/2 -translate-y-5 pointer-events-none text-xs font-medium pl-8 ' + (focus ? "text-blue-900" : "text-gray-400")}>{title}</div>
            <div ref={input} onClick={() => setFocus(true)} className="outline-none w-full text-left text-sm font-medium h-full pt-5 pl-8 cursor-pointer">{reTitle}</div>
            <DatePicker
                dateConfig={config}
                headerFormat="hh:mm"
                min={new Date()}
                isPopup={true}
                theme="ios"
                value={time}
                isOpen={focus}
                onChange={handleChange}
                onSelect={() => setAsap(true)}
                confirmText="I want now"
                cancelText="Select"
            />
            <div className="absolute transition-all top-1/2 -translate-y-1/2 left-3 pointer-events-none"><FontAwesomeIcon icon={faCalendarDay} className={"transition mr-1 text-2xl " + (focus ? "text-blue-900" : "text-gray-500")} /></div>
        </div>
    )
}

export default Timepicker
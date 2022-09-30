import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { TimePicker } from 'sassy-datepicker';

const Timepicker = ({ asap, setAsap, register, setValue, isReset, title }) => {
    const [focus, setFocus] = useState(false)
    const [time, setTime] = useState(new Date());
    const [reTitle, setReTitle] = useState(moment(new Date()).format('HH:mm'))
    const input = useRef(null)

    useEffect(() => {
        setReTitle(moment(time).format('HH:mm'))
        setFocus(false)
    }, [isReset])

    useEffect(() => {
        setValue(register.name, moment(time).format('HH:mm'))
    }, [])

    const handleChange = (time) => {
        setFocus(false)
        setTime(time)
        const formatDate = moment(time).format('HH:mm')
        // setAsap(false)
        setReTitle(formatDate)
        setValue(register.name, moment(time).format("HH:mm"))
    };

    useEffect(() => {
        if (!asap) {
            setReTitle(moment(time).format('HH:mm'))
            return
        }
        setReTitle("ASAP")
        setValue(register.name, "ASAP")
    }, [asap])

    return(
        <div style={{ height: "48px" }} className={'relative bg-transparent px-4 pb-1 transition-all rounded-lg border-2 h-full w-full ' + (focus ? "border-blue-900" : "border-gray-300")}>
            <div className={'absolute transition-all top-1/2 -translate-y-5 pointer-events-none text-xs font-medium ' + (focus ? "text-blue-900" : "text-gray-400")}>{title}</div>
            {asap && <div ref={input} onClick={() => setFocus(true)} className="outline-none w-full text-left text-sm font-medium h-full pt-5 cursor-pointer">{reTitle}</div>}
            {!asap && <TimePicker
                onChange={handleChange}
                value={{ hours: 0, minutes: 0 }}
                displayFormat="24hr"
                className='text-left text-sm font-semibold pt-5 cursor-pointer w-full justify-between'
                style={{ border: "none", boxShadow: "none" }}
            />}
        </div>
    )
}

export default Timepicker
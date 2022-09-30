import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import DatePicker from 'sassy-datepicker';

const Datepicker = ({ asap, setAsap, register, setValue, isReset, title }) => {
    const [focus, setFocus] = useState(false)
    const [reTitle, setReTitle] = useState("")
    const [time, setTime] = useState(new Date())
    const input = useRef(null)

    useEffect(() => {
        setReTitle(moment().format('DD MMM'))
        setFocus(false)
    }, [isReset])

    useEffect(() => {
        setValue(register.name, moment().format('DD MMM'))
    }, [])

    const handleChange = (time) => {
        setFocus(false)
        setTime(time)
        const formatDate = moment(time).format('DD MMM')
        setReTitle(formatDate)
        setValue(register.name, moment(time).format("DD/MM/YYYY"))
    };

    useEffect(() => {
        if (!asap) {
            setReTitle(moment(time).format('DD MMM'))
            setValue(register.name, moment(time).format("DD/MM/YYYY"))
            return
        }
        console.log(asap)
        setReTitle("ASAP")
        setValue(register.name, "ASAP")
    }, [asap])

    return(
        <div>
            <div className={'relative bg-transparent px-4 pb-1 transition-all rounded-lg border-2 h-full ' + (focus ? "border-blue-900" : "border-gray-300")}>
                <div className={'absolute transition-all top-1/2 -translate-y-5 pointer-events-none text-xs font-medium pl-8 ' + (focus ? "text-blue-900" : "text-gray-400")}>{title}</div>
                <div ref={input} onClick={() => setFocus(!asap)} className="outline-none w-full text-left text-sm font-medium h-full pt-5 pl-8 cursor-pointer">{reTitle}</div>
                <div className="absolute transition-all top-1/2 -translate-y-1/2 left-3 pointer-events-none"><FontAwesomeIcon icon={faCalendarDay} className={"transition mr-1 text-2xl " + (focus ? "text-blue-900" : "text-gray-500")} /></div>
            </div>
            <div style={{ zIndex: "10" }} className={'fixed h-screen w-screen transition bg-black top-0 bg-opacity-30 left-0 grid place-items-center ' + (focus ? "opacity-100" : "opacity-0 pointer-events-none")}>
                <div className='w-10/12 grid place-items-center'>
                    <DatePicker
                        minDate={new Date()}
                        maxDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 3)}
                        value={time}
                        onChange={handleChange}
                        className="w-full"
                        style={{ paddingBottom: "20px" }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Datepicker
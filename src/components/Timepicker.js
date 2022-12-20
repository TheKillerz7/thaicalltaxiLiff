import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';

const Timepicker = ({ asap, register, setValue, title, prefill, chatroom }) => {
    const [focus, setFocus] = useState([false, false])
    const [timeValue, setTimeValue] = useState([prefill?.split(":")[0] || "00", prefill?.split(":")[1] || "00"]);
    const [reTitle, setReTitle] = useState(moment(new Date()).format('HH:mm'))

    useEffect(() => {
        setFocus([false, false])
        setValue(register.name, timeValue[0] + ":" + timeValue[1])
    }, [timeValue])
    
    useEffect(() => {
        setValue(register.name, prefill || "00:00")
    }, [register])

    useEffect(() => {
        if (!asap) {
            setValue(register.name, timeValue[0] + ":" + timeValue[1])
            return
        }
        setReTitle("ASAP")
        setValue(register.name, "ASAP")
    }, [asap, register])

    if (chatroom) {
        return (
            <div className={'relative bg-transparent transition-all rounded-lg h-full w-full '}>
                <div className='flex w-full justify-between text-sm'>
                    <div onClick={(e) => !e.target.id.includes(register.name) ? setFocus([false, false]) : setFocus([!focus[0], false])} className='relative border border-blue-400 rounded-md px-0.5'>
                        <input id={register.name} value={timeValue[0]} style={{ width: "1.1rem" }} className='rounded-md cursor-pointer caret-transparent outline-none text-center' readOnly />
                        {focus[0] && 
                            <div id={register.name} className='absolute bg-white z-10 px-1 -left-0.5 translate-y-0.5 rounded-md border border-gray-300 h-48 overflow-y-scroll'>
                                {[...Array(24)].map((item, index) => <div id={register.name} onClick={() => setTimeValue([index.toString().length === 1 ? "0" + index.toString() : index.toString(), timeValue[1]])} key={index} className={"my-2 rounded-md cursor-pointer " + (parseInt(timeValue[0]) === index && "bg-blue-400 px-1 py-0.5 text-white")}>{index.toString().length === 1 ? "0" + index.toString() : index}</div>)}
                            </div>
                        }
                    </div>
                    <div>:</div>
                    <div onClick={(e) => !e.target.id.includes(register.name) ? setFocus([false, false]) : setFocus([false, !focus[1]])} id={register.name} className='relative border border-blue-400 rounded-md px-0.5'>
                        <input id={register.name} value={timeValue[1]} style={{ width: "1.1rem" }} className='rounded-md cursor-pointer caret-transparent outline-none text-center' readOnly />
                        {focus[1] &&
                            <div id={register.name} className='absolute bg-white z-10 px-1 -left-0.5 translate-y-0.5 rounded-md border border-gray-300 h-48 overflow-y-scroll'>
                                {[...Array(12)].map((item, index) => <div id={register.name} onClick={() => setTimeValue([timeValue[0], (index * 5).toString().length === 1 ? "0" + (index * 5).toString() : (index * 5).toString()])} key={index} className={"my-2 rounded-md cursor-pointer " + (parseInt(timeValue[1]) === (index * 5) && "bg-blue-400 px-1 py-0.5 text-white")}>{(index * 5).toString().length === 1 ? "0" + (index * 5).toString() : (index * 5)}</div>)}
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ height: "48px" }} className={'relative bg-transparent px-4 pb-1 transition-all rounded-lg border-2 h-full w-full '}>
            <div className={'absolute transition-all top-1/2 -translate-y-5 pointer-events-none text-xs font-medium '}>{title}</div>
            {asap && <div className="outline-none w-full text-left text-sm font-medium h-full pt-5 cursor-pointer">{reTitle}</div>}
            {!asap && 
                <div className='flex pt-5 w-full justify-between text-sm'>
                    <div onClick={(e) => !e.target.id.includes(register.name) ? setFocus([false, false]) : setFocus([!focus[0], false])} className='relative border border-blue-400 rounded-md px-0.5'>
                        <input id={register.name} value={timeValue[0]} style={{ width: "1.1rem" }} className='rounded-md cursor-pointer caret-transparent outline-none text-center' readOnly />
                        {focus[0] && 
                            <div id={register.name} className='absolute bg-white z-10 px-1 -left-0.5 translate-y-0.5 rounded-md border border-gray-300 h-48 overflow-y-scroll'>
                                {[...Array(24)].map((item, index) => <div id={register.name} onClick={() => setTimeValue([index.toString().length === 1 ? "0" + index.toString() : index.toString(), timeValue[1]])} key={index} className={"my-2 rounded-md cursor-pointer " + (parseInt(timeValue[0]) === index && "bg-blue-400 px-1 py-0.5 text-white")}>{index.toString().length === 1 ? "0" + index.toString() : index}</div>)}
                            </div>
                        }
                    </div>
                    <div>:</div>
                    <div onClick={(e) => !e.target.id.includes(register.name) ? setFocus([false, false]) : setFocus([false, !focus[1]])} id={register.name} className='relative border border-blue-400 rounded-md px-0.5'>
                        <input id={register.name} value={timeValue[1]} style={{ width: "1.1rem" }} className='rounded-md cursor-pointer caret-transparent outline-none text-center' readOnly />
                        {focus[1] &&
                            <div id={register.name} className='absolute bg-white z-10 px-1 -left-0.5 translate-y-0.5 rounded-md border border-gray-300 h-48 overflow-y-scroll'>
                                {[...Array(12)].map((item, index) => <div id={register.name} onClick={() => setTimeValue([timeValue[0], (index * 5).toString().length === 1 ? "0" + (index * 5).toString() : (index * 5).toString()])} key={index} className={"my-2 rounded-md cursor-pointer " + (parseInt(timeValue[1]) === (index * 5) && "bg-blue-400 px-1 py-0.5 text-white")}>{(index * 5).toString().length === 1 ? "0" + (index * 5).toString() : (index * 5)}</div>)}
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default Timepicker
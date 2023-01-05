import { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import he from "he"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { translations } from '../apis/google';

const PlaceSearch = ({ title, register, setValue, error, reRender, onChange, id, prefill, controlledValue, setControlledValue }) => {
    const [focus, setFocus] = useState(false)
    const [isFilled, setFilled] = useState(false)
    const [reTitle, setReTitle] = useState("")
    const [inputValue, setInputValue] = useState("")
    const [placeSearchValue, setPlaceSearchValue] = useState([])
    const [loading, setLoading] = useState(true)
    const [onDelay, setOnDelay] = useState(false)

    const service = new window.google.maps.places.AutocompleteService();

    useEffect(() => {
        if (error) return setReTitle(error)
        setReTitle("")
    }, [error])

    useEffect(() => {
        if (prefill) {
            setControlledValue ? setControlledValue(prefill) : setInputValue(prefill)
            setFilled(true)
        }
        const handleClick = (e) => {
            if (typeof e.target.className === "string") {
                if(e.target?.id !== register.name){
                    setFocus(false)
                }
            }
        }
        document.body.addEventListener("click", handleClick)
        return () => document.body.removeEventListener("click", handleClick)
    }, [prefill])

    const handleChanges = async (value) => {
        if (value.target) {
            onChange(value.target.value)
            setControlledValue ? setControlledValue(value.target.value) : setInputValue(value.target.value)
            setValue(register.name, value.target.value)
            value.target.value === "" ? setFilled(false) : setFilled(true)
        } else {
            setFocus(false)
            setFilled(true)
            const translated = await translations(value.terms[value.terms.length - 2].value, "th")
            const provinceObj = {
                en: value.terms[value.terms.length - 2].value,
                th: he.decode(translated.data.data.translations[0].translatedText) === "กรุงเทมหานคร" || "กรุงเทพฯ" ? "กรุงเทพมหานคร" : he.decode(translated.data.data.translations[0].translatedText)
            } 
            const data = {
                name: value.structured_formatting.main_text,
                placeId: value.place_id,
                province: provinceObj
            }
            onChange(data)
            setControlledValue ? setControlledValue(value.structured_formatting.main_text) : setInputValue(value.structured_formatting.main_text)
            setValue(register.name, data)
        }
    }

    const displaySuggestions = function (predictions, status) {
        setPlaceSearchValue(predictions)
    };
    
    useEffect(() => {
        if (!inputValue) return setPlaceSearchValue([])
        if (!onDelay) {
            service.getPlacePredictions({ input: inputValue, componentRestrictions: { country: "th" }, language: "en" }, displaySuggestions);
            setOnDelay(true)
            setTimeout(() => {
                setOnDelay(false)
                service.getPlacePredictions({ input: inputValue, componentRestrictions: { country: "th" }, language: "en" }, displaySuggestions)
            }, 300);
        }
    }, [inputValue])

    return(
        <div className={'relative bg-transparent px-4 pb-1 transition-all rounded-lg border-2 ' + (focus ? !reTitle ? "border-blue-900" : "border-red-400" : "border-gray-300")}>
            <div className={'absolute transition-all text-left top-1/2 pointer-events-none ' + ((focus || isFilled) ? `-translate-y-5 text-xs font-medium ${focus ? !reTitle ? "text-blue-900" : "text-red-400" : !reTitle ? "text-gray-400" : "text-red-400"}` : !reTitle ? "text-gray-400 -translate-y-1/2 text-sm" : "text-red-400 -translate-y-1/2")}>{title}{!reTitle && <span className='text-red-400'>*</span>}</div>
            <input id={id || register.name} value={controlledValue || inputValue} onChange={(value) => handleChanges(value)} onClick={() => setFocus(true)} type="text" className="placeInput outline-none w-full pt-5" autoComplete="off" />
            <div style={{boxShadow: "4px 4px 30px rgba(0, 0, 0, 0.20)", maxHeight: "300px"}} className={'absolute overflow-y-scroll z-10 transition top-full bg-white translate-y-1 w-full left-0 ' + (focus ? "opacity-1" : "opacity-0 pointer-events-none")}>
                {placeSearchValue.map((option, index) => {
                    return (
                        <div key={index} className="px-3 text-left hover:bg-blue-100 hover:text-blue-500 cursor-pointer">
                            <div className={"flex items-center justify-start pl-3 py-3 " + (placeSearchValue.length !== index + 1 && "border-b border-gray-300")}>
                                <span><FontAwesomeIcon className='text-gray-500 mr-1' icon={faLocationDot} /></span>
                                <div id={register.name} onClick={() => handleChanges(option)} className={'transition w-full h-full font-medium px-2 border-b-blue-900 overflow-hidden text-ellipsis whitespace-nowrap '} >{option.description}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PlaceSearch
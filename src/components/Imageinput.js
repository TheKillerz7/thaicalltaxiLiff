import { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const Imageinput = ({ register, setValue, errors, rendercount, isReset, require }) => {
  const [file, setFile] = useState([])
  const [message, setMessage] = useState("Upload Image")
  const [focus, setFocus] = useState(false)
  const input = useRef(null)

  useEffect(() => {
    if (!errors?.[register.name]?.message) return
    setMessage(errors?.[register.name]?.message)
  }, [rendercount])

  useEffect(() => {
    !file?.[0]?.name && !message && setMessage("Upload Image")
  }, [file])

  useEffect(() => {
    const image = document.querySelector(".image")
    let focusin = false
    const handler = (e) => {
      if(focusin && e.clipboardData.files[0]) {
        const fileTemp = e.clipboardData.files
        const extension = fileTemp[0].name.split(".")[fileTemp[0].name.split(".").length - 1]
        const accept = ["png", "jpg", "jpeg"]
        if(accept.includes(extension) || !fileTemp.length) {
          setMessage("")
          setFile(fileTemp)
          setValue(register.name, fileTemp)
        } else {
          setFile([])
          setValue(register.name, [])
          setMessage("Invalid file type")
        }
      }
      else if (focusin) {
        setMessage("Invalid pasted data")
      }
    }
    const focusHandler = (e) => {
      if(e.type === "click") {
        focusin = true
        setFocus(true)
        setMessage("Paste profile picture")
      }
      else {
        focusin = false
        setFocus(false)
        setMessage("Upload Image")
      }
    }
    image.addEventListener('click', focusHandler)
    image.addEventListener('focusout', focusHandler)
    document.body.addEventListener('paste', handler)
    return () => {
      document.body.removeEventListener('paste', handler)
      image.removeEventListener('click', focusHandler)
      image.removeEventListener('focusout', focusHandler)
    }
  }, [])

  useEffect(() => {
    if (!file.length) return
    setMessage("Upload Image")
    setFile([])
}, [isReset])

  const onDrop = (acceptedFiles) => {

    const extension = acceptedFiles?.[0]?.name.split(".")[acceptedFiles[0].name.split(".").length - 1]
    const accept = ["png", "jpg", "jpeg"]

    if(accept.includes(extension) || !acceptedFiles.length) {
      setMessage("")
      setFile(acceptedFiles)
      setValue(register.name, acceptedFiles)
    } else {
      setFile([])
      setValue(register.name, [])
      setMessage("Invalid extension")
    }
  }
    
  const {getRootProps, getInputProps, isDragAccept} = useDropzone({onDrop, noClick: true})
  
  return(
    <div className='bg-transparent flex'>
        <div {...getRootProps()} className={'image relative text-left text-sm transition w-9/12 px-4 py-3 mr-5 border-2 rounded-lg border-gray-300 h-full overflow-hidden cursor-pointer ' + (file?.length ? "text-gray-800 "  : message == "Upload Image" || message == "Paste profile picture" ? isDragAccept || focus ? "bg-blue-100 border-blue-300 text-blue-400" : "text-gray-400" : isDragAccept ? "bg-blue-100 border-blue-300 text-blue-400" : "text-red-400")}>
          {file?.[0]?.name || message}{require && message === "Upload Image" && <span className='text-red-400'>*</span>}
          {file.length > 0 && <div onClick={() => setFile([])} className='hover:text-blue-400 transition absolute top-1/2 right-3 -translate-y-1/2 text-xl'>x</div>}
        </div>
        <label for="profile" className='hover:bg-blue-400 cursor-pointer transition w-3/12 bg-blue-900 text-sm grid place-items-center rounded-lg'>
            <div className='text-white font-medium'>Upload</div>
            <input ref={input} {...getInputProps()} id="profile" name="profile" type="file" className="hidden w-full" accept=".jpg, .jpeg, .png" multiple={false} />
        </label>
    </div>
  )
}

export default Imageinput
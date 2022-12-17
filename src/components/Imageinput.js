import { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const Imageinput = ({ register, setValue, errors, rendercount, isReset, require, prefill }) => {
  const [file, setFile] = useState([])
  const [message, setMessage] = useState("Upload Image")
  const [focus, setFocus] = useState(false)
  const [image, setImage] = useState()
  const input = useRef(null)

  useEffect(() => {
    if (!errors?.[register.name]?.message) return
    setMessage(errors?.[register.name]?.message)
  }, [rendercount])

  useEffect(() => {
    if (!file?.[0]?.name) {
      setImage(null)
      input.current.value = ""
    }
  }, [file])

  useEffect(() => {
    if (!prefill) return
    const converted = b64toBlob(prefill, "")
    const myFile = new File([converted], 'image-' + register.name + ".jpg", {
      type: 'image/jpg',
      lastModified: new Date(),
    });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(myFile);
    console.log(dataTransfer)
    const imageURL = URL.createObjectURL(dataTransfer.files[0]);
    setFile(dataTransfer.files)
    setValue(register.name, dataTransfer.files)
    setImage(imageURL)
  }, [prefill])

  const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  const onFileHandle = e => {
    const imageURL = URL.createObjectURL(e.target.files[0]);
    setFile(e.target.files)
    setValue(register.name, e.target.files)
    setImage(imageURL)
  }
  
  return(
    <div>
      <div style={{ maxWidth: "100vw" }} className='bg-transparent flex overflow-hidden'>
        <div className={'image relative text-left text-sm transition w-9/12 px-4 py-3 mr-5 border-2 rounded-lg border-gray-300 overflow-hidden cursor-pointer ' + (file?.length ? "bg-blue-100 border-blue-300 text-blue-400" : "text-gray-400")}>
          <div className='text-ellipsis overflow-hidden whitespace-nowrap pr-3'>{file?.[0]?.name || message}{require && message === "Upload Image" && <span className='text-red-400'>*</span>}</div>
          {file.length > 0 && <div onClick={() => setFile([])} className='transition absolute top-1/2 right-3 -translate-y-1/2 text-xl'>x</div>}
        </div>
        <label htmlFor={register.name} className='cursor-pointer transition w-3/12 bg-blue-900 text-sm grid place-items-center rounded-lg'>
            <div className='text-white font-medium'>Upload</div>
            <input onChange={onFileHandle} ref={input} id={register.name} name={register.name} type="file" className="hidden w-full" accept=".jpg, .jpeg, .png" multiple={false} />
        </label>
      </div>
      <div className=''>
        {image && <img style={{ aspectRatio: "12/14" }} className='object-cover w-5/12 mt-3 rounded-md overflow-hidden border border-blue-400 object-center' src={image} />}
      </div>
    </div>
  )
}

export default Imageinput
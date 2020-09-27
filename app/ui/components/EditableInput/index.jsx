import React, { useRef } from 'react'
import './index.css'

function index ({ label, onBlur }) {
  const inputRef = useRef()
  return (
    <div ref={inputRef} contentEditable className='editable-div' onBlur={() => { onBlur(inputRef.current && inputRef.current.innerText.trim()) }}>
      {label}
    </div>
  )
}

export default index

import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Loading = () => {
  const {path} = useParams()
  const navigate = useNavigate()
 useEffect(() => {
  let Timer;
  if (path) {
    Timer = setTimeout(() => {
      navigate(`/${path}`);
    }, 5000);
  }
  return () => clearTimeout(Timer);
}, [path]); // also add [path] as dependency


  return (
    <div className='min-screen flex items-center justify-center'>
      <div className='w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin'></div>
    </div>
  )
}

export default Loading 
import React from 'react'
import "./Page404.css"
import Img404 from "../../assets/404pic.png"

function Page404() {
  return (
    <div className='page404'>
      <div className='text404'>
        <p>Page not found!</p>
      </div>
      <div className='img404'>
        <img src={Img404} alt='404Page' />
      </div>
      <div className='link404'>
        <a href='' className='lk404 goback'>Go Back</a>
        <a href='' className='lk404 gohome'>Go Home</a>
      </div>
    </div>
  )
}

export default Page404
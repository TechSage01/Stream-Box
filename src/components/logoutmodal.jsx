import React from 'react'

const logoutmodal = () => {
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-black/70'>
        <div className='bg-white rounded-sm w-[90%] sm:w-[400px] p-8'>
            <h1>Are you sure you want to logout</h1>
        </div>
    </div>
  )
}

export default logoutmodal
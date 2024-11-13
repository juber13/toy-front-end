import React from 'react'

const Backdrop: React.FC =  () => {
  return (
    <div className='fixed bg-[rgba(0,0,0,0.6)]  z-10  inset-0 p-3 flex items-center justify-center gap-2'>
      {/* <div className='w-12 h-12 border-4 border-white-500 border-t-transparent rounded-full animate-spin duration-1000'></div> */}
      <div className='dot bg-blue-500 w-4 h-4 rounded-full  animate-bounce1'></div>
      <div className='dot bg-red-500 w-4 h-4 rounded-full  animate-bounce2'></div>
      <div className='dot bg-yellow-500 w-4 h-4 rounded-full  animate-bounce3'></div>
    </div>
  );
}

export default Backdrop
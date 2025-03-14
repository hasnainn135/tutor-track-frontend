import React from 'react'
import Image from "next/image";
import laptopAuthImage from "@/assets/laptopAuthImage.png"

const reset_password = () => {
  return (
    <div>
         <>
      <div className="w-full h-screen flex flex-row">
        <div className="bg-white w-full lg:w-1/2 h-screen flex flex-col justify-center items-center">
          <h1 className='font-bold text-center text-5xl sm:text-6xl mb-12'>Reset Password</h1>
          <form className='flex flex-col'>
            <label htmlFor="new_password">New Password</label>
            <input type="password" id='new_password' name='new_password' className='border w-60 sm:w-80 border-[#bababa] rounded-md h-9'/>
            <label htmlFor="confirm_password">Confirm Password</label>
            <input type="password" id='confirm_password' name='confirm_password' className='border w-60 sm:w-80 border-[#bababa] rounded-md h-9'/>

            <button type="submit" className="bg-[#169962] border w-60 sm:w-80 border-[#bababa] rounded-md mt-4 text-white py-1">Continue</button>

          </form>
        </div>

        <div className="bg-green-950 w-1/2 h-screen flex-col text-white justify-center items-center overflow-hidden hidden lg:flex relative">

        <div className='absolute top-10'>
          <p className='text-center'>Welcome to</p>
          <h1 className='font-bold lg:text-4xl xl:text-6xl '>TutorTrack</h1>
        </div>

        
        <Image
        src={laptopAuthImage}
        alt="Laptop"
        className='absolute lg:h-[20rem] xl:h-[27rem]  -right-24 2xl:mt-10 xl:translate-y-12 2xl:translate-y-0 w-auto '
        />

        </div>
      </div>
    </>
      
    </div>
  )
}

export default reset_password

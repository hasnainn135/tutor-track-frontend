import React from 'react'
import Image from "next/image";
import laptopAuthImage from "@/assets/laptopAuthImage.png"

const reset_password = () => {
  return (
    <div>
         <>
      <div className="w-full h-screen flex flex-row">
        <div className="bg-white w-1/2 h-screen flex flex-col justify-center items-center">
          <h1 className='font-bold text-center text-6xl mb-12'>Reset Password</h1>
          <form className='flex flex-col'>
            <label htmlFor="new_password">New Password</label>
            <input type="password" id='new_password' name='new_password' className='border w-80 border-[#bababa] rounded-md h-9'/>
            <label htmlFor="confirm_password">Confirm Password</label>
            <input type="password" id='confirm_password' name='confirm_password' className='border w-80 border-[#bababa] rounded-md h-9'/>

            <button type="submit" className="bg-[#169962] border w-80 border-[#bababa] rounded-md mt-4 text-white py-1">Continue</button>

          </form>
        </div>

        <div className="bg-green-950 w-1/2 h-screen flex flex-col text-white justify-center items-center">

          <div className="absolute top-12">
            <p className="text-xl text-center">Welcome to</p>
            <h1 className="text-6xl font-bold text-center">TutorTrack</h1>
          </div>

          <Image
            src={laptopAuthImage}
            alt={"laptop image"}
            className="absolute h-[30rem] w-auto -right-20"
          />
        </div>
      </div>
    </>
      
    </div>
  )
}

export default reset_password

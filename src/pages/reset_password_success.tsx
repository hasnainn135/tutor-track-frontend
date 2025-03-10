import React from 'react'
import Image from "next/image";
import laptopAuthImage from "@/assets/laptopAuthImage.png"

const reset_password_success = () => {
  return (
    <div>
         <>
      <div className="w-full h-screen flex flex-row">
        <div className="bg-white w-1/2 h-screen flex flex-col justify-center items-center">
          <h1 className='font-bold text-center text-6xl mb-12'>Password Reset Successfully</h1>
          <p className='text-lg text-center'>Your Password has been reset</p>
          <button type="submit" className="bg-[#169962] border w-80 border-[#bababa] rounded-md mt-4 text-white py-1">Back to Login</button>

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

export default reset_password_success

import React from 'react'
import Image from "next/image";
import laptopAuthImage from "@/assets/laptopAuthImage.png"
import Link from "next/link";


const forget_password_success = () => {
  return (
    <div>
         <>
      <div className="w-full h-screen flex flex-row">
        <div className="bg-white w-full lg:w-1/2 h-screen flex flex-col justify-center items-center">
          <h1 className='font-bold text-center text-4xl sm:text-6xl mb-12'>Forgot Your Password?</h1>
          <p className='text-lg text-center'> We have sent an email containing the link to rest your password to your email account.</p>
          <Link href="/auth/login" type="submit" className="bg-[#169962] border w-50 sm:w-80 border-[#bababa] rounded-md mt-4 text-white py-1 text-center">Back to Login</Link>
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

export default forget_password_success

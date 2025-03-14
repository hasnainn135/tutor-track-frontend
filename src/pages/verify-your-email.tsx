import React from 'react'
import Image from "next/image";
import laptopAuthImage from "@/assets/laptopAuthImage.png";

const VerifyYourEmail = () => {
  return (
    <>
    <div className="w-full h-screen flex flex-row">
      <div className="bg-white w-full lg:w-1/2 h-screen flex flex-col justify-center items-center">
        <h1 className='font-bold text-center text-4xl sm:text-6xl mb-12'>Verify Your Email</h1>
        <p className='text-base sm:text-lg text-centre'>We have sent an email to you for email verification.</p>
        <p >Didn't recieve the email? <span className='text-[#169962] underline'>Click here to send again</span></p>
        <p className="text-[#169962] border-2 border-[#169962] rounded-md mt-4 p-1 w-36 text-center font-semibold">Back to login</p>
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
  )
}

export default VerifyYourEmail

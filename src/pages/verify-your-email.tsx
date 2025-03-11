import React from 'react'
import Image from "next/image";
import laptopAuthImage from "@/assets/laptopAuthImage.png";

const VerifyYourEmail = () => {
  return (
    <>
    <div className="w-full h-screen flex flex-row">
      <div className="bg-white w-1/2 h-screen flex flex-col justify-center items-center">
        <h1 className='font-bold text-center text-6xl mb-12'>Verify Your Email</h1>
        <p className='text-lg'>We have sent an email to you for email verification.</p>
        <p >Didn't recieve the email? <span className='text-[#169962] underline'>Click here to send again</span></p>
        <p className="text-[#169962] border-2 border-[#169962] rounded-md mt-4 p-1 w-36 text-center font-semibold">Back to login</p>
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
  )
}

export default VerifyYourEmail

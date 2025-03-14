import React from 'react'
import Image from "next/image";
import laptopAuthImage from "@/assets/laptopAuthImage.png";
import { useState } from 'react';

type userRoleType = "student" | "tutor"

const register = () => {
    const [selectedRole, setSelectedRole] = useState<userRoleType>("student");

  return (
    <div>
        <>
      <div className="w-full h-screen flex flex-row">
        <div className="bg-white w-full lg:w-1/2 h-screen flex flex-col justify-center items-center">
            <h1 className="font-bold text-center text-6xl mb-12" >Register</h1>
            <div className="w-full sm:w-[30rem] h-14 bg-[#EDEDED] border border-[#bababa] rounded-md flex flex-row justify-center items-center py-2 px-2">
                <button onClick={()=> setSelectedRole("student")}  type="button" className={`w-full rounded-md font-medium ${selectedRole === "student"? "bg-green-700 text-white":"bg-transparent text-green-700"} h-full`}>Student</button>
                <button onClick={()=> setSelectedRole("tutor")}  type="button" className={`w-full rounded-md font-medium ${selectedRole === "tutor"? "bg-green-700 text-white":"bg-transparent text-green-700"} h-full`}>Tutor</button>
            </div>
            <form className="w-full sm:w-[30rem] mt-3 space-y-2">
                <div className='flex flex-row w-full'>
                    <div className='flex flex-col mr-2 w-full'>
                    <label htmlFor="username">User name <span className='text-red-600'>*</span></label>
                    <input type="text" id='username' name='username' className='border border-[#bababa]  rounded-md mt-2 h-9 ' />
                    </div>
                    <div className='flex flex-col w-full'>
                    <label htmlFor="email">Email <span className='text-black'>*</span></label>
                    <input type="email" id='email' name='email' className='border border-[#bababa]  rounded-md mt-2 h-9' />
                    </div> 
                </div>
                
                <div className='flex flex-row pb-2'> 
                    <div className='flex flex-col mr-2 w-full'>
                    <label htmlFor="password">Password <span className='text-red-600'>*</span></label>
                    <input type="password" id='password' name='password' className='border border-[#bababa]  rounded-md mt-2 h-9' />
                    </div>
                    <div className='flex flex-col w-full'>
                    <label htmlFor="conf_passowrd">Confirm Password <span className='text-red-600'>*</span></label>
                    <input type="password" id='conf_password' name='conf_password' className='border border-[#bababa]  rounded-md mt-2 h-9' />
                    </div>
                </div>
                <button type="submit" className="bg-[#169962] border w-full h-9 border-[#bababa] rounded-md text-white py-1">Register</button>
                <p className='text-green-700 text-center'>Already have an Account?</p>
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
        className='absolute lg:h-[22rem] xl:h-[27rem]  -right-24 2xl:mt-10 xl:translate-y-12 2xl:translate-y-0 w-auto '
        />

        </div>
      </div>
    </>
      
    </div>
  )
}

export default register

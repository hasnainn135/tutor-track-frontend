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
        <div className="bg-white w-1/2 h-screen flex flex-col justify-center items-center">
            <h1 className="font-bold text-center text-6xl mb-12" >Register</h1>
            <div className="w-[30rem] h-14 bg-[#EDEDED] border border-[#bababa] rounded-md flex flex-row justify-center items-center py-2 px-2">
                <button onClick={()=> setSelectedRole("student")}  type="button" className={`w-full rounded-md font-medium ${selectedRole === "student"? "bg-green-700 text-white":"bg-transparent text-green-700"} h-full`}>Student</button>
                <button onClick={()=> setSelectedRole("tutor")}  type="button" className={`w-full rounded-md font-medium ${selectedRole === "tutor"? "bg-green-700 text-white":"bg-transparent text-green-700"} h-full`}>Tutor</button>
            </div>
        </div>
        
        

        <div className="bg-green-950 w-1/2 h-screen flex flex-col text-white justify-center items-center overflow-hidden">

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

export default register

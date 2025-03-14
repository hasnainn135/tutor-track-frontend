import AuthLayout from "@/layouts/AuthLayout";
import React from "react";
import Image from "next/image";
import laptopAuthImage from "@/assets/laptopAuthImage.png";

const Login = () => {
  return (
    <>
    <div className="w-full h-screen flex flex-row">
        <div className="bg-white w-full lg:w-1/2 h-screen flex flex-col justify-center items-center">
        <h1 className="font-bold text-center text-6xl mb-12">Login</h1>
        <form className="flex flex-col">
          <label htmlFor="username">User name</label>
          <input
            type="text"
            id="username"
            name="username"
            className="border w-60 sm:w-80 border-[#bababa] rounded-md mb-2 h-9"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="border border-[#bababa] w-60 sm:w-80 rounded-md h-9"
          />
          <button type="submit" className="bg-[#169962] border w-60 sm:w-80 border-[#bababa] rounded-md mt-4 text-white py-1">Log In</button>
        </form>
        <p className="text-[#169962] mt-4">Create an Account</p>
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
  );
};
export default Login;
import AuthLayout from "@/layouts/AuthLayout";
import React from "react";
import Image from "next/image";
import laptopAuthImage from "@/assets/laptopAuthImage.png";

const ForgetPassword = () => {
  return (
    <>
      <div className="w-full h-screen flex flex-row">
        <div className="bg-white w-1/2 h-screen flex flex-col justify-center items-center">
        <h1 className="font-bold text-center text-6xl mb-12" >Forgot Your Password?</h1>
        <form className="flex flex-col">
        <label htmlFor="alt_email">Alternate Email</label>
          <input
            type="email"
            id="alt_email"
            name="alt_email"
            className="border w-80 border-[#bababa] rounded-md h-9"
          />
          <button type="submit" className="bg-[#169962] border w-80 border-[#bababa] rounded-md mt-4 text-white py-1">Send reset link</button>

        </form>
        <p className="text-[#169962] mt-4">Back to login</p>
        
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
  );
};

export default ForgetPassword;

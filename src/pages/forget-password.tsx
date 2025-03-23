import AuthLayout from "@/layouts/AuthLayout";
import React, { FormEvent, useState } from "react";
import Image from "next/image";
import laptopAuthImage from "@/assets/laptopAuthImage.png";
import Link from "next/link";
import { auth } from "@/firebase/firebase";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";



const ForgetPassword = () => {
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("function called");
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("alt_email") as string;

    try{
      await sendPasswordResetEmail(auth,email)
    }catch (e:any){
      setError(e.message);
    }

  }
  return (
    <>
      <div className="w-full h-screen flex flex-row">
        <div className="bg-white w-full lg:w-1/2 h-screen flex flex-col justify-center items-center">
        <h1 className="font-bold text-center text-4xl sm:text-6xl mb-12" >Forgot Your Password?</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="alt_email">Your Email</label>
          <input
            type="email"
            id="alt_email"
            name="alt_email"
            className="border w-60 sm:w-80 border-[#bababa] rounded-md h-9"
          />
          <button type="submit" className="bg-[#169962] border sm:w-80 border-[#bababa] rounded-md mt-4 text-white py-1">Send reset link</button>

        </form>
        <Link href="/login" className="text-[#169962] mt-4">Back to login</Link>
        <p className="text-red">{error}</p>
        
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

export default ForgetPassword;

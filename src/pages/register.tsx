import React, { FormEvent } from 'react';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from 'next/router';
import { MdArrowBackIos } from "react-icons/md";
import Image from "next/image";
import laptopAuthImage from "@/assets/laptopAuthImage.png";
import Link from "next/link";

type userRoleType = "student" | "tutor";

const register = () => {
    const [selectedRole, setSelectedRole] = useState<userRoleType>("student");
    const [error, setError] = useState<string>("");
    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("function called");

        const formData = new FormData(e.currentTarget);
        const fullname = formData.get("fullname") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("conf_password") as string;

        if (password !== confirmPassword) {
            console.log("Password is not Correct");
            setError("Password does not match");
            return;
        }
        if (!fullname || !email || !password || !confirmPassword) {
            console.log("One of the field is empty");
            setError("One of the field is empty");
            return;
        }
        const data = {
            "displayName": fullname
        }
        try {
            const userCreds = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCreds.user, data)
            router.push("/")
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div className="relative w-full h-screen flex flex-row">

            <Link href="/login" className="absolute top-5 left-5">
                <MdArrowBackIos className="h-8 w-auto text-primary_green hover:h-10 transition-all duration-200"/>
            </Link>

            <div className="bg-white w-full lg:w-1/2 h-screen flex flex-col justify-center items-center">
                <h1 className="font-bold text-center text-6xl mb-12">Register</h1>
                <div
                    className="w-full sm:w-[30rem] h-14 bg-[#EDEDED] border border-[#bababa] rounded-md flex flex-row justify-center items-center py-2 px-2">
                    <button onClick={() => setSelectedRole("student")} type="button"
                            className={`w-full rounded-md font-medium ${selectedRole === "student" ? "bg-green-700 text-white" : "bg-transparent text-green-700"} h-full`}>Student
                    </button>
                    <button onClick={() => setSelectedRole("tutor")} type="button"
                            className={`w-full rounded-md font-medium ${selectedRole === "tutor" ? "bg-green-700 text-white" : "bg-transparent text-green-700"} h-full`}>Tutor
                    </button>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="w-full sm:w-[30rem] mt-3 space-y-2">
                    <div className='flex flex-row w-full'>
                        <div className='flex flex-col mr-2 w-full'>
                            <label htmlFor="fullname">Full Name <span className='text-red-600'>*</span></label>
                            <input type="text" id='fullname' name='fullname'
                                   className='border border-[#bababa]  rounded-md mt-2 h-9 ' required/>
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor="email">Email <span className='text-black'>*</span></label>
                            <input type="email" id='email' name='email'
                                   className='border border-[#bababa]  rounded-md mt-2 h-9' required/>
                        </div>
                    </div>
                    <div className='flex flex-row pb-2'>
                        <div className='flex flex-col mr-2 w-full'>
                            <label htmlFor="password">Password <span className='text-red-600'>*</span></label>
                            <input type="password" id='password' name='password'
                                   className='border border-[#bababa]  rounded-md mt-2 h-9' required/>
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor="conf_passowrd">Confirm Password <span
                                className='text-red-600'>*</span></label>
                            <input type="password" id='conf_password' name='conf_password'
                                   className='border border-[#bababa]  rounded-md mt-2 h-9' required/>
                        </div>
                    </div>
                    <button type="submit"
                            className="bg-[#169962] border w-full h-9 border-[#bababa] rounded-md text-white py-1">Register
                    </button>

                    <Link href="/login" className='text-green-700 text-center block'>Already have an Account?</Link>
                    <p className='text-red'>{error}</p>
                </form>
            </div>
            <div
                className="bg-green-950 w-1/2 h-screen flex-col text-white justify-center items-center overflow-hidden hidden lg:flex relative">

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
    )
}

export default register

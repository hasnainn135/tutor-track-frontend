import React, {FormEvent, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import laptopAuthImage from "@/assets/laptopAuthImage.png";
import {useRouter} from 'next/router';
import {MdArrowBackIos} from "react-icons/md";
import useAuthState from "@/states/AuthState";

const Login = () => {

    const {signIn, signOut} = useAuthState();
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("function called");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            console.log("one of the field is empty");
            setError("One of the field is empty");
            return;
        }

        try {
            const {user, userData} = await signIn(email, password);
            if (!user.emailVerified) {
                await signOut()
                router.push("/verify-your-email");
            }
            if (userData.role === "student") router.push("/student/dashboard");
            else router.push("/tutor/dashboard");
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <>
            <div className="relative w-full h-screen flex flex-row">
                <Link href="/" className="absolute top-5 left-5">
                    <MdArrowBackIos className="h-8 w-auto text-primary_green hover:h-10 transition-all duration-200"/>
                </Link>
                <div className="bg-white w-full lg:w-1/2 h-screen flex flex-col justify-center items-center">
                    <h1 className="font-bold text-center text-6xl mb-12">Login</h1>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col">
                        <label htmlFor="email">Email</label>
                        <input
                            required
                            type="email"
                            id="email"
                            name="email"
                            className="border w-60 sm:w-80 border-[#bababa] rounded-md mb-2 h-9"
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            required
                            type="password"
                            id="password"
                            name="password"
                            className="border border-[#bababa] w-60 sm:w-80 rounded-md h-9"
                        />
                        <Link href="/forget-password" className="text-[#169962] text-right">Forgot Password?</Link>
                        <button type="submit"
                                className="bg-[#169962] border w-60 sm:w-80 border-[#bababa] rounded-md mt-4 text-white py-1">Log
                            In
                        </button>
                    </form>
                    <Link href="/register" className="text-[#169962] mt-4">Create an Account</Link>
                    <p className="text-red">{error}</p>
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
                        className='absolute lg:h-[20rem] xl:h-[27rem]  -right-24 2xl:mt-10 xl:translate-y-12 2xl:translate-y-0 w-auto '
                    />
                </div>
            </div>
        </>
    );
};
export default Login;
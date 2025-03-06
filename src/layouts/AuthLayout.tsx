import React, { ReactNode } from "react";
import Image from "next/image";
import laptopAuthImage from "@/assets/laptopAuthImage.png";

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <div className="w-full h-screen flex flex-row">
        <div className="bg-white w-1/2 h-screen flex flex-col justify-center items-center">
          {children}
        </div>

        <div className="relative bg-green-950 w-1/2 h-screen flex flex-col text-white justify-center items-center">

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
}

export default AuthLayout;
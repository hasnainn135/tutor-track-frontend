import React from "react";
import Image from "next/image";
import mh from "@/assets/mh.jpg";

const StudentSettings = () => {
  const data = [
    {
      level: "A levels",
      subject: ["Mathematics", "Physics", "French", "Chemistry"],
    },
    {
      level: "IGCSE",
      subject: ["Mathematics", "Physics", "French"],
    },
    {
      level: "GCSE",
      subject: ["Mathematics", "Physics", "French", "Chemistry", "Spanish"],
    },
  ];

  return (
    <div className="flex justify-center">
      <form className="flex flex-col w-[40rem] h-screen mt-2">
        <p className="font-semibold">Settings</p>
        <button
          type="submit"
          className="border border-red rounded-md text-red mt-2 py-2 "
        >
          Delete Account
        </button>
        <div className="flex flex-row space-x-4 mt-4">
          <div className="flex items-center">
            <Image src={mh} alt="photo" className="w-full h-28 rounded-full " />
          </div>
          <div className="w-full space-y-2 ">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              className="border border-[#bababa] rounded-md h-9 w-full"
            />
            <div>
              <p>Email</p>
              <p>mhusnain123@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row mt-4 space-x-2 ">
          <div className="w-full">
            <label htmlFor="educationLevel">Education level</label>
            <input
              type="text"
              id="educationLevel"
              name="educationLevel"
              className="border border-[#bababa] rounded-md h-9 w-full"
            />
          </div>
          <div className="w-full">
            <label htmlFor="Institute">Institute</label>
            <input
              type="text"
              id="Institute"
              name="Institute"
              className="border border-[#bababa] rounded-md h-9 w-full"
            />
          </div>
        </div>
        <p className="mt-4">Change Password</p>
        <div className="flex flex-row mt-4 space-x-2 ">
          <div className="w-full">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="border border-[#bababa] rounded-md h-9 w-full"
            />
          </div>
          <div className="w-full">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassowrd"
              className="border border-[#bababa] rounded-md h-9 w-full"
            />
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <label htmlFor="about">About</label>
          <textarea
            name="about"
            id="about"
            className="border border-[#bababa] rounded-md w-full mt-2 h-40"
          ></textarea>

          <div className="grid grid-cols-4 place-items-center mt-4">
            <div className="col-span-1 text-green-600 text-center border border-[#bababa] w-full font-semibold py-2">
              Level
            </div>
            <div className="col-span-3 text-green-600 text-center border border-[#bababa] w-full font-semibold py-2">
              Subjects
            </div>
            {data.map((elem) => {
              return (
                <>
                  <div className="col-span-1 text-green-600 text-center border border-[#bababa] w-full font-semibold py-2">
                    {elem.level}
                  </div>
                  <div className="col-span-3 text-green-600 text-center border border-[#bababa] w-full font-semibold py-2">
                    {elem.subject.map((subject) => {
                      return (
                        <p className="inline mr-2 bg-[#12774D] text-white p-2 text-sm">
                          {subject}
                        </p>
                      );
                    })}
                  </div>
                </>
              );
            })}
          </div>
          <button
            type="submit"
            className="bg-[#169962] border border-[#bababa] rounded-md mt-4 text-white py-1 h-9"
          >
            Save Changes
          </button>
          <button
            type="submit"
            className="border border-[#169962] rounded-md mt-4 text-[#169962] py-1 font-semibold h-9"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentSettings;

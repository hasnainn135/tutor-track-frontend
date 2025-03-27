import React, {FormEvent, useState} from "react";
import Image from "next/image";
import mh from "@/assets/mh.jpg";
import useAuthState from "@/states/AuthState";
import {updatePassword, updateProfile} from "firebase/auth";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "@/firebase/firebase";

const StudentSettings = () => {

    const {user, userData} = useAuthState();
    const [error, setError] = useState("");

    if (!user) return <></>

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const displayName = formData.get("displayName") as string;
        const educationLevel = formData.get("educationLevel") as string;
        const institute = formData.get("institute") as string;
        const newPassword = formData.get("newPassword") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        const about = formData.get("about") as string;

        if (displayName !== user.displayName) {
            await updateProfile(user, {displayName: displayName});
        }

        if (newPassword && confirmPassword) {
            if (newPassword !== confirmPassword) {
                setError("new password and confirm password do not match");
            } else {
                await updatePassword(user, newPassword);
            }
        }

        if (educationLevel !== userData?.educationLevel || institute !== userData?.instituteName || about !== userData?.about) {
            await updateDoc(doc(db, "users", user.uid), {
                educationLevel: educationLevel,
                institute: institute,
                about: about,
            })
        }
    }

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col w-[40rem] h-screen mt-2">
                <p className="font-semibold">Settings</p>
                <button type="button" className="border border-red rounded-md text-red mt-2 py-2 ">Delete Account
                </button>
                <div className="flex flex-row space-x-4 mt-4">
                    <div className="flex items-center">
                        <Image
                            src={mh}
                            alt="photo"
                            className="w-full h-28 rounded-full "
                        />
                    </div>
                    <div className="w-full space-y-2 ">
                        <label htmlFor="displayName">Display Name</label>
                        <input
                            type="text"
                            id="displayName"
                            name="displayName"
                            value={user.displayName ? user.displayName : undefined}
                            className="border border-[#bababa] rounded-md h-9 w-full"/>
                        <div>
                            <p>Email</p>
                            <p>{user.email}</p>
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
                            className="border border-[#bababa] rounded-md h-9 w-full"/>
                    </div>
                    <div className="w-full">
                        <label htmlFor="Institute">Institute</label>
                        <input
                            type="text"
                            id="institute"
                            name="institute"
                            className="border border-[#bababa] rounded-md h-9 w-full"/>
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
                            className="border border-[#bababa] rounded-md h-9 w-full"/>
                    </div>
                    <div className="w-full">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassowrd"
                            className="border border-[#bababa] rounded-md h-9 w-full"/>
                    </div>
                </div>
                <div className="flex flex-col mt-2">
                    <label htmlFor="about">About</label>
                    <textarea name="about" id="about"
                              className="border border-[#bababa] rounded-md w-full mt-2 h-40"></textarea>
                    <button type="submit"
                            className="bg-[#169962] border border-[#bababa] rounded-md mt-4 text-white py-1 h-9">Save
                        Changes
                    </button>
                    <button type="button"
                            className="border border-[#169962] rounded-md mt-4 text-[#169962] py-1 font-semibold h-9">Cancel
                    </button>
                    <p>{error}</p>
                </div>
            </form>
        </div>
    )

};

export default StudentSettings;

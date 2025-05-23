import React, { FormEvent, useState } from "react";
import Image from "next/image";
import useAuthState from "@/states/AuthState";
import { updatePassword, updateProfile, User } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import pfp2 from "@/assets/pfp2.png";
import { useRouter } from "next/router";
import { deleteMyUser } from "@/utils/firestore";

const StudentSettings = () => {
  const { user, userData } = useAuthState();
  const router = useRouter();
  const [error, setError] = useState("");
  console.log(userData);

  if (!user) return <></>;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const displayName = formData.get("displayName") as string;
    const educationLevel = formData.get("educationLevel") as string;
    const institute = formData.get("institute") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const about = formData.get("about") as string;

    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        setError("new password and confirm password do not match");
      } else {
        await updatePassword(user, newPassword);
      }
    }

    if (displayName !== user.displayName) {
      await updateProfile(user, { displayName: displayName });
    }

    if (
      educationLevel !== userData?.educationLevel ||
      institute !== userData?.instituteName ||
      about !== userData?.about ||
      displayName !== user.displayName
    ) {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: displayName,
        educationLevel: educationLevel,
        institute: institute,
        about: about,
      });
    }

    router.push("/student/dashboard");
  };

  const handleDeleteUser = async () => {
    try {
      await deleteMyUser(user);
      router.push("/login");
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (userData)
    return (
      <div className="flex justify-center bg-white rounded-lg border border-[#BABABA] py-5 px-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-[40rem] h-full mt-2 gap-3 "
        >
          <p className="font-semibold text-3xl mb-2">Settings</p>
          <button
            onClick={handleDeleteUser}
            type="button"
            className="border border-red rounded-md text-red mt-2 py-2 hover:bg-red-400 "
          >
            Delete Account
          </button>
          <div className="flex sm:flex-row flex-col  gap-4">
            <div className=" w-36 h-auto rounded-full overflow-hidden">
              <Image
                src={userData?.profilePicture ? userData?.profilePicture : pfp2}
                alt="photo"
                className="object-cover w-36 h-auto"
              />
            </div>
            <div className="w-full space-y-2">
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                defaultValue={user.displayName ? user.displayName : undefined}
                className="border border-[#bababa] rounded-md h-9 w-full"
              />
              <div>
                <p>Email</p>
                <p>{user.email}</p>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col  mt-4 gap-2 ">
            <div className="w-full">
              <label htmlFor="educationLevel">Education level</label>
              <input
                type="text"
                id="educationLevel"
                name="educationLevel"
                defaultValue={userData.educationLevel ?? undefined}
                className="border border-[#bababa] rounded-md h-9 w-full"
              />
            </div>
            <div className="w-full">
              <label htmlFor="Institute">Institute</label>
              <input
                type="text"
                id="institute"
                name="institute"
                defaultValue={userData?.instituteName ?? undefined}
                className="border border-[#bababa] rounded-md h-9 w-full"
              />
            </div>
          </div>
          <div className="">
            <p className="py-3 font-semibold">Change Password</p>
            <div className="flex sm:flex-row flex-col  gap-2    ">
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
                  name="confirmPassword"
                  className="border border-[#bababa] rounded-md h-9 w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="about">About</label>
            <textarea
              name="about"
              id="about"
              defaultValue={userData?.about ?? undefined}
              className="border border-[#bababa] rounded-md w-full mt-2 h-40"
            ></textarea>
          </div>

          <div className="flex flex-col w-full gap-3">
            <Button type="submit">Save Changes</Button>
            <Link href={"/student/dashboard"} className="">
              <Button className="w-full" variant={"outline_green"}>
                Cancel
              </Button>
            </Link>
            <p className="text-red text-center mb-4">{error}</p>
          </div>
        </form>
      </div>
    );
};

export default StudentSettings;

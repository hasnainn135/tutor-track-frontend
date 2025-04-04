import React, { FormEvent, useState } from "react";
import Image from "next/image";
import mh from "@/assets/mh.jpg";
import { updatePassword, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import useAuthState from "@/states/AuthState";
import { Button } from "@/components/ui/button";
import { FiMinusSquare } from "react-icons/fi";
import Link from "next/link";

type timeSlotType = {
  day: string;
  timeRange: {
    id: string;
    from: string;
    to: string;
  }[];
};

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

const TutorSettings = () => {
  const { user, userData } = useAuthState();
  const [error, setError] = useState("");

  if (!user) return <></>;

  const [slots, setSlots] = useState<timeSlotType[]>([
    {
      day: "Monday",
      timeRange: [
        { id: "s1t1", from: "10:00", to: "11:00" },
        { id: "s1t2", from: "12:00", to: "13:00" },
      ],
    },
    {
      day: "Tuesday",
      timeRange: [{ id: "s2t1", from: "10:00", to: "11:00" }],
    },
    {
      day: "Wednesday",
      timeRange: [],
    },
    {
      day: "Thursday",
      timeRange: [],
    },
    {
      day: "Friday",
      timeRange: [],
    },
    {
      day: "Saturday",
      timeRange: [],
    },
    {
      day: "Sunday",
      timeRange: [],
    },
  ]);

  const handleSlotChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    slot: timeSlotType,
    slotIndex: number,
    timeRangeIndex: number
  ) => {
    const newSlots = [...slots];

    if (e.currentTarget.id === `slot-${slotIndex}-from-${timeRangeIndex}`)
      newSlots[slotIndex].timeRange[timeRangeIndex].from =
        e.currentTarget.value;
    else if (e.currentTarget.id === `slot-${slotIndex}-to-${timeRangeIndex}`)
      newSlots[slotIndex].timeRange[timeRangeIndex].to = e.currentTarget.value;

    setSlots(newSlots);
  };

  const removeTimeRange = (
    time: { from: string; to: string },
    slotIndex: number
  ) => {
    const newSlots = [...slots];
    const slot = newSlots[slotIndex];
    const timeRangeIndex = slot.timeRange.findIndex(
      (t) => t.from === time.from && t.to === time.to
    );
    if (timeRangeIndex !== -1) {
      slot.timeRange.splice(timeRangeIndex, 1);
      setSlots(newSlots);
    }
  };

  const addTimeRange = (slotIndex: number) => {
    setSlots((prevSlots) => {
      return prevSlots.map((slot, index) => {
        if (index === slotIndex) {
          // Generate unique ID using slot index and current time range length
          const newId = `slot-${slotIndex}-t${slot.timeRange.length}`;

          return {
            ...slot,
            timeRange: [...slot.timeRange, { id: newId, from: "", to: "" }],
          };
        }
        return slot;
      });
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const displayName = formData.get("displayName") as string;
    const educationLevel = formData.get("educationLevel") as string;
    const institute = formData.get("institute") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const about = formData.get("about") as string;

    // Extract Time Slot Data
    const updatedSlots: timeSlotType[] = slots.map((slot, s) => ({
      ...slot,
      timeRange: slot.timeRange.map((_, t) => ({
        id: `slot-${s}-t${t}`,
        from: formData.get(`slot-${s}-from-${t}`) as string,
        to: formData.get(`slot-${s}-to-${t}`) as string,
      })),
    }));

    console.log("Updated Time Slots:", updatedSlots);

    if (displayName !== user.displayName) {
      await updateProfile(user, { displayName: displayName });
    }

    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        setError("new password and confirm password do not match");
      } else {
        await updatePassword(user, newPassword);
      }
    }

    if (
      educationLevel !== userData?.educationLevel ||
      institute !== userData?.instituteName ||
      about !== userData?.about
    ) {
      await updateDoc(doc(db, "users", user.uid), {
        educationLevel: educationLevel,
        institute: institute,
        about: about,
      });
    }
  };

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[40rem] h-screen mt-2"
      >
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
          {/* TIME SLOTS */}
          <div className="">
            <p className="py-3 font-semibold">Set Time Slot</p>
            {slots.map((slot, s) => {
              return (
                <div
                  key={slot.day}
                  className="border-t border-light_gray py-3 flex flex-col gap-2"
                >
                  <p>{slot.day}</p>
                  {slot.timeRange.map((time, t) => {
                    return (
                      <div
                        key={time.id}
                        className=" flex items-center w-full gap-2"
                      >
                        <input
                          type="time"
                          name={`slot-${s}-from-${t}`} // Unique name
                          id={`slot-${s}-from-${t}`}
                          value={time.from}
                          onChange={(e) => handleSlotChange(e, slot, s, t)}
                          className="w-full border border-light_gray rounded-md p-2"
                        />
                        <input
                          type="time"
                          name={`slot-${s}-to-${t}`} // Unique name
                          id={`slot-${s}-to-${t}`}
                          value={time.to}
                          onChange={(e) => handleSlotChange(e, slot, s, t)}
                          className="w-full border border-light_gray rounded-md p-2"
                        />
                        <button
                          type="button"
                          title="remove slot"
                          className="flex-shrink-0"
                          onClick={() => removeTimeRange(time, s)}
                        >
                          <FiMinusSquare className="text-red size-5" />
                        </button>
                      </div>
                    );
                  })}
                  <Button
                    type="button"
                    variant={"ghost_green"}
                    onClick={() => addTimeRange(s)}
                  >
                    Add Slot
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col w-full gap-3">
            <Button type="submit">Save Changes</Button>
            <Link href={"/student/dashboard"} className="">
              <Button className="w-full" variant={"outline_green"}>
                Cancel
              </Button>
            </Link>
            <p>{error}</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TutorSettings;

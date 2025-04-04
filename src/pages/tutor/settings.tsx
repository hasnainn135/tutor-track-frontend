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
import { TutorSchema, WeeklySchedule } from "@/types/firebase";

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

const scheduleMap: WeeklySchedule[] = [
    {
        day: "Monday",
        timeRange: [{ id: "", from: "", to: "" }],
    },
    {
        day: "Tuesday",
        timeRange: [{ id: "", from: "", to: "" }],
    },
    {
        day: "Wednesday",
        timeRange: [{ id: "", from: "", to: "" }],
    },
    {
        day: "Thursday",
        timeRange: [{ id: "", from: "", to: "" }],
    },
    {
        day: "Friday",
        timeRange: [{ id: "", from: "", to: "" }],
    },
    {
        day: "Saturday",
        timeRange: [{ id: "", from: "", to: "" }],
    },
    {
        day: "Sunday",
        timeRange: [{ id: "", from: "", to: "" }],
    },
];

const TutorSettings = () => {
    const { user, userData } = useAuthState();
    const tutor = userData as TutorSchema;
    const [error, setError] = useState("");

    if (!user) return <></>;

    const [slots, setSlots] = useState<WeeklySchedule[] | null>(
        tutor?.weeklySchedule && tutor.weeklySchedule.length > 0
        ? tutor.weeklySchedule
        : scheduleMap);

    const handleSlotChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        slot: WeeklySchedule,
        slotIndex: number,
        timeRangeIndex: number
    ) => {
        let newSlots: WeeklySchedule[] = [];
        if (slots) {
            newSlots = [...slots];
        }

        if (e.currentTarget.id === `slot-${slotIndex}-from-${timeRangeIndex}`)
            newSlots[slotIndex].timeRange[timeRangeIndex].from = e.currentTarget.value;
        else if (e.currentTarget.id === `slot-${slotIndex}-to-${timeRangeIndex}`)
            newSlots[slotIndex].timeRange[timeRangeIndex].to = e.currentTarget.value;

        setSlots(newSlots);
    };

    const removeTimeRange = (time: { from: string; to: string }, slotIndex: number) => {
        let newSlots: WeeklySchedule[] = [];
        if (slots) {
            newSlots = [...slots];
        }
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
            if (!prevSlots) return null;
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
        console.log("clicked");
        const formData = new FormData(e.currentTarget);
        const displayName = formData.get("displayName") as string;
        const educationLevel = formData.get("educationLevel") as string;
        const institute = formData.get("institute") as string;
        const newPassword = formData.get("newPassword") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        const about = formData.get("about") as string;

        console.log("clicked 2");
        // Extract Time Slot Data
        const updatedSlots: WeeklySchedule[] | undefined = slots?.map((slot, s) => ({
            ...slot,
            timeRange: slot.timeRange
                .map((_, t) => ({
                    id: `slot-${s}-t${t}`,
                    from: formData.get(`slot-${s}-from-${t}`) as string,
                    to: formData.get(`slot-${s}-to-${t}`) as string,
                }))
                // Filter out any timeRange objects with empty "from" or "to" values
                .filter((time) => time.from.trim() !== "" && time.to.trim() !== ""),
        }));

        console.log("clicked 3");
        // Time range validation: ensure "from" time is earlier than "to" time
        if (updatedSlots) {
            for (const slot of updatedSlots) {
                for (const timeRange of slot.timeRange) {
                    if (timeRange.from && timeRange.to && timeRange.from >= timeRange.to) {
                        setError(`Invalid time range for ${slot.day}: Start time must be before end time.`);
                        return;
                    }
                }
            }
        }

        console.log("Updated Time Slots:", updatedSlots);

        if (displayName !== user.displayName) {
            await updateProfile(user, { displayName });
        }

        if (newPassword && confirmPassword) {
            if (newPassword !== confirmPassword) {
                setError("New password and confirm password do not match");
                return;
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
                educationLevel,
                institute,
                about,
            });
        }

        if (updatedSlots !== tutor.weeklySchedule) {
            await updateDoc(doc(db, "users", user.uid), {
                weeklySchedule: updatedSlots,
            });
        }
    };

    return (
        <div className="flex justify-center px-4">
            <form onSubmit={handleSubmit} className="flex flex-col w-[40rem] h-screen mt-2">
                <p className="font-semibold">Settings</p>
                <button
                    type="submit"
                    className="border border-red rounded-md text-red mt-2 py-2"
                >
                    Delete Account
                </button>
                <div className="flex sm:flex-row flex-col gap-4 mt-4">
                    <div className="bg-light_gray w-36 h-36 rounded-full overflow-hidden">
                        <Image src={mh} alt="photo" className="object-cover w-full h-36" />
                    </div>
                    <div className="w-full space-y-2">
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
                <div className="flex sm:flex-row flex-col mt-4 gap-2">
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
                        <label htmlFor="institute">Institute</label>
                        <input
                            type="text"
                            id="institute"
                            name="institute"
                            className="border border-[#bababa] rounded-md h-9 w-full"
                        />
                    </div>
                </div>
                <p className="mt-4">Change Password</p>
                <div className="flex sm:flex-row flex-col mt-4 gap-2">
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
                <div className="flex flex-col mt-2">
                    <label htmlFor="about">About</label>
                    <textarea
                        name="about"
                        id="about"
                        className="border border-[#bababa] rounded-md w-full mt-2 h-40"
                    ></textarea>
                    {/* Teaching Levels */}
                    <div className="max-w-[650px] border border-light_gray rounded-lg overflow-hidden my-3">
                        <div className="grid grid-cols-[160px_1fr] text-lg text-primary_green font-semibold text-center">
                            <div className="p-3">Levels</div>
                            <div className="border-l border-light_gray p-3">Subjects</div>
                        </div>
                        {data.map((level) => (
                            <div
                                key={level.level}
                                className="grid grid-cols-[160px_1fr] border-t border-light_gray"
                            >
                                <div className="font-semibold p-3 flex items-center text-justify">
                                    {level.level}
                                </div>
                                <div className="p-3 flex items-center gap-2 flex-wrap border-l border-light_gray">
                                    {level.subject.map((sub) => (
                                        <div
                                            key={sub}
                                            className="bg-primary_green py-1.5 px-3 text-white rounded-lg"
                                        >
                                            {sub}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TIME SLOTS */}
                    <div className="">
                        <p className="py-3 font-semibold">Set Time Slot</p>
                        {slots?.map((slot, s) => {
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
                                                className="flex items-center w-full gap-2"
                                            >
                                                <input
                                                    type="time"
                                                    name={`slot-${s}-from-${t}`}
                                                    id={`slot-${s}-from-${t}`}
                                                    value={time.from}
                                                    onChange={(e) => handleSlotChange(e, slot, s, t)}
                                                    className="w-full border border-light_gray rounded-md p-2"
                                                />
                                                <input
                                                    type="time"
                                                    name={`slot-${s}-to-${t}`}
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
                                    <Button type="button" variant={"ghost_green"} onClick={() => addTimeRange(s)}>
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
                        <p className="text-red text-center mb-4">{error}</p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TutorSettings;

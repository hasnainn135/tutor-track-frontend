import React, { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import pfp2 from "@/assets/pfp2.png";
import { updatePassword, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import useAuthState from "@/states/AuthState";
import { Button } from "@/components/ui/button";
import { FiMinusSquare } from "react-icons/fi";
import Link from "next/link";
import { TeachingLevel, TutorSchema, WeeklySchedule } from "@/types/firebase";
import { useRouter } from "next/router";
import {
  addTeachingLevel,
  deleteMyUser,
  removeSubjectFromLevel,
  removeTeachingLevel,
  updateTeachingLevelSubjects,
} from "@/utils/firestore";
import { IoMdAdd, IoMdRemove } from "react-icons/io";

const data: TeachingLevel[] = [
  {
    level: "A levels",
    subjects: ["Mathematics", "Physics", "French", "Chemistry"],
  },
  {
    level: "IGCSE",
    subjects: ["Mathematics", "Physics", "French"],
  },
  {
    level: "GCSE",
    subjects: ["Mathematics", "Physics", "French", "Chemistry", "Spanish"],
  },
];

const scheduleMap: WeeklySchedule[] = [
  { day: "Monday", timeRange: [{ id: "", from: "", to: "" }] },
  { day: "Tuesday", timeRange: [{ id: "", from: "", to: "" }] },
  { day: "Wednesday", timeRange: [{ id: "", from: "", to: "" }] },
  { day: "Thursday", timeRange: [{ id: "", from: "", to: "" }] },
  { day: "Friday", timeRange: [{ id: "", from: "", to: "" }] },
  { day: "Saturday", timeRange: [{ id: "", from: "", to: "" }] },
  { day: "Sunday", timeRange: [{ id: "", from: "", to: "" }] },
];

const TutorSettings = () => {
  const { user, userData } = useAuthState();
  const tutor = userData as TutorSchema;
  const router = useRouter();
  const [error, setError] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  if (!user) return <></>;

  const addLevelRef = useRef<HTMLDialogElement>(null);
  const addSubjectRef = useRef<HTMLDialogElement>(null);

  const [slots, setSlots] = useState<WeeklySchedule[] | null>(
    tutor?.weeklySchedule && tutor.weeklySchedule.length > 0
      ? tutor.weeklySchedule
      : scheduleMap
  );

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
    const country = formData.get("country") as string;
    const city = formData.get("city") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const about = formData.get("about") as string;
    const yearsOfExperience = formData.get("yearsOfExperience") as string;
    const displayChargesPerHour = formData.get(
      "displayChargesPerHour"
    ) as string;
    const yoeNumber = Number(yearsOfExperience);
    const cphNumber = Number(displayChargesPerHour);
    console.log("displayName: ", displayName);
    console.log("displayName: ", user.displayName);

    console.log("clicked 2");
    // Extract Time Slot Data
    const updatedSlots: WeeklySchedule[] | undefined = slots?.map(
      (slot, s) => ({
        ...slot,
        timeRange: slot.timeRange
          .map((_, t) => ({
            id: `slot-${s}-t${t}`,
            from: formData.get(`slot-${s}-from-${t}`) as string,
            to: formData.get(`slot-${s}-to-${t}`) as string,
          }))
          // Filter out any timeRange objects with empty "from" or "to" values
          .filter((time) => time.from.trim() !== "" && time.to.trim() !== ""),
      })
    );

    console.log("clicked 3");
    // Time range validation: ensure "from" time is earlier than "to" time
    if (updatedSlots) {
      for (const slot of updatedSlots) {
        for (const timeRange of slot.timeRange) {
          if (
            timeRange.from &&
            timeRange.to &&
            timeRange.from >= timeRange.to
          ) {
            setError(
              `Invalid time range for ${slot.day}: Start time must be before end time.`
            );
            return;
          }
        }
      }
    }

    console.log("Updated Time Slots:", updatedSlots);

    if (displayName !== user.displayName) {
      console.log("Updateing Auth onbj: ");

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

    console.log("cph = ", cphNumber);
    console.log("yoe = ", yoeNumber);

    console.log(displayName !== user.displayName);

    if (
      educationLevel !== userData?.educationLevel ||
      institute !== userData?.instituteName ||
      about !== userData?.about ||
      country !== userData?.country ||
      city !== userData?.city ||
      yoeNumber !== tutor.yearsOfExperience ||
      cphNumber !== tutor.displayChargesPerHour ||
      displayName !== tutor.displayName
    ) {
      console.log("Updateing DOC: ");

      await updateDoc(doc(db, "users", user.uid), {
        educationLevel,
        instituteName: institute,
        about,
        country,
        city,
        yearsOfExperience: yoeNumber,
        displayChargesPerHour: cphNumber,
        displayName: displayName,
      });
    }

    if (updatedSlots !== tutor.weeklySchedule) {
      await updateDoc(doc(db, "users", user.uid), {
        weeklySchedule: updatedSlots,
      });
    }

    // router.reload();
  };

  const handleDeleteUser = async () => {
    try {
      await deleteMyUser(user);
      router.push("/login");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="flex justify-center px-4">
      <dialog ref={addLevelRef} className="rounded-lg overflow-hidden bg-white">
        <div className="p-4 min-w-96">
          <form
            className="flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const level = formData.get("level") as string;
              const newTeachingLevel: TeachingLevel = {
                level: level,
                subjects: [],
              };
              try {
                await addTeachingLevel(tutor.uid, newTeachingLevel);
                addLevelRef.current?.close();
                window.location.reload();
              } catch (e) {
                console.log(e);
              }
            }}
          >
            <input
              type="text"
              required
              name="level"
              placeholder="Level"
              className="p-2 border border-light_gray rounded-md"
            />
            <Button type="submit">Add Level</Button>
            <Button
              variant={"outline_green"}
              onClick={() => addLevelRef.current?.close()}
            >
              Cancel
            </Button>
          </form>
        </div>
      </dialog>
      <dialog
        ref={addSubjectRef}
        className="rounded-lg overflow-hidden bg-white"
      >
        <div className="p-4 min-w-96">
          <h3 className="pb-4 font-medium">Add Subject for {selectedLevel}</h3>
          <form
            className="flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const subject = formData.get("subject") as string;
              const subjects: string[] = [
                ...(tutor.teachingLevels.find(
                  (level) => level.level === selectedLevel
                )?.subjects ?? []),
              ];
              if (!subjects.includes(subject)) subjects.push(subject);

              try {
                await updateTeachingLevelSubjects(
                  tutor.uid,
                  selectedLevel,
                  subjects
                );
                addSubjectRef.current?.close();
                window.location.reload();
              } catch (e) {
                console.log(e);
              }
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                required
                name="subject"
                placeholder="Add Subject"
                className=" w-full p-2 border border-light_gray rounded-md"
              />
            </div>
            <Button type="submit">Add Subject</Button>
            <Button
              variant={"outline_green"}
              onClick={() => addSubjectRef.current?.close()}
            >
              Cancel
            </Button>
          </form>
        </div>
      </dialog>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[40rem] h-screen mt-2 gap-3"
      >
        <p className="font-semibold text-3xl mb-2">Settings</p>
        <button
          onClick={handleDeleteUser}
          type="submit"
          className="border border-red rounded-md text-red mt-2 py-2 hover:bg-red-400"
        >
          Delete Account
        </button>
        <div className="flex sm:flex-row flex-col gap-4">
          <div className="flex items-center w-36 h-auto rounded-full overflow-hidden">
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
        <div className="flex sm:flex-row flex-col mt-4 gap-2">
          <div className="w-full">
            <label htmlFor="educationLevel">Education level</label>
            <input
              type="text"
              id="educationLevel"
              name="educationLevel"
              defaultValue={userData?.educationLevel ?? undefined}
              className="border border-[#bababa] rounded-md h-9 w-full"
            />
          </div>
          <div className="w-full">
            <label htmlFor="institute">Institute</label>
            <input
              type="text"
              id="institute"
              name="institute"
              defaultValue={userData?.instituteName ?? undefined}
              className="border border-[#bababa] rounded-md h-9 w-full"
            />
          </div>
        </div>
        {/* Country and City Fields Side by Side */}
        <div className="flex sm:flex-row flex-col mt-4 gap-2">
          <div className="w-full">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              defaultValue={userData?.country ?? undefined}
              className="border border-[#bababa] rounded-md h-9 w-full"
            />
          </div>
          <div className="w-full">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              defaultValue={userData?.city ?? undefined}
              className="border border-[#bababa] rounded-md h-9 w-full"
            />
          </div>
        </div>
        <div className="flex sm:flex-row flex-col mt-4 gap-2">
          <div className="w-full">
            <label htmlFor="yearsOfExperience">
              Number of Years of Experience
            </label>
            <input
              type="number"
              id="yearsOfExperience"
              name="yearsOfExperience"
              defaultValue={tutor?.yearsOfExperience ?? undefined}
              className="border border-[#bababa] rounded-md h-9 w-full"
            />
          </div>
          <div className="w-full">
            <label htmlFor="displayChargesPerHour">Your Hourly Charges</label>
            <input
              type="number"
              id="displayChargesPerHour"
              name="displayChargesPerHour"
              defaultValue={tutor?.displayChargesPerHour ?? undefined}
              className="border border-[#bababa] rounded-md h-9 w-full"
            />
          </div>
        </div>
        <div className="">
          <p className="py-3 font-semibold">Change Password</p>
          <div className="flex sm:flex-row flex-col gap-2">
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
        <div className="flex flex-col mt-2">
          <label htmlFor="about">About</label>
          <textarea
            name="about"
            id="about"
            defaultValue={userData?.about ?? undefined}
            className="border border-[#bababa] rounded-md w-full mt-2 h-40"
          ></textarea>
          {/* Teaching Levels */}
          <div className="max-w-[650px] border border-light_gray rounded-lg overflow-hidden my-3">
            <div className="grid grid-cols-[160px_1fr] text-lg text-primary_green font-semibold text-center">
              <div className="p-3">Levels</div>
              <div className="border-l border-light_gray p-3">Subjects</div>
            </div>
            {tutor.teachingLevels.map((level) => (
              <div
                key={level.level}
                className="grid grid-cols-[160px_1fr] border-t border-light_gray"
              >
                <div className="font-semibold p-3 flex items-center text-justify gap-2">
                  {level.level}
                  <button
                    title="add subject"
                    className="grid place-content-center border border-red text-red rounded-sm flex-shrink-0 w-5 h-5"
                    onClick={async () => {
                      await removeTeachingLevel(tutor.uid, level.level);
                      window.location.reload();
                    }}
                  >
                    <IoMdRemove className="size-3" />
                  </button>
                </div>
                <div className="p-3 flex items-center gap-2 flex-wrap border-l border-light_gray">
                  {level.subjects.map((sub) => (
                    <div
                      key={sub}
                      className="flex items-center justify-between gap-2 bg-primary_green py-1.5 px-3 text-white rounded-lg"
                    >
                      {sub}
                      <button
                        className=""
                        onClick={async () => {
                          await removeSubjectFromLevel(
                            tutor.uid,
                            level.level,
                            sub
                          );
                          window.location.reload();
                        }}
                      >
                        <IoMdRemove className="size-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    title="add subject"
                    className="grid place-content-center border border-primary_green text-primary_green rounded-md flex-shrink-0 w-6 h-6"
                    onClick={() => {
                      addSubjectRef.current?.showModal();
                      setSelectedLevel(level.level);
                    }}
                  >
                    <IoMdAdd className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[160px_1fr]  text-primary_green text-sm  font-medium text-center">
            <button
              className="p-3 hover:underline"
              onClick={() => {
                addLevelRef.current?.showModal();
              }}
            >
              Add Level
            </button>
            {/* <div className=" p-3">Subjects</div> */}
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
            <p className="text-red text-center mb-4">{error}</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TutorSettings;

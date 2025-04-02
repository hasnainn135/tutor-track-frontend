import React, { FC, useEffect, useState } from "react";
import ContainerLayout from "../layouts/ContainerLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "@/components/ui/date-picker";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useAuthState from "@/states/AuthState";
import { TutorSchema } from "@/types/firebase";
import { createSession, getMyTutors } from "@/utils/firestore";
import { ca } from "date-fns/locale";

const BookSession: FC = () => {
  const { user, userData } = useAuthState();

  const [date, setDate] = useState<Date | undefined>();
  const [selectedDay, setSelectedDay] = useState<
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"
  >();
  const [selectedTutor, setSelectedTutor] = useState<TutorSchema | null>(null);
  const [myTutors, setMyTutors] = useState<TutorSchema[] | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    sessionWith: "",
    sessionLimit: "",
    timeSlot: "",
    notes: "",
    date: undefined,
  });

  function getWeekday(dateString: string) {
    const date = new Date(dateString);
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return weekdays[date.getDay()] as
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday";
  }

  useEffect(() => {
    async function fetchStudentsTutors() {
      if (!user) return;
      if (userData?.role === "student") {
        try {
          const tutors = await getMyTutors(user.uid);

          setMyTutors(tutors);
        } catch (error) {
          console.error("Error fetching Tutor Data:", error);
        }
      }
    }
  }, [user, userData]);

  // Handle input changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  //Update date in Form Data
  useEffect(() => {
    handleChange("date", date);
  }, [date]);

  //Update SelectedDay
  useEffect(() => {
    if (!date) return;
    setSelectedDay(getWeekday(date?.toString()));
  }, [date]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!date) {
        setFormError("Please Select a Session Date");
        return;
      } else setFormError(null);

      if (user && userData) {
        setIsSubmitting(true);
        createSession(
          formData.sessionWith, // tutorId
          user.uid, // studentId
          formData.sessionLimit, // sessionDuration
          formData.timeSlot, // timeSlot
          date, // sessionDate
          formData.notes, // notes,
          500 // sessionCharges
        );
      }
    } catch (error) {
      console.error("Error creating session:", error);
    } finally {
      setIsSubmitting(false);
    }

    console.log("Form Data:", formData);
  };

  return (
    <ContainerLayout heading="Book a Session">
      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-3 grid-cols-1 gap-6"
      >
        <div className="flex flex-col gap-5 lg:col-span-2">
          {/* Session With */}
          <div className="flex flex-col gap-2">
            <label htmlFor="session-with" className="font-medium text-sm">
              Session With
            </label>
            <Select
              required
              onValueChange={(value) => {
                handleChange("sessionWith", value);
                setSelectedTutor(
                  myTutors?.find((tutor) => tutor.uid === value) || null
                );
              }}
            >
              <SelectTrigger
                id="session-with"
                className="w-full h-14 font-medium "
              >
                <SelectValue placeholder="Select Tutor" />
              </SelectTrigger>
              <SelectContent>
                {myTutors?.map((tutor) => {
                  return (
                    <SelectItem key={tutor.uid} value={tutor.uid}>
                      <div className="flex items-center justify-start gap-2">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200">
                          <img
                            src={tutor.profilePicture ?? undefined}
                            alt=""
                            className="object-cover h-9"
                          />
                        </div>
                        <p>{tutor.fullName}</p>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          {/* Session Limit */}
          <div className="flex flex-col gap-2">
            <label htmlFor="session-limit" className="font-medium text-sm">
              Session Limit
            </label>
            <Select
              required
              onValueChange={(value) => {
                handleChange("sessionLimit", value);
              }}
            >
              <SelectTrigger id="session-limit" className="w-full font-medium ">
                <SelectValue placeholder="Select Session Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30 minutes">30 minutes</SelectItem>
                <SelectItem value="1 hour">1 hour</SelectItem>
                <SelectItem value="1 hour 30 minutes">
                  1 hour 30 minutes
                </SelectItem>
                <SelectItem value="2 hours ">2 hours</SelectItem>
                <SelectItem value="2 hours 30 minutes">
                  2 hours 30 minutes
                </SelectItem>
                <SelectItem value="3 hours">3 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Time Slot */}
          {selectedTutor?.weeklySchedule && selectedDay && (
            <div className="flex flex-col gap-2">
              <p className="font-medium text-sm">Pick Time Slot</p>
              <div className="flex gap-2 flex-wrap">
                {selectedTutor?.weeklySchedule?.[selectedDay]?.map((slot) => (
                  <div key={`${slot.start} + ${slot.end}`} className="relative">
                    <input
                      onChange={(e) =>
                        handleChange("timeSlot", e.currentTarget.value)
                      }
                      required
                      type="radio"
                      name="slot"
                      id={`${slot.start} + ${slot.end}`}
                      value={`${slot.start} + ${slot.end}`}
                      className="peer absolute opacity-0"
                    />
                    <label
                      htmlFor={`${slot.start} + ${slot.end}`}
                      className="text-center block w-32 cursor-pointer border border-primary_green rounded-md px-3 py-1.5 text-primary_green font-medium peer-checked:bg-primary_green peer-checked:text-white"
                    >
                      {slot.start}
                      {slot.end}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Date */}
          <div className="lg:hidden flex flex-col gap-2">
            <label htmlFor="date" className="font-medium text-sm">
              Date
            </label>
            <DatePicker
              className="w-full border-neutral-200"
              date={date}
              setDate={setDate}
              disablePrev={true}
            />
          </div>
          {/* Additional Notes */}
          <div className="flex flex-col gap-2">
            <label htmlFor="additional-notes" className="font-medium text-sm">
              Additional Notes
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.currentTarget.value)}
              placeholder="Type additional notes here."
              id="notes"
            />
          </div>

          {formError && (
            <p className="text-red text-sm font-semibold  text-center">
              {formError}
            </p>
          )}
          <Button
            className="w-full flex items-center gap-2"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="6" />
                <p>Booking Session</p>
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
        <div className="">
          {/* Date */}
          <div className="lg:flex hidden flex-col gap-2">
            <label htmlFor="date" className="font-medium text-sm">
              Date
            </label>
            <DatePicker
              className="w-full border-neutral-200"
              date={date}
              setDate={setDate}
              disablePrev={true}
            />
          </div>
        </div>
      </form>
    </ContainerLayout>
  );
};

export default BookSession;

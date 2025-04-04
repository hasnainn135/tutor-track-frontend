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
import { StudentSchema, TutorSchema } from "@/types/firebase";
import { createSession, getMyTutors } from "@/utils/firestore";

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

  const [formData, setFormData] = useState<{
    sessionWith: string;
    sessionLimit: string | undefined;
    timeSlot: string;
    notes: string;
    date: undefined;
  }>({
    sessionWith: "",
    sessionLimit: undefined,
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
          const tutors = await getMyTutors(userData as StudentSchema);
          // const tutors = await getTutors();

          setMyTutors(tutors);
        } catch (error) {
          console.error("Error fetching Tutor Data:", error);
        }
      }
    }

    fetchStudentsTutors();
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!date) {
        setFormError("Please Select a Session Date");
        return;
      } else setFormError(null);

      if (user && userData && formData.sessionLimit) {
        setIsSubmitting(true);
        await createSession(
          formData.sessionWith, // tutorId
          user.uid, // studentId
          formData.sessionLimit, // sessionDuration
          formData.timeSlot.split("+")[0].trim(), // timeSlot
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
  };

  const formatTime = (timeStr: string) => {
    const [hourStr, minuteStr] = timeStr.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert 0 → 12

    return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
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
                        <p>{tutor.displayName}</p>
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
          {selectedTutor?.weeklySchedule &&
            selectedDay &&
            date &&
            formData.sessionLimit && (
              <div className="flex flex-col gap-2">
                <p className="font-medium text-sm">Pick Time Slot</p>

                <p className="font-semibold">{selectedDay}</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedTutor?.weeklySchedule?.[
                    date.getDay() - 1
                  ]?.timeRange.map((slot) => {
                    const start = new Date(`2000-01-01T${slot.from}`);
                    const end = new Date(`2000-01-01T${slot.to}`);
                    const sessionMinutes = (() => {
                      const match =
                        (formData.sessionLimit &&
                          formData.sessionLimit.match(/(\d+)\s*hour/)) ||
                        [];
                      const hour = parseInt(match[1]) || 0;

                      const minsMatch =
                        (formData.sessionLimit &&
                          formData.sessionLimit.match(/(\d+)\s*minutes/)) ||
                        [];
                      const minutes = parseInt(minsMatch[1]) || 0;

                      return hour * 60 + minutes;
                    })();
                    const intervals = [];

                    const startTime = new Date(`2000-01-01T${slot.from}`);
                    const endTime = new Date(`2000-01-01T${slot.to}`);

                    let current = new Date(startTime);

                    while (
                      current.getTime() + sessionMinutes * 60000 <=
                      endTime.getTime()
                    ) {
                      const next = new Date(
                        current.getTime() + sessionMinutes * 60000
                      );

                      intervals.push({
                        start: formatTime(current.toTimeString().slice(0, 5)),
                        end: formatTime(next.toTimeString().slice(0, 5)),
                        value: `${current.toTimeString().slice(0, 5)} + ${next
                          .toTimeString()
                          .slice(0, 5)}`,
                      });

                      // Increment the current time
                      current = next;
                    }

                    return intervals.map((interval, idx) => (
                      <div key={`${slot.id}-${idx}`} className="relative">
                        <input
                          onChange={(e) =>
                            handleChange("timeSlot", e.currentTarget.value)
                          }
                          required
                          type="radio"
                          name="slot"
                          id={`${slot.id}-${idx}`}
                          value={interval.value}
                          className="peer absolute opacity-0"
                        />
                        <label
                          htmlFor={`${slot.id}-${idx}`}
                          className="text-center block w-40 cursor-pointer border border-primary_green rounded-md px-3 py-1.5 text-primary_green font-medium peer-checked:bg-primary_green peer-checked:text-white"
                        >
                          {interval.start} - {interval.end}
                        </label>
                      </div>
                    ));
                  })}
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

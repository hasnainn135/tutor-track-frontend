import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import useAuthState from "@/states/AuthState";
import {
  getTutorById,
  getStudentById,
  updateSessionAttendance,
  timestampToDateOnly,
  cancelSession,
} from "@/utils/firestore";
import {
  FirestoreTimestamp,
  Session,
  StudentSchema,
  TutorSchema,
} from "@/types/firebase";

const SessionListItem = ({ session }: { session: Session }) => {
  const [tutor, setTutor] = useState<TutorSchema | null>(null);
  const [student, setStudent] = useState<StudentSchema | null>(null);
  const [sessionOngoing, setSessionOngoing] = useState<boolean>(false);
  const { user, userData } = useAuthState();

  //fetch Tutor or Student data
  useEffect(() => {
    const fetchTutor = async () => {
      setTutor(await getTutorById(session.tutorId));
    };
    const fetchStudent = async () => {
      setStudent(await getStudentById(session.studentId));
    };

    if (userData?.role === "tutor")
      fetchStudent(); // FETCH STD DATA TO DISPLAY IN LIST
    else if (userData?.role === "student") fetchTutor(); // FETCH TUTOR DATA TO DISPLAY IN LIST
  }, []);

  const parseTime = (timeString: string) => {
    // Remove spaces and extract hour, minute, and AM/PM
    const [time, period] = timeString.replace(/\s/g, "").split(/(am|pm)/i);
    const [hour, minute] = time.split(":").map(Number);
    let hours = hour;

    // Convert to 24-hour format
    if (period)
      if (period.toLowerCase() === "pm" && hour !== 12) {
        hours += 12;
      } else if (period.toLowerCase() === "am" && hour === 12) {
        hours = 0;
      }

    // Create today's date with extracted time
    const now = new Date();
    console.log(timeString);
    console.log(
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minute)
    );

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minute
    );
  };

  useEffect(() => {
    if (
      session.status === "incomplete" &&
      session.bookingStartTime &&
      session.sessionDate &&
      session.duration
    ) {
      const sessionDate = timestampToDateOnly(session.sessionDate) as Date;

      // --- Parse Start Time ---
      const [startHour, startMinute] = session.bookingStartTime
        .split(":")
        .map(Number);
      const sessionStart = new Date(sessionDate);
      sessionStart.setHours(startHour, startMinute, 0, 0);

      // --- Parse End Time ---
      const duration = session.duration.trim().toLowerCase(); // e.g. "09:00 pm"
      const [timePart, meridiem] = duration.split(" ");
      const [endHourRaw, endMinute] = timePart.split(":").map(Number);
      let endHour = endHourRaw;

      if (meridiem === "pm" && endHour !== 12) endHour += 12;
      if (meridiem === "am" && endHour === 12) endHour = 0;

      const sessionEnd = new Date(sessionDate);
      sessionEnd.setHours(endHour, endMinute, 0, 0);

      const now = new Date();

      // Determine if session is currently ongoing
      console.log(sessionStart);
      console.log(sessionDate);
      console.log(sessionEnd);
      console.log(now);
      // console.log("sessionDate", sessionDate);

      if (now >= sessionStart && now < sessionDate) {
        setSessionOngoing(true);

        const msUntilEnd = sessionDate.getTime() - now.getTime();
        const timeout = setTimeout(() => {
          setSessionOngoing(false);
        }, msUntilEnd);

        // Clean up timeout on unmount or session change
        return () => clearTimeout(timeout);
      } else {
        setSessionOngoing(false);
      }
    } else {
      setSessionOngoing(false);
    }
  }, [session]);

  const cancelCurrentSession = async () => {
    try {
      await cancelSession(session.id);
    } catch (e) {
      console.log(e);
      console.log(session.status);
    }
  };
  const markTutorAttendance = () => {
    console.log(session.isTutorAbsent);
  };
  const markStudentAttendance = () => {
    console.log(session.isStudentAbsent);
  };

  if (userData?.role === "student")
    return (
      <div
        className={`h-16 rounded-md border ${
          sessionOngoing ? "border-bright_green" : "border-light_gray"
        } bg-[#FBFBFB] overflow-hidden flex items-center`}
      >
        {/* LEFT COLORED BORDER */}
        <div
          className={`w-1 h-full ${
            session.status === "canceled"
              ? "bg-red"
              : timestampToDateOnly(session.sessionDate).toDateString() ===
                  new Date().toDateString() || sessionOngoing
              ? "bg-bright_green"
              : session.isTutorAbsent
              ? "bg-primary_green"
              : "bg-light_gray"
          }`}
        ></div>
        <div className="flex items-center justify-between px-2 py-3 w-full">
          <div className="flex items-center gap-6">
            {/* Tutor INFO */}
            <div className="flex items-center justify-start gap-2 w-48">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200">
                <img
                  src={tutor?.profilePicture ?? undefined}
                  alt=""
                  className="object-cover h-9"
                />
              </div>
              <div className="">
                <p>{tutor?.displayName}</p>
                {session.status === "completed" && session.isTutorAbsent && (
                  <p className="text-sm text-primary_green font-semibold">
                    Marked Absent
                  </p>
                )}
              </div>
            </div>
            {/* TIME */}
            <div className="w-28">
              <p className="text-sm">
                {(() => {
                  const sessionDate = timestampToDateOnly(session.sessionDate);
                  const today = new Date();
                  const tomorrow = new Date();
                  tomorrow.setDate(today.getDate() + 1); // Move one day ahead

                  if (sessionDate.toDateString() === today.toDateString()) {
                    return "Today at";
                  } else if (
                    sessionDate.toDateString() === tomorrow.toDateString()
                  ) {
                    return "Tomorrow at";
                  } else {
                    return `${sessionDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })} at`;
                  }
                })()}
              </p>
              <p className="text-lg font-semibold">
                {new Date(
                  `1970-01-01T${session.bookingStartTime}:00`
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
            {/* Session Limit */}
            <div className="">
              <p className="text-sm">Session Limit</p>
              <p
                className={`text-lg font-semibold ${
                  sessionOngoing && "text-bright_green"
                }`}
              >
                {session.status === "canceled" ? "-" : session.duration}
              </p>
            </div>
          </div>
          {session.status === "completed" ? (
            <Link href={`/student/sessions/${session.id}/notes`}>
              <Button variant="outline_green" size="sm">
                View Notes
              </Button>
            </Link>
          ) : sessionOngoing ? (
            <p className="text-bright_green font-semibold">Session Ongoing</p>
          ) : (
            ""
          )}
          <div className="">
            {session.status === "canceled" ? (
              <p className="text-red font-semibold px-4">Canceled</p>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="w-6 font-bold">
                  &#8285;
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className=" bg-white border-none"
                  align="end"
                >
                  {session.status === "completed" || sessionOngoing ? (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={markTutorAttendance}
                    >
                      {session.isTutorAbsent
                        ? "Mark Tutor Present"
                        : "Mark Tutor Absent"}
                    </DropdownMenuItem>
                  ) : session.status === "incomplete" ? (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={cancelCurrentSession}
                    >
                      Cancel Session
                    </DropdownMenuItem>
                  ) : (
                    <></>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    );

  const [showStartButton, setShowStartButton] = useState(false);

  // useEffect(() => {
  //   const checkTime = () => {
  //     const now = new Date();
  //     const sessionDate = new Date(session.createdAt);

  //     // Convert session_time ("12:00 PM") to 24-hour format
  //     const timeParts = session.createdAt.match(/(\d+):(\d+) (\w+)/);
  //     if (!timeParts) return;

  //     let hours = parseInt(timeParts[1]);
  //     const minutes = parseInt(timeParts[2]);
  //     const period = timeParts[3];

  //     if (period === "PM" && hours !== 12) hours += 12;
  //     if (period === "AM" && hours === 12) hours = 0;

  //     sessionDate.setHours(hours, minutes, 0, 0); // Set session time

  //     // Calculate time difference in minutes
  //     const timeDiff = (sessionDate.getTime() - now.getTime()) / 60000;

  //     // Show button if session time is in the next 10 minutes
  //     setShowStartButton(timeDiff <= 10 && timeDiff > 0);
  //   };

  //   // Check every minute
  //   checkTime();
  //   const interval = setInterval(checkTime, 60000);

  //   return () => clearInterval(interval); // Cleanup interval on unmount
  // }, [session]);

  if (userData?.role === "tutor")
    return (
      <div
        className={`h-16 rounded-md border ${
          sessionOngoing ? "border-bright_green" : "border-light_gray"
        } bg-[#FBFBFB] overflow-hidden flex items-center`}
      >
        {/* LEFT COLORED BORDER */}
        <div
          className={`w-1 h-full ${
            session.status === "canceled"
              ? "bg-red"
              : timestampToDateOnly(session.sessionDate).toDateString() ===
                  new Date().toDateString() || sessionOngoing
              ? "bg-bright_green"
              : session.isStudentAbsent
              ? "bg-primary_green"
              : "bg-light_gray"
          }`}
        ></div>
        <div className="flex items-center justify-between px-2 py-3 w-full">
          <div className="flex items-center gap-6">
            {/* student INFO */}
            <div className="flex items-center justify-start gap-2 w-48">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200">
                <img
                  src={student?.profilePicture ?? undefined}
                  alt=""
                  className="object-cover h-9"
                />
              </div>
              <div className="">
                <p>{student?.displayName}</p>
                {session.status === "completed" && session.isStudentAbsent && (
                  <p className="text-sm text-primary_green font-semibold">
                    Marked Absent
                  </p>
                )}
              </div>
            </div>
            {/* TIME */}
            <div className="w-28">
              <p className="text-sm">
                {(() => {
                  const sessionDate = timestampToDateOnly(session.sessionDate);
                  const today = new Date();
                  const tomorrow = new Date();
                  tomorrow.setDate(today.getDate() + 1); // Move one day ahead

                  if (sessionDate.toDateString() === today.toDateString()) {
                    return "Today at";
                  } else if (
                    sessionDate.toDateString() === tomorrow.toDateString()
                  ) {
                    return "Tomorrow at";
                  } else {
                    return `${sessionDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })} at`;
                  }
                })()}
              </p>
              <p className="text-lg font-semibold">
                {new Date(
                  `1970-01-01T${session.bookingStartTime}:00`
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
            {/* Session Limit */}
            <div className="">
              <p className="text-sm">Session Limit</p>
              <p
                className={`text-lg font-semibold ${
                  sessionOngoing && "text-bright_green"
                }`}
              >
                {session.status === "canceled" ? "-" : session.duration}
              </p>
            </div>
          </div>
          {session.status === "completed" ? (
            <Link href={`/tutor/sessions/${session.id}/notes`}>
              <Button variant="outline_green" size="sm">
                View Notes
              </Button>
            </Link>
          ) : session.status === "incomplete" &&
            timestampToDateOnly(session.sessionDate).toDateString() ===
              new Date().toDateString() &&
            showStartButton ? (
            <Link href={``}>
              <Button size="sm">Start Session</Button>
            </Link>
          ) : sessionOngoing ? (
            <p className="text-bright_green font-semibold">Session Ongoing</p>
          ) : null}
          <div className="">
            {session.status === "canceled" ? (
              <p className="text-red font-semibold px-4">Canceled</p>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="w-6 font-bold">
                  &#8285;
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className=" bg-white border-none"
                  align="end"
                >
                  {session.status === "completed" || sessionOngoing ? (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={markStudentAttendance}
                    >
                      {session.isStudentAbsent
                        ? "Mark Student Present"
                        : "Mark Student Absent"}
                    </DropdownMenuItem>
                  ) : session.status === "incomplete" ? (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={cancelCurrentSession}
                    >
                      Cancel Session
                    </DropdownMenuItem>
                  ) : (
                    <></>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    );
};

export default SessionListItem;

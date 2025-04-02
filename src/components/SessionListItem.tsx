import { useUsers } from "@/hooks/useUsers";
import { SessionsType, StudentType, TutorType } from "@/types/usertypes";
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

const SessionListItem = ({ session }: { session: SessionsType }) => {
  const [tutor, setTutor] = useState<TutorType | null>(null);
  const [student, setStudent] = useState<StudentType | null>(null);
  const { getTutorById, getStudentById, userType } = useUsers();

  //fetch Tutor or Student data
  useEffect(() => {
    const fetchTutor = async () => {
      setTutor(await getTutorById(session.tutor_id));
    };
    const fetchStudent = async () => {
      setStudent(await getStudentById(session.student_id));
    };

    if (userType === "tutor")
      fetchStudent(); // FETCH STD DATA TO DISPLAY IN LIST
    else if (userType === "student") fetchTutor(); // FETCH TUTOR DATA TO DISPLAY IN LIST
  }, []);

  const cancelSession = () => {
    console.log(session.status);
  };
  const markTutorAttendance = () => {
    console.log(session.tutor_absent);
  };
  const markStudentAttendance = () => {
    console.log(session.student_absent);
  };

  if (userType === "student")
    return (
      <div
        className={`h-16 rounded-md border ${
          session.status === "ongoing"
            ? "border-bright_green"
            : "border-light_gray"
        } bg-[#FBFBFB] overflow-hidden flex items-center`}
      >
        {/* LEFT COLORED BORDER */}
        <div
          className={`w-1 h-full ${
            session.status === "canceled"
              ? "bg-red"
              : new Date(session.session_date).toDateString() ===
                  new Date().toDateString() || session.status === "ongoing"
              ? "bg-bright_green"
              : session.tutor_absent
              ? "bg-primary_green"
              : "bg-light_gray"
          }`}
        ></div>
        <div className="flex items-center justify-between px-2 py-3 w-full">
          <div className="flex items-center gap-6">
            {/* Tutor INFO */}
            <div className="flex items-center justify-start gap-2 w-48">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200">
                <img src={tutor?.pfp} alt="" className="object-cover h-9" />
              </div>
              <div className="">
                <p>{tutor?.name}</p>
                {session.status === "completed" && session.tutor_absent && (
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
                  const sessionDate = new Date(session.session_date);
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
              <p className="text-lg font-semibold">{session.session_time}</p>
            </div>
            {/* Session Limit */}
            <div className="w-28">
              <p className="text-sm">Session Limit</p>
              <p
                className={`text-lg font-semibold ${
                  session.status === "ongoing" && "text-bright_green"
                }`}
              >
                {session.status === "canceled" ? "-" : session.session_limit}
              </p>
            </div>
          </div>
          {session.status === "completed" ? (
            <Link href={`/student/sessions/${session.id}/notes`}>
              <Button variant="outline_green" size="sm">
                View Notes
              </Button>
            </Link>
          ) : session.status === "ongoing" ? (
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
                  {session.status === "completed" ||
                  session.status === "ongoing" ? (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={markTutorAttendance}
                    >
                      {session.tutor_absent
                        ? "Mark Tutor Present"
                        : "Mark Tutor Absent"}
                    </DropdownMenuItem>
                  ) : session.status === "upcoming" ? (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={cancelSession}
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

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const sessionDate = new Date(session.session_date);

      // Convert session_time ("12:00 PM") to 24-hour format
      const timeParts = session.session_time.match(/(\d+):(\d+) (\w+)/);
      if (!timeParts) return;

      let hours = parseInt(timeParts[1]);
      const minutes = parseInt(timeParts[2]);
      const period = timeParts[3];

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      sessionDate.setHours(hours, minutes, 0, 0); // Set session time

      // Calculate time difference in minutes
      const timeDiff = (sessionDate.getTime() - now.getTime()) / 60000;

      // Show button if session time is in the next 10 minutes
      setShowStartButton(timeDiff <= 10 && timeDiff > 0);
    };

    // Check every minute
    checkTime();
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [session]);

  if (userType === "tutor")
    return (
      <div
        className={`h-16 rounded-md border ${
          session.status === "ongoing"
            ? "border-bright_green"
            : "border-light_gray"
        } bg-[#FBFBFB] overflow-hidden flex items-center`}
      >
        {/* LEFT COLORED BORDER */}
        <div
          className={`w-1 h-full ${
            session.status === "canceled"
              ? "bg-red"
              : new Date(session.session_date).toDateString() ===
                  new Date().toDateString() || session.status === "ongoing"
              ? "bg-bright_green"
              : session.student_absent
              ? "bg-primary_green"
              : "bg-light_gray"
          }`}
        ></div>
        <div className="flex items-center justify-between px-2 py-3 w-full">
          <div className="flex items-center gap-6">
            {/* student INFO */}
            <div className="flex items-center justify-start gap-2 w-48">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200">
                <img src={student?.pfp} alt="" className="object-cover h-9" />
              </div>
              <div className="">
                <p>{student?.name}</p>
                {session.status === "completed" && session.student_absent && (
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
                  const sessionDate = new Date(session.session_date);
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
              <p className="text-lg font-semibold">{session.session_time}</p>
            </div>
            {/* Session Limit */}
            <div className="w-28">
              <p className="text-sm">Session Limit</p>
              <p
                className={`text-lg font-semibold ${
                  session.status === "ongoing" && "text-bright_green"
                }`}
              >
                {session.status === "canceled" ? "-" : session.session_limit}
              </p>
            </div>
          </div>
          {session.status === "completed" ? (
            <Link href={`/tutor/sessions/${session.id}/notes`}>
              <Button variant="outline_green" size="sm">
                View Notes
              </Button>
            </Link>
          ) : session.status === "upcoming" &&
            new Date(session.session_date).toDateString() ===
              new Date().toDateString() &&
            showStartButton ? (
            <Link href={``}>
              <Button size="sm">Start Session</Button>
            </Link>
          ) : session.status === "ongoing" ? (
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
                  {session.status === "completed" ||
                  session.status === "ongoing" ? (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={markStudentAttendance}
                    >
                      {session.student_absent
                        ? "Mark Student Present"
                        : "Mark Student Absent"}
                    </DropdownMenuItem>
                  ) : session.status === "upcoming" ? (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={cancelSession}
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

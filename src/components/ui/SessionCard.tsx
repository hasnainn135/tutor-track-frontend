import useAuthState from "@/states/AuthState";
import { Session, StudentSchema, TutorSchema } from "@/types/firebase";
import {
  getStudentById,
  getTutorById,
  timestampToDateOnly,
} from "@/utils/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./button";

const SessionCard = ({
  session,
  index,
}: {
  session: Session;
  index?: number;
}) => {
  const [tutor, setTutor] = useState<TutorSchema | null>(null);
  const [student, setStudent] = useState<StudentSchema | null>(null);
  const [showStartButton, setShowStartButton] = useState(false);

  const { user, userData } = useAuthState();

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

  // Enable Strt btn for tutor
  useEffect(() => {
    const today = new Date();
    const sessionDate = timestampToDateOnly(session.sessionDate);

    const todayString = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });

    const sessionDateString = sessionDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });

    if (todayString === sessionDateString) {
      // Now check the time
      const [sessionHour, sessionMinute] = session.bookingStartTime
        .split(":")
        .map(Number);

      const sessionTimeInMinutes = sessionHour * 60 + sessionMinute;
      const currentTimeInMinutes = today.getHours() * 60 + today.getMinutes();

      if (currentTimeInMinutes >= sessionTimeInMinutes && !session.end) {
        setShowStartButton(true);
      } else {
        setShowStartButton(false); // hide if not yet
      }
    } else {
      setShowStartButton(false); // hide if different date
    }
  }, []);

  if (userData)
    return (
      <div className=" border border-light_gray rounded-lg bg-white overflow-hidden ">
        <div
          className={`w-full h-2 ${
            session.status === "canceled"
              ? "bg-red"
              : timestampToDateOnly(session.sessionDate).toDateString() ===
                new Date().toDateString()
              ? "bg-bright_green"
              : session.isStudentAbsent
              ? "bg-primary_green"
              : "bg-light_gray"
          }`}
        ></div>
        {/* ${
          index === 0 ? "bg-bright_green" : "bg-light_gray"
        }  */}
        <div className="p-4 flex flex-col gap-4">
          <div className="">
            {/* <p className="text-sm mb-2">
            {index === 0 ? "Next Session with" : "Session with"}
          </p> */}
            {userData?.role === "student" ? (
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
                </div>
              </div>
            ) : (
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
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="">
              <p className="font-semibold">
                {new Date(
                  `1970-01-01T${session.bookingStartTime}:00`
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>

              <p>
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
                      month: "short",
                      day: "numeric",
                    })} at`;
                  }
                })()}
              </p>
            </div>
            <div className="text-right">
              <p>Session Limit</p>
              <p className="font-semibold">{session.duration}</p>
            </div>
          </div>
          {userData?.role === "tutor" && showStartButton && !session.start ? (
            <Link
              className="w-full"
              href={`/tutor/sessions/${session.id}/tracking`}
            >
              <Button size="sm" className="w-full">
                Start Session
              </Button>
            </Link>
          ) : session.start ? (
            <Link
              href={`/${
                userData.role === "student" ? "student" : "tutor"
              }/sessions/${session.id}/tracking`}
              className=""
            >
              <Button variant={"outline_green"} className="w-full">
                Session Ongoing
              </Button>
            </Link>
          ) : session.status === "completed" ? (
            <Link
              href={`/${
                userData.role === "student" ? "student" : "tutor"
              }/sessions/${session.id}/notes`}
            >
              <Button className="w-full" variant="outline_green" size="sm">
                View Notes
              </Button>
            </Link>
          ) : (
            <div className="h-9"></div>
          )}
        </div>
      </div>
    );
};

export default SessionCard;

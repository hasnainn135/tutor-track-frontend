import { Button } from "@/components/ui/button";
import ContainerLayout from "@/pages/layouts/ContainerLayout";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Timer from "@/components/Timer";
import { IoMdAdd } from "react-icons/io";
import {
  Session,
  SessionNotes,
  StudentSchema,
  TutorSchema,
} from "@/types/firebase";
import useAuthState from "@/states/AuthState";
import {
  addSessionNote,
  completeSession,
  endSessionInFirestore,
  getSessionById,
  getSessionNotes,
  getStudentById,
  getTutorById,
  listenToSessionChanges,
  parseDuration,
  pauseSessionInFirestore,
  resumeSessionInFirestore,
  setAutoEndSession,
  startSessionInFirestore,
} from "@/utils/firestore";
import useTimerState from "@/states/TimerState";
import Image from "next/image";
import pfp2 from "@/assets/pfp2.png";
import { ca } from "date-fns/locale";
import Link from "next/link";
import { IoChevronBackSharp } from "react-icons/io5";
import { Timestamp } from "firebase/firestore";

const TutorTracking: FC = () => {
  const [autoEnd, setAutoEnd] = useState<boolean>(true);
  const [note, setNote] = useState<string>();
  const [noteList, setNoteList] = useState<SessionNotes[]>([]);
  const [count, setCount] = useState(0);
  const [session, setSession] = useState<Session | null>(null);
  const [tutor, setTutor] = useState<TutorSchema>();
  const [student, setStudent] = useState<StudentSchema>();

  const [disableStartButton, setDisableStartButton] = useState<boolean>(false);
  const [disableStatus, setDisableStatus] = useState<string | null>(null);
  const [wait, setWait] = useState<number>(30);

  const { userData } = useAuthState();
  const {
    time,
    isRunning,
    paused,
    startTimer,
    stopTimer,
    resetTimer,
    pauseTimer,
    resumeTimer,
    setSessionId,
  } = useTimerState();

  const router = useRouter();
  const { "session-id": sessionId } = router.query;

  useEffect(() => {
    const getSessionData = async () => {
      try {
        if (!sessionId) return;
        const session = await getSessionById(sessionId as string);
        if (session) {
          setSession(session);
          setSessionId(sessionId as string);
          setAutoEnd(session.autoEnd);
          const tutor = await getTutorById(session.tutorId);
          setTutor(tutor);
          const std = await getStudentById(session.studentId);
          setStudent(std);
        }
      } catch (e) {
        console.log("error", e);
      }
    };
    const fetchNotes = async () => {
      if (!sessionId) return;

      const notes = await getSessionNotes(sessionId as string);
      setNoteList(notes);
    };
    getSessionData();

    fetchNotes();
  }, [sessionId]);

  const handleStartStopSession = async () => {
    if (sessionId)
      if (!isRunning) {
        if (!autoEnd) await setAutoEndSession(sessionId as string, autoEnd); //by default autoEnd is true in firebase at the time of session creation
        await startSessionInFirestore(sessionId as string);
        startTimer();

        // AUTO END SESSION
        if (autoEnd) {
          setTimeout(async () => {
            await endSessionInFirestore(sessionId as string);
            await completeSession(sessionId as string);
            stopTimer();
            resetTimer();
            setCount(0);
            window.location.reload();
          }, parseDuration(session?.duration as string) * 1000 * 60);
        }
      } else {
        try {
          await endSessionInFirestore(sessionId as string);
          await completeSession(sessionId as string);
        } catch (e) {
          console.error("error", e);
        } finally {
          stopTimer();
          resetTimer();
          setCount(0);
          window.location.reload();
        }
      }
  };

  const handlePauseResume = async () => {
    if (!paused) {
      pauseTimer();
      if (session) await pauseSessionInFirestore(session.id);
    } else {
      resumeTimer();
      if (session) await resumeSessionInFirestore(session.id);
    }
  };

  const addNote = async () => {
    if (note && userData && session?.tutorId) {
      await addSessionNote(
        sessionId as string,
        userData.uid,
        session?.tutorId,
        note
      );
      const notes = await getSessionNotes(sessionId as string);

      setNoteList(notes);
      setNote("");
    }
  };

  if (session?.end)
    return (
      <ContainerLayout>
        <div className="h-96 flex flex-col gap-3 items-center justify-center px-4 text-center">
          <p className="text-lg">
            This Session has ended on{" "}
            <span className="font-semibold">
              {new Date(session.actualEndTime as string).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                }
              )}
            </span>{" "}
            at{" "}
            <span className="font-semibold">
              {new Date(session.actualEndTime as string).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </span>
          </p>
          <div className="flex items-center  sm:flex-nowrap flex-wrap justify-center">
            <Link href={`/tutor/sessions/${session.id}/notes`} className="">
              <Button
                variant={"outline_green"}
                className="hover:text-primary_green"
              >
                View Session Notes
              </Button>
            </Link>
            <Link href={`/tutor/sessions`} className="">
              <Button variant={"link"} className="hover:text-primary_green">
                <div className="flex items-center gap-1 ">
                  <IoChevronBackSharp className="size-3 mt-0.5" />
                  Back to Sessions
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </ContainerLayout>
    );

  if (session)
    return (
      <div className="flex flex-col h-full gap-3">
        {/* TIMER */}
        <ContainerLayout heading="Ongoing Session">
          <div className="flex flex-col items-center gap-3 w-fit mx-auto">
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm">Session Duration</p>
              <Select
                disabled={isRunning}
                value={autoEnd ? "auto" : "manual"}
                onValueChange={(value) => setAutoEnd(value === "auto")}
              >
                <SelectTrigger className="w-[200px] border border-primary_green text-center flex justify-center items-center text-primary_green font-medium text-md gap-2">
                  <SelectValue placeholder="Select Timer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">{session?.duration}</SelectItem>
                  <SelectItem value="manual">Manual Timer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className=" flex md:flex-row flex-col-reverse items-center md:gap-3 gap-6">
              <div className=" w-40 flex items-center justify-end">
                <Button
                  variant={"outline_green"}
                  className="text-md"
                  // disabled={!isRunning} // not disabled if paused
                  onClick={handlePauseResume}
                >
                  {!paused ? (
                    <>
                      <IoMdPause />
                      Pause Session
                    </>
                  ) : (
                    <>
                      <IoMdPlay />
                      Resume Session
                    </>
                  )}
                </Button>
              </div>
              <div className="relative">
                {disableStartButton && (
                  <div
                    className=" z-10 w-full h-full absolute rounded-full"
                    onClick={() => {
                      if (disableStartButton)
                        setDisableStatus(`Wait ${wait}s before Ending Session`);
                    }}
                  ></div>
                )}
                <button
                  onClick={() => {
                    handleStartStopSession();
                  }}
                  className="md:w-52 md:h-52 w-44 h-44 border-2 border-primary_green bg-light_green rounded-full text-xl font-semibold text-primary_green disabled:opacity-60"
                  disabled={
                    disableStartButton || (!isRunning && paused && autoEnd)
                  }
                >
                  {isRunning && !paused ? "End Session" : "Start Session"}
                </button>
              </div>
              <div className="flex items-center justify-start gap-2 w-40">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                  <Image
                    src={student?.profilePicture ?? pfp2}
                    alt=""
                    className="object-cover h-12"
                  />
                </div>
                <div className="text-lg">
                  <p>{student?.displayName}</p>
                </div>
              </div>
            </div>
            {disableStatus && (
              <p className="text-xs text-red font-medium">{disableStatus}</p>
            )}
            <div className="">
              <Timer />
            </div>
          </div>
        </ContainerLayout>
        <ContainerLayout heading="Notes">
          <div className="flex gap-3 items-center justify-between">
            <textarea
              value={note}
              onChange={(e) => setNote(e.currentTarget.value)}
              placeholder="Write Note"
              rows={1}
              className="resize-none border border-light_gray p-2 w-full rounded-md"
            ></textarea>
            <button
              className="grid place-content-center bg-primary_green text-white rounded-md flex-shrink-0 w-8 h-8"
              onClick={addNote}
            >
              <IoMdAdd className="size-5" />
            </button>
          </div>
          <div className="">
            {noteList
              ?.sort(
                (a, b) =>
                  (b.timestamp as Timestamp).toMillis() -
                  (a.timestamp as Timestamp).toMillis()
              )
              .map((note) => {
                return (
                  <div
                    key={note.id}
                    className={`flex items-center py-2 text-sm gap-3  ${
                      userData?.uid === note.receiverId
                        ? "flex-row-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-slate-200`}
                    >
                      <Image
                        src={
                          userData?.uid === tutor?.uid
                            ? tutor?.profilePicture ?? pfp2
                            : student?.profilePicture ?? pfp2
                        }
                        alt=""
                        className="object-cover h-8"
                      />
                    </div>
                    <p
                      className={`w-full  ${
                        userData?.uid === note.receiverId ? "text-right" : ""
                      }`}
                    >
                      {note.content}
                    </p>
                    <p className="text-xs flex-shrink-0 text-gray-400">
                      {(note.timestamp as Timestamp)
                        .toDate()
                        .toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                    </p>
                  </div>
                );
              })}
          </div>
        </ContainerLayout>
      </div>
    );
};

export default TutorTracking;

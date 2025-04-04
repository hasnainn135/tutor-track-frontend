import LoadingSpinner from "@/components/ui/loading-spinner";
// import { useUsers } from "@/hooks/useUsers";
import ContainerLayout from "@/pages/layouts/ContainerLayout";
import useAuthState from "@/states/AuthState";
import {
  Session,
  SessionNotes,
  StudentSchema,
  TutorSchema,
} from "@/types/firebase";
import {
  getSessionById,
  getSessionNotes,
  getStudentById,
  getTutorById,
  timestampToDateOnly,
} from "@/utils/firestore";
import Image from "next/image";
// import { Notes, SessionsType, StudentType, TutorType } from "@/types/usertypes";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import pfp2 from "@/assets/pfp2.png";
import { Timestamp } from "firebase/firestore";

const TutorNotes: FC = () => {
  const router = useRouter();
  const { "session-id": sessionId } = router.query;
  // const { loggedInTutor, getStudentById, loading } = useUsers();

  const [session, setSession] = useState<Session | undefined>(undefined);
  const [sessionLoading, setSessionLoading] = useState<boolean>(false);
  const [sessionNotFound, setSessionNotFound] = useState<boolean>(false);
  const [student, setStudent] = useState<StudentSchema | undefined>(undefined);
  const [tutor, setTutor] = useState<TutorSchema | undefined>(undefined);
  const [notes, setNotes] = useState<SessionNotes[]>([]);
  const { userData } = useAuthState();

  useEffect(() => {
    const getSessionData = async () => {
      try {
        if (!sessionId) return;

        const sessionData = await getSessionById(sessionId as string);
        if (sessionData) {
          setSession(sessionData);
          const studentData = await getStudentById(sessionData.studentId);
          studentData && setStudent(studentData);
          const tutorData = await getTutorById(sessionData.tutorId);
          tutorData && setTutor(tutorData);
        }
      } catch (e) {
        console.log("error", e);
      }
    };

    const fetchNotes = async () => {
      if (!sessionId) return;

      const notes = await getSessionNotes(sessionId as string);
      setNotes(notes);
    };

    getSessionData();
    fetchNotes();
  }, [sessionId]);

  if (sessionLoading)
    return (
      <div className="mx-auto h-full grid place-content-center">
        <LoadingSpinner />
      </div>
    );

  if (sessionNotFound) return <div className="">Session Not Found</div>;

  if (session && userData)
    return (
      <ContainerLayout heading="Session Notes">
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center justify-start gap-2 font-semibold">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
              <Image
                src={student?.profilePicture ?? pfp2}
                alt=""
                className="object-cover h-8 "
              />
            </div>
            <p>{student?.displayName}</p>
          </div>
          <div className="">
            {timestampToDateOnly(session.sessionDate).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </div>
          <div className="">
            Start Time:{" "}
            <span className="font-semibold">{session.bookingStartTime}</span>
          </div>
          <div className="">
            Session Duration:{" "}
            <span className="font-semibold">{session.duration}</span>
          </div>
        </div>
        <hr className="mt-3 opacity-20" />
        {/* NOTES */}
        <div className="pt-3">
          {notes.length > 0 ? (
            notes
              ?.sort(
                (a, b) =>
                  (b.timestamp as Timestamp).toMillis() -
                  (a.timestamp as Timestamp).toMillis()
              )
              .map((note: SessionNotes) => {
                return (
                  <div
                    key={note.id}
                    className={`flex py-2 text-sm gap-3  ${
                      note.senderId === userData.uid ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-slate-200`}
                    >
                      <Image
                        src={
                          note.senderId === userData.uid
                            ? tutor?.profilePicture ?? pfp2
                            : student?.profilePicture ?? pfp2
                        }
                        alt=""
                        className="object-cover h-8"
                      />
                    </div>
                    <p
                      className={`w-full  ${
                        note.senderId === userData.uid ? "text-right" : ""
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
              })
          ) : (
            <div>No Notes Added</div>
          )}
        </div>
      </ContainerLayout>
    );
};

export default TutorNotes;

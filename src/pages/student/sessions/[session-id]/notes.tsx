import LoadingSpinner from "@/components/ui/loading-spinner";
// import { useUsers } from "@/hooks/useUsers";
import ContainerLayout from "@/pages/layouts/ContainerLayout";
import { Session, SessionNotes, TutorSchema } from "@/types/firebase";
// import { Notes, SessionsType, TutorType } from "@/types/usertypes";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";

const StudentNotes: FC = () => {
  const router = useRouter();
  const { "session-id": sessionId } = router.query;
  // const { loggedInStudent, getTutorById, loading } = useUsers();

  const [session, setSession] = useState<Session | undefined>(undefined);
  const [sessionLoading, setSessionLoading] = useState<boolean>(false);
  const [sessionNotFound, setSessionNotFound] = useState<boolean>(false);
  const [tutor, setTutor] = useState<TutorSchema | undefined>(undefined);

  // GET SESSION DATA
  // useEffect(() => {
  //   const getSession = async () => {
  //     setSessionLoading(true);
  //     try {
  //       const response = await fetch("/sessions.json");
  //       if (!response.ok) {
  //         throw new Error("Failed to load data");
  //       }
  //       const allSessions: Session[] = await response.json();

  //       const sessionData: Session | undefined = allSessions.find(
  //         (session) => session.id === sessionId
  //       );

  //       setSession(sessionData);
  //     } catch (e) {
  //       setSessionNotFound(true);
  //     } finally {
  //       setSessionLoading(false);
  //     }
  //   };

  //   if (loggedInStudent && sessionId) getSession();
  // }, [sessionId, loggedInStudent]);

  // GET TUTOR DATA
  // useEffect(() => {
  //   const getTutor = async () => {
  //     if (session) {
  //       const tutorData = await getTutorById(session.tutor_id);
  //       if (tutorData) setTutor(tutorData);
  //     }
  //   };

  //   getTutor();
  // }, [session]);

  if (sessionLoading)
    return (
      <div className="mx-auto h-full grid place-content-center">
        <LoadingSpinner />
      </div>
    );

  if (sessionNotFound) return <div className="">Session Not Found</div>;

  if (session)
    return (
      <ContainerLayout heading="Session Notes">
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center justify-start gap-2 font-semibold">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
              <img
                src={tutor?.profilePicture ?? undefined}
                alt=""
                className="object-cover h-8"
              />
            </div>
            <p>{tutor?.displayName}</p>
          </div>
          <div className="">
            {new Date(session.sessionDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="">{session.bookingStartTime}</div>
        </div>
        {/* NOTES */}
        <div className="pt-3">
          {session.sessionNotes ? (
            session.sessionNotes.map((note: SessionNotes) => {
              return (
                <div
                  key={note.id}
                  className={`flex items-center py-2 text-sm gap-3  ${
                    // note.sender_type === "student" ? "flex-row-reverse" : ""
                    ""
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-slate-200`}
                  >
                    <img
                      src={
                        // note.sender_type === "tutor"
                        //   ? tutor?.pfp
                        //   : loggedInStudent?.pfp
                        ""
                      }
                      alt=""
                      className="object-cover h-8"
                    />
                  </div>
                  <p
                    className={`w-full  ${
                      // note.sender_type === "student" ? "text-right" : ""
                      ""
                    }`}
                  >
                    {note.content}
                  </p>
                  <p className="text-xs flex-shrink-0 text-gray-400">
                    {/* {note.time} */}
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

export default StudentNotes;

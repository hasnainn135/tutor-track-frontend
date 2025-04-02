import LoadingSpinner from "@/components/ui/loading-spinner";
import { useUsers } from "@/hooks/useUsers";
import ContainerLayout from "@/pages/layouts/ContainerLayout";
import { Notes, SessionsType, StudentType, TutorType } from "@/types/usertypes";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";

const TutorNotes: FC = () => {
  const router = useRouter();
  const { "session-id": sessionId } = router.query;
  const { loggedInTutor, getStudentById, loading } = useUsers();

  const [session, setSession] = useState<SessionsType | undefined>(undefined);
  const [sessionLoading, setSessionLoading] = useState<boolean>(false);
  const [sessionNotFound, setSessionNotFound] = useState<boolean>(false);
  const [student, setStudent] = useState<StudentType | undefined>(undefined);

  // GET SESSION DATA
  useEffect(() => {
    const getSession = async () => {
      setSessionLoading(true);
      try {
        const response = await fetch("/sessions.json");
        if (!response.ok) {
          throw new Error("Failed to load data");
        }
        const allSessions: SessionsType[] = await response.json();

        const sessionData: SessionsType | undefined = allSessions.find(
          (session) => session.id === sessionId
        );

        setSession(sessionData);
      } catch (e) {
        setSessionNotFound(true);
      } finally {
        setSessionLoading(false);
      }
    };

    if (loggedInTutor && sessionId) getSession();
  }, [sessionId, loggedInTutor]);

  // GET STD DATA
  useEffect(() => {
    const getStudent = async () => {
      if (session) {
        const stdData = await getStudentById(session.student_id);
        if (stdData) setStudent(stdData);
      }
    };

    getStudent();
  }, [session]);

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
              <img src={student?.pfp} alt="" className="object-cover h-8 " />
            </div>
            <p>{student?.name}</p>
          </div>
          <div className="">
            {new Date(session.session_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="">{session.session_time}</div>
        </div>
        {/* NOTES */}
        <div className="pt-3">
          {session.notes ? (
            session.notes.map((note: Notes) => {
              return (
                <div
                  key={note.id}
                  className={`flex items-center py-2 text-sm gap-3  ${
                    note.sender_type === "tutor" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-slate-200`}
                  >
                    <img
                      src={
                        note.sender_type === "student"
                          ? student?.pfp
                          : loggedInTutor?.pfp
                      }
                      alt=""
                      className="object-cover h-8"
                    />
                  </div>
                  <p
                    className={`w-full  ${
                      note.sender_type === "tutor" ? "text-right" : ""
                    }`}
                  >
                    {note.content}
                  </p>
                  <p className="text-xs flex-shrink-0 text-gray-400">
                    {note.time}
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

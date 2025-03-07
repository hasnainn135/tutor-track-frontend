import LoadingSpinner from "@/components/ui/loading-spinner";
import { useUsers } from "@/hooks/useUsers";
import ContainerLayout from "@/pages/layouts/ContainerLayout";
import { SessionsType, TutorType } from "@/types/usertypes";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";

const StudentNotes: FC = () => {
  const router = useRouter();
  const { "session-id": sessionId } = router.query;
  const { loggedInStudent, getTutorById, loading } = useUsers();

  const [session, setSession] = useState<SessionsType | undefined>(undefined);
  const [tutor, setTutor] = useState<TutorType | undefined>(undefined);

  //GET SESSION DATA
  useEffect(() => {
    if (loggedInStudent && sessionId) {
      const foundSession = loggedInStudent.sessions?.find(
        (s) => s.id === sessionId
      );

      if (foundSession) {
        setSession(foundSession);
      } else {
        console.error("Session not found");
      }
    }
  }, [sessionId, loggedInStudent]);

  //GET TUTOR DATA
  useEffect(() => {
    const getTutor = async () => {
      if (session) {
        const tutorData = await getTutorById(session.tutor_id);
        if (tutorData) setTutor(tutorData);
      }
    };

    getTutor();
  }, [session]);

  if (loading)
    return (
      <div className="mx-auto h-full grid place-content-center">
        <LoadingSpinner />
      </div>
    );

  if (session)
    return (
      <ContainerLayout heading="Session Notes">
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center justify-start gap-2 font-semibold">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
              <img src={tutor?.pfp} alt="" className="object-cover w-full" />
            </div>
            <p>{tutor?.name}</p>
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
            session.notes.map((note) => {
              return (
                <div
                  key={note.id}
                  className={`flex items-center py-2 text-sm gap-3  ${
                    note.sender_type === "student" ? "flex-row-reverse" : ""
                  }`}>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-slate-200`}>
                    <img
                      src={
                        note.sender_type === "tutor"
                          ? tutor?.pfp
                          : loggedInStudent?.pfp
                      }
                      alt=""
                      className="object-cover h-8"
                    />
                  </div>
                  <p
                    className={`w-full  ${
                      note.sender_type === "student" ? "text-right" : ""
                    }`}>
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

  if (!session) return <div className="">Session Not Found</div>;
};

export default StudentNotes;

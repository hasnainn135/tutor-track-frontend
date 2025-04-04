import React, { FC, useEffect, useState } from "react";
import ContainerLayout from "../layouts/ContainerLayout";
import useAuthState from "@/states/AuthState";
import { Session, StudentSchema, TutorSchema } from "@/types/firebase";
import { getMyTutors, getSessions, parseDuration } from "@/utils/firestore";
import SessionCard from "@/components/ui/SessionCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const todaysDate = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "2-digit",
});

const Dashboard: FC = () => {
  const { userData } = useAuthState();
  const studentData = userData as StudentSchema;
  const [totalSessionsUpcoming, setTotalSessionsUpcoming] = useState<Session[]>(
    []
  );
  const [totalSessionsCompleted, setTotalSessionsCompleted] = useState<
    Session[]
  >([]);
  const [myTutors, setMyTutors] = useState<TutorSchema[]>([]);

  const [tutorSessionCounts, setTutorSessionCounts] = useState<
    Record<string, number>
  >({});
  const [tutorTotalMinutes, setTutorTotalMinutes] = useState<
    Record<string, number>
  >({});
  const [tutorAvgMinutes, setTutorAvgMinutes] = useState<
    Record<string, number>
  >({});

  const formatMinutesToHours = (minutes: number): string => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  useEffect(() => {
    const getTotalSessionsAndTutors = async () => {
      try {
        const sessions = await getSessions(studentData?.uid, "student");
        const tutors = await getMyTutors(studentData);

        const completedSessions = sessions.filter(
          (s) => s.status === "completed"
        );
        // setTotalSessionsCompleted(completedSessions);
        setMyTutors(tutors);

        const sessionCounts: Record<string, number> = {};
        const totalMinutesMap: Record<string, number> = {};

        for (const session of completedSessions) {
          const tutorId = session.tutorId;
          const duration = parseDuration(session.duration); // returns minutes

          sessionCounts[tutorId] = (sessionCounts[tutorId] || 0) + 1;
          totalMinutesMap[tutorId] = (totalMinutesMap[tutorId] || 0) + duration;
        }

        const avgTimeMap: Record<string, number> = {};
        Object.keys(sessionCounts).forEach((tutorId) => {
          const total = totalMinutesMap[tutorId];
          const count = sessionCounts[tutorId];
          avgTimeMap[tutorId] = Math.round(total / count); // avg in minutes
        });

        setTutorSessionCounts(sessionCounts);
        setTutorTotalMinutes(totalMinutesMap);
        setTutorAvgMinutes(avgTimeMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const gettotalSessions = async () => {
      try {
        const sessions = await getSessions(studentData?.uid, "student");
        const upcomingSeesions = [...totalSessionsUpcoming];
        const completedSeesions = [...totalSessionsCompleted];
        sessions.map((session) => {
          if (session.status === "completed") completedSeesions.push(session);
          if (session.status === "incomplete") {
            upcomingSeesions.push(session);
          }
        });
        setTotalSessionsCompleted(completedSeesions);
        setTotalSessionsUpcoming(upcomingSeesions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    gettotalSessions();
    getTotalSessionsAndTutors();
  }, []);

  if (studentData)
    return (
      <div className="h-full flex-col flex gap-3 w-full flex-grow-0">
        <ContainerLayout>
          <div className="w-[415px] h-[415px] opacity-30 blur-3xl rounded-full bg-primary_green absolute -top-1/2 right-0"></div>
          <div className="w-[415px] h-[415px] opacity-30 blur-3xl rounded-full bg-primary_green absolute -top-1/2 -left-40"></div>
          <div className="md:flex-nowrap md:flex-row flex-col-reverse flex-wrap flex gap-6 md:items-center justify-between overflow-hidden">
            <div className=" w-full flex flex-col md:gap-28 gap-6">
              <p>{todaysDate}</p>
              <div className="">
                <p>Welcome back</p>
                <p className="text-primary_green font-bold text-2xl">
                  {studentData.displayName}
                </p>
                <p className=" text-sm">
                  Let's embark on a new learning adventure today!
                </p>
              </div>
            </div>
            <div className=" flex flex-col gap-3 w-full">
              <div className="w-full  flex gap-3">
                <div className="w-full bg-white opacity-80 backdrop-blur-xl rounded-xl text-center py-5 px-4">
                  <p className="text-xl font-bold text-primary_green">
                    {totalSessionsCompleted.length}
                  </p>
                  <p>Completed Sessions</p>
                </div>
                <div className="w-full  bg-white opacity-80 backdrop-blur-xl rounded-xl text-center py-5 px-4">
                  <p className="text-xl font-bold text-primary_green">
                    {totalSessionsUpcoming.length}
                  </p>
                  <p>Upcoming Session</p>
                </div>
              </div>
              <div className="w-full bg-white opacity-80 backdrop-blur-xl rounded-xl text-center py-5 px-4">
                <p className="text-xl font-bold text-primary_green">
                  {myTutors.length}
                </p>
                <p>Active Tutors</p>
              </div>
            </div>
          </div>
        </ContainerLayout>
        <ContainerLayout heading="Upcoming Sessions">
          <div className="w-full overflow-x-scroll">
            <div className=" flex items-center  max-w-[100px]  gap-3 py-3">
              {totalSessionsUpcoming.length > 0 ? (
                totalSessionsUpcoming.map((session, i) => (
                  <div className="min-w-72" key={session.id}>
                    <SessionCard session={session} index={i} />
                  </div>
                ))
              ) : (
                <p>No Upcoming Session</p>
              )}
            </div>
          </div>
        </ContainerLayout>
        <ContainerLayout>
          <div className="w-full flex justify-between items-center px-3">
            <h2 className="font-semibold text-lg sm:text-xl ">Your Tutors</h2>
            <Link href={"/student/add-tutor"} className="">
              <Button variant={"outline_green"} className="w-full">
                Add Tutor
              </Button>
            </Link>
          </div>
          <div className="flex overflow-x-scroll items-center w-full gap-3 py-3">
            {myTutors.map((tutor) => (
              <div
                key={tutor.uid}
                className="w-52 h-72 flex-shrink-0 border flex-col flex justify-between border-light_gray rounded-lg bg-white overflow-hidden py-4"
              >
                <div className="w-full  text-center">
                  <div className="mx-auto w-9 h-9 rounded-full overflow-hidden bg-slate-200">
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
                <div className="">
                  <div className="flex items-center p-3 justify-between ">
                    <p>Total Session</p>
                    <p>{tutorSessionCounts[tutor.uid] ?? 0}</p>
                  </div>
                  <div className="bg-light_green p-3 flex items-center justify-between ">
                    <p>Total Hours</p>
                    <p>
                      {formatMinutesToHours(tutorTotalMinutes[tutor.uid] ?? 0)}
                    </p>
                  </div>
                  <div className="flex items-center p-3 justify-between ">
                    <p>Avg Time/Session</p>
                    <p>
                      {formatMinutesToHours(tutorAvgMinutes[tutor.uid] ?? 0)}
                    </p>
                  </div>
                  {/* {tutor.} */}
                </div>
                <div className="w-full px-3 pt-3">
                  <Link href={"/student/book-a-session"} className="">
                    <Button variant={"outline_green"} className="w-full">
                      Book Session
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </ContainerLayout>
      </div>
    );
};

export default Dashboard;

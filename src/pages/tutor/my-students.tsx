import React, { useEffect, useState } from "react";
import ContainerLayout from "../layouts/ContainerLayout";
import { getMyStudents, getSessions, getTutorById } from "@/utils/firestore";
import useAuthState from "@/states/AuthState";
import { StudentSchema, TutorSchema } from "@/types/firebase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import Image from "next/image";
import pfp2 from "@/assets/pfp2.png";

const MyStudents = () => {
  const { user, userData } = useAuthState();
  const [myStudents, setMyStudents] = useState<StudentSchema[] | null>(null);
  const [loading, setLoading] = useState(false);
  const tutor = userData as TutorSchema;

  useEffect(() => {
    try {
      setLoading(true);
      const fetchTutors = async () => {
        if (!user || !tutor) return;
        const stds = await getMyStudents(tutor);
        setLoading(false);
        setMyStudents(stds);
      };
      fetchTutors();
    } catch (error) {
      console.error("Error fetching tutors:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (userData)
    return (
      <div>
        <ContainerLayout margin="0">
          <div className="flex justify-between items-center px-5 pb-4">
            <h2 className="font-semibold text-lg sm:text-xl ">My Students</h2>
            <Link href={"/tutor/add-student"} className="max-w-28">
              <Button variant={"outline_green"} className="w-full">
                Add Student
              </Button>
            </Link>
          </div>

          <div className="sm:text-base text-xs">
            <div className="my-3 sm:px-10 px-4  text-light_gray font-medium grid grid-cols-4">
              <p>Tutors</p>
              <p className="text-center">Sessions</p>
              <p className="text-center">Hours</p>
              <p className="text-right">Earnings</p>
            </div>
            {loading ? (
              <div className="flex justify-center w-full my-20">
                <LoadingSpinner />
              </div>
            ) : (
              myStudents?.map((std) => {
                return (
                  <ListItem key={std?.uid} std={std} tutorId={userData?.uid} />
                );
              })
            )}
          </div>
        </ContainerLayout>
      </div>
    );
};

export default MyStudents;

const ListItem = ({
  std,
  tutorId,
}: {
  std: StudentSchema;
  tutorId: string;
}) => {
  const [totalSessiosn, setTotalSessiosn] = useState<number>(0);
  const [totalHours, setTotalHours] = useState<string>("0hrs 0mins");
  const [totalEarnings, setTotalEarnings] = useState<number>(0);

  useEffect(() => {
    const fetchTutorSession = async () => {
      const stdSession = await getSessions(std?.uid, "student");

      const filteredSessions = stdSession.filter(
        (session) =>
          session.status === "completed" && session.tutorId === tutorId
      );

      setTotalSessiosn(filteredSessions.length);

      let totalMinutes = 0;
      let earnings = 0;

      filteredSessions.forEach((session) => {
        const duration = session.duration; // e.g., "1 hour 30 minutes"
        const hoursMatch = duration.match(/(\d+)\s*hour/);
        const minutesMatch = duration.match(/(\d+)\s*minute/);

        const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
        const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

        const sessionMinutes = hours * 60 + minutes;
        totalMinutes += sessionMinutes;

        // Charges per minute
        const ratePerMinute = session.chargesPerHour / 60;
        earnings += sessionMinutes * ratePerMinute;
      });

      const hrs = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;

      setTotalHours(`${hrs}hrs ${mins}mins`);
      setTotalEarnings(parseFloat(earnings.toFixed(2))); // rounding to 2 decimal places
    };

    fetchTutorSession();
  }, []);

  return (
    <div className="grid grid-cols-4 items-center even:bg-light_green sm:px-7 px-4 py-3">
      <div className="flex items-center justify-start sm:gap-2 gap-1.5">
        <div className="flex-shrink-0 sm:w-9 sm:h-9 w-6 h-6 rounded-full overflow-hidden bg-slate-200">
          <Image
            src={std?.profilePicture ?? pfp2}
            alt=""
            className="object-cover sm:h-9 h-6"
          />
        </div>
        <p className="line-clamp-2">{std?.displayName}</p>
      </div>
      <p className="text-center">{totalSessiosn}</p>
      <p className="text-center">{totalHours}</p>
      <p className="font-semibold text-primary_green text-right">
        £{totalEarnings}
      </p>
    </div>
  );
};

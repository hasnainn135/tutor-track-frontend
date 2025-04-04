import React, { useEffect, useState } from "react";
import ContainerLayout from "../layouts/ContainerLayout";
import { Chart } from "@/components/Chart";
import Image from "next/image";
import pfp2 from "@/assets/pfp2.png";
import useAuthState from "@/states/AuthState";
import { StudentSchema, TutorSchema } from "@/types/firebase";
import {
  getMyStudents,
  getSessions,
  timestampToDateOnly,
} from "@/utils/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Analytics = () => {
  const { user, userData } = useAuthState();
  const tutor = userData as TutorSchema;

  const [myStudents, setMyStudents] = useState<StudentSchema[] | null>(null);
  const [studentStats, setStudentStats] = useState<
    {
      student: StudentSchema;
      totalHours: string;
      totalEarnings: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [activeStds, setActiveStds] = useState<number>(0);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [totalHours, setTotalHours] = useState<string>("0hr : 0mins");
  const [chartData, setChartData] = useState<
    { day: string; earnings: number }[]
  >([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    monthNames[new Date().getMonth()]
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !tutor) return;
      setLoading(true);

      try {
        const stds = await getMyStudents(tutor);
        setMyStudents(stds);
        setActiveStds(stds.length);

        let earningsSum = 0;
        let sessionsCount = 0;
        let allMinutes = 0;
        const stats = [];

        const dailyEarningsMap: Record<string, number> = {};
        const today = new Date();
        const selectedMonthIndex = monthNames.indexOf(selectedMonth);
        const currentYear = today.getFullYear();

        for (const std of stds) {
          const sessions = await getSessions(std.uid, "student");

          const filtered = sessions.filter(
            (s) => s.status === "completed" && s.tutorId === tutor.uid
          );

          let totalMinutes = 0;
          let earnings = 0;

          for (const session of filtered) {
            const duration = session.duration;
            const hoursMatch = duration.match(/(\d+)\s*hour/);
            const minutesMatch = duration.match(/(\d+)\s*minute/);

            const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
            const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

            const mins = hours * 60 + minutes;
            totalMinutes += mins;
            allMinutes += mins;
            sessionsCount += 1;

            const ratePerMinute = session.chargesPerHour / 60;
            const sessionEarnings = mins * ratePerMinute;
            earnings += sessionEarnings;

            const date = timestampToDateOnly(session.sessionDate);
            if (
              date.getMonth() !== selectedMonthIndex ||
              date.getFullYear() !== currentYear
            )
              continue;

            const day = String(date.getDate());
            dailyEarningsMap[day] =
              (dailyEarningsMap[day] || 0) + sessionEarnings;
          }

          const hrs = Math.floor(totalMinutes / 60);
          const mins = totalMinutes % 60;

          stats.push({
            student: std,
            totalHours: `${hrs}hrs ${mins}mins`,
            totalEarnings: parseFloat(earnings.toFixed(2)),
          });

          earningsSum += earnings;
        }

        const totalHrs = Math.floor(allMinutes / 60);
        const totalMins = allMinutes % 60;
        setStudentStats(stats);
        setTotalEarnings(parseFloat(earningsSum.toFixed(2)));
        setTotalHours(`${totalHrs}hr : ${totalMins}mins`);
        setTotalSessions(sessionsCount);

        const daysInMonth = new Date(
          currentYear,
          selectedMonthIndex + 1,
          0
        ).getDate();

        const dailyEarningsArray = Array.from(
          { length: daysInMonth },
          (_, i) => {
            const day = (i + 1).toString();
            return {
              day,
              earnings: parseFloat((dailyEarningsMap[day] || 0).toFixed(2)),
            };
          }
        );

        setChartData(dailyEarningsArray);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tutor, selectedMonth]); // ✅ Runs again when month changes

  if (tutor)
    return (
      <div className="flex flex-col gap-3">
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-3">
          <ContainerLayout>
            <div className="font-medium flex flex-col justify-between">
              <p>
                Total Earnings{" "}
                <span className="text-light_gray">This Month</span>
              </p>
              <p className="text-3xl font-bold text-primary_green">
                £{totalEarnings}
              </p>
            </div>
          </ContainerLayout>
          <ContainerLayout>
            <div className="font-medium flex flex-col justify-between">
              <p>
                Total Hours <span className="text-light_gray">This Month</span>
              </p>
              <p className="text-3xl font-bold ">{totalHours}</p>
            </div>
          </ContainerLayout>
          <ContainerLayout>
            <div className="font-medium flex flex-col justify-between">
              <p>
                Total Sessions{" "}
                <span className="text-light_gray">This Month</span>
              </p>
              <p className="text-3xl font-bold ">{totalSessions}</p>
            </div>
          </ContainerLayout>
          <ContainerLayout>
            <div className="font-medium flex flex-col justify-between">
              <p>
                Active Students{" "}
                {/* <span className="text-light_gray">This Month</span> */}
              </p>
              <p className="text-3xl font-bold ">{activeStds}</p>
            </div>
          </ContainerLayout>
        </div>
        <ContainerLayout>
          <div className="flex items-center justify-between gap-3">
            <h2
              className="font-semibold sm:text-xl text
        -lg "
            >
              Earnings
            </h2>
            <div className="">
              <Select
                value={selectedMonth}
                onValueChange={(value) => {
                  setSelectedMonth(value);
                }}
              >
                <SelectTrigger
                  id="session-limit"
                  className="w-full font-medium "
                >
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((month) => {
                    return <SelectItem value={month}>{month}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="">
            <Chart data={chartData} />
          </div>
        </ContainerLayout>
        <ContainerLayout heading="Earnings per Student" margin="0">
          <div className="">
            <div className="my-3 px-5 text-light_gray font-medium grid grid-cols-3">
              <p>Students</p>
              <p className="text-center">Total Hours</p>
              <p className="text-right">Earnings</p>
            </div>
            {studentStats.map((s) => (
              <ListItem
                key={s.student.uid}
                std={s.student}
                totalHours={s.totalHours}
                totalEarnings={s.totalEarnings}
              />
            ))}
          </div>
        </ContainerLayout>
      </div>
    );
};

export default Analytics;

const ListItem = ({
  std,
  totalHours,
  totalEarnings,
}: {
  std: StudentSchema;
  totalHours: string;
  totalEarnings: number;
}) => {
  return (
    <div className="grid grid-cols-3 items-center even:bg-light_green sm:px-7 px-4 py-3">
      <div className="flex items-center justify-start sm:gap-2 gap-1.5">
        <div className="flex-shrink-0 sm:w-9 sm:h-9 w-6 h-6 rounded-full overflow-hidden bg-slate-200">
          <Image
            src={std.profilePicture ?? pfp2}
            alt=""
            className="object-cover sm:h-9 h-6"
          />
        </div>
        <p className="line-clamp-2">{std.displayName}</p>
      </div>
      <p className="text-center">{totalHours}</p>
      <p className="font-semibold text-primary_green text-right">
        £{totalEarnings}
      </p>
    </div>
  );
};

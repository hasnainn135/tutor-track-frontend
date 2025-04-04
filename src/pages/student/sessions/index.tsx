import SessionListItem from "@/components/SessionListItem";
import ContainerLayout from "@/pages/layouts/ContainerLayout";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  FirestoreTimestamp,
  Session,
  StudentSchema,
  TutorSchema,
} from "@/types/firebase";
import useAuthState from "@/states/AuthState";
import {
  getMyTutors,
  getSessions,
  getTutorById,
  timestampToDateOnly,
} from "@/utils/firestore";

const StudentSessions = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState<boolean>(false);
  const [sessions, setSessions] = useState<Session[] | undefined>([]);
  const [std, setStd] = useState<StudentSchema | null>(null);
  const [bookedTutors, setBookedTutors] = useState<TutorSchema[]>([]);
  //FILTERS
  const [date, setDate] = useState<Date | undefined>();
  const [sessionFilters, setSessionFilters] = useState<{
    tutor_id: string | undefined;
    tutor_absent: boolean;
    dates: string[];
    days: string[];
    time: string;
    fromDuration: string;
    toDuration: string;
  }>({
    tutor_id: undefined,
    tutor_absent: false,
    dates: [],
    days: [],
    time: "",
    fromDuration: "",
    toDuration: "",
  });

  // const { loggedInStudent, getTutorById } = useUsers();
  const { user, userData } = useAuthState();

  useEffect(() => {
    const fetchStudentSessions = async () => {
      setSessionLoading(true);
      try {
        if (!user) return;
        const response = await getSessions(user?.uid, "student");
        console.log(response);

        setSessions(response);
      } catch (err) {
        setSessionError((err as Error).message);
      } finally {
        setSessionLoading(false);
      }
    };

    async function fetchStudentTutors() {
      if (!user) return;

      try {
        const tutors = await getMyTutors(userData as StudentSchema);

        setBookedTutors(tutors);
      } catch (error) {
        console.error("Error fetching Tutor Data:", error);
      }
    }

    fetchStudentSessions();
    fetchStudentTutors();
  }, [user, userData]);

  //GROUP Sessions by date
  const groupSessionsByDate = (
    status: Session["status"] | Session["status"][],
    sortDescending = false
  ) => {
    return (
      sessions
        ?.filter((session) =>
          Array.isArray(status)
            ? status.includes(session.status)
            : session.status === status
        )
        .sort(
          (a, b) =>
            sortDescending
              ? timestampToDateOnly(b.sessionDate).getTime() -
                timestampToDateOnly(a.sessionDate).getTime()
              : timestampToDateOnly(a.sessionDate).getTime() -
                timestampToDateOnly(b.sessionDate).getTime() // Ascending for Upcoming
        )
        .reduce<Record<string, Session[]>>((acc, session) => {
          const sessionDate = timestampToDateOnly(session.sessionDate);
          const today = new Date();
          const tomorrow = new Date();
          tomorrow.setDate(today.getDate() + 1);

          let dateKey = sessionDate.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

          if (sessionDate.toDateString() === today.toDateString()) {
            dateKey = "Today";
          } else if (sessionDate.toDateString() === tomorrow.toDateString()) {
            dateKey = "Tomorrow";
          }

          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(session);

          return acc;
        }, {}) || {}
    );
  };

  const upcomingSessions = groupSessionsByDate("incomplete"); // Ascending order
  const previousSessions = groupSessionsByDate(["completed"], true); // Descending order
  const canceledSessions = groupSessionsByDate("canceled", true); // Descending order

  const renderSessionSection = (sessionsByDate: Record<string, Session[]>) => {
    if (Object.keys(sessionsByDate).length === 0) return <div>No Sessions</div>;
    return (
      <div className="flex flex-col gap-2">
        {Object.entries(sessionsByDate).map(([date, sessionGroup]) => (
          <div key={date} className="flex gap-3">
            <div className="w-20 text-center p-1 bg-dark_green text-white grid place-content-center rounded-lg overflow-hidden text-sm">
              {date === "Today" || date === "Tomorrow" ? (
                <p>{date}</p>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex flex-col items-center">
                    <p>{date.split(",")[0]}</p>
                    <p>{date.split(",")[1]}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full flex flex-col gap-2 py-3">
              {sessionGroup.map((session) => (
                <SessionListItem key={session.id} session={session} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleFilterChanges = (
    field: keyof typeof sessionFilters,
    value: any
  ) => {
    setSessionFilters((prev) => ({
      ...prev,
      [field]: value,
    }));

    //APPLY FILTERS
  };

  //ADD DATE TO FILTER OBJ
  useEffect(() => {
    const formattedDate = date?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const addDate = [...sessionFilters.dates];

    if (formattedDate && !addDate.includes(formattedDate)) {
      addDate.push(formattedDate);
      handleFilterChanges("dates", addDate);
    }
  }, [date]);

  if (sessionLoading)
    return (
      <div className="">
        <LoadingSpinner />
      </div>
    );

  if (!sessionLoading)
    return (
      <div className="flex gap-5 h-full">
        <ContainerLayout heading="Sessions">
          <SessionTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="pt-6">
            {activeTab === 1 ? (
              renderSessionSection(upcomingSessions)
            ) : activeTab === 2 ? (
              renderSessionSection(previousSessions)
            ) : activeTab === 3 ? (
              renderSessionSection(canceledSessions)
            ) : (
              <div></div>
            )}
          </div>
        </ContainerLayout>

        <div className="w-96 h-fit">
          <ContainerLayout>
            {/* HEADING AND CLEAR BTN */}
            <div className="flex items-center w-full justify-between">
              <div className="font-semibold text-xl">Filters</div>
              <button className="text-sm text-bright_green flex items-center gap-1.5 pt-1">
                <span>Clear all</span>
                <span className="border border-bright_green rounded-full p-0.5">
                  <RxCross2 className="size-2.5" />
                </span>
              </button>
            </div>
            {/* FILTERS */}
            <form
              action="#"
              className="pt-4 flex flex-col items-center gap-3 w-full"
            >
              {/* Tutor */}
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="tutor" className="text-sm">
                  Tutor
                </label>
                <Select
                  defaultValue="All_Tutors"
                  onValueChange={(value) => {
                    handleFilterChanges("tutor_id", value);
                  }}
                >
                  <SelectTrigger id="tutor" className="w-full ">
                    <SelectValue placeholder="Select Tutor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"All_Tutors"}>All Tutors</SelectItem>
                    {bookedTutors.map((tutor) => {
                      if (tutor)
                        return (
                          <SelectItem key={tutor.uid} value={tutor.uid}>
                            {tutor.displayName}
                          </SelectItem>
                        );
                    })}
                  </SelectContent>
                </Select>
              </div>
              {/* CANCELED / TUTOR ABSENT */}
              <div className="text-sm flex items-center gap-1.5 w-full">
                <input
                  onChange={(e) => {
                    handleFilterChanges(
                      "tutor_absent",
                      e.currentTarget.checked
                    );
                  }}
                  type="checkbox"
                  id="tutor_absent"
                  checked={sessionFilters.tutor_absent}
                  className="peer hidden"
                />
                <div className="cursor-pointer w-4 h-4 rounded-sm border border-dark_gray peer-checked:bg-bright_green group-hover:bg-bright_green/30"></div>

                <label htmlFor="tutor_absent" className="cursor-pointer">
                  Tutor Absent
                </label>
              </div>
              {/* Dates */}
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="dates" className="text-sm">
                  Dates
                </label>
                <DatePicker
                  className="border-neutral-200"
                  date={date}
                  setDate={setDate}
                />
                <div className="flex flex-wrap w-full gap-1 font-medium text-xs">
                  {sessionFilters.dates.map((date) => {
                    return (
                      <div
                        key={date}
                        className="flex items-center gap-2 bg-primary_green py-1.5 px-3 rounded-md text-white"
                      >
                        <p>{date}</p>
                        <button
                          className="font-semibold mt-[1px] hover:text-rose-500"
                          onClick={() => {
                            const removeDates = [...sessionFilters.dates];

                            removeDates.splice(removeDates.indexOf(date), 1);
                            handleFilterChanges("dates", removeDates);
                          }}
                        >
                          &#10005;
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Days */}
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="days" className="text-sm">
                  Days
                </label>
                <Select
                  value=""
                  onValueChange={(value) => {
                    const addDay = [...sessionFilters.days];

                    if (!addDay.includes(value)) {
                      addDay.push(value);
                      handleFilterChanges("days", addDay);
                    }
                  }}
                >
                  <SelectTrigger id="days" className="w-full">
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => {
                      return (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <div className="flex flex-wrap w-full gap-1 font-medium text-xs">
                  {sessionFilters.days.map((day) => {
                    return (
                      <div
                        key={day}
                        className="flex items-center gap-2 bg-primary_green py-1.5 px-3 rounded-md text-white"
                      >
                        <p>{day}</p>
                        <button
                          className="font-semibold mt-[1px] hover:text-rose-500"
                          onClick={() => {
                            const removeDay = [...sessionFilters.days];

                            removeDay.splice(removeDay.indexOf(day), 1);
                            handleFilterChanges("days", removeDay);
                          }}
                        >
                          &#10005;
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Time */}
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="time" className="text-sm">
                  Time
                </label>
                <Input
                  onChange={(e) =>
                    handleFilterChanges("time", e.currentTarget.value)
                  }
                  value={sessionFilters.time}
                  id="time"
                  placeholder="e.g. 8:30 PM"
                  className="border-neutral-200"
                />
              </div>
              {/* DURATION */}
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm">Duration</label>
                <div className="w-full flex justify-between items-center gap-2">
                  <Input
                    onChange={(e) =>
                      handleFilterChanges("fromDuration", e.currentTarget.value)
                    }
                    value={sessionFilters.fromDuration}
                    placeholder="Min (30 m)"
                    className="border-neutral-200 w-full"
                  />
                  <div className="text-2xl pb-1 text-neutral-400 font-extralight">
                    &#10230;
                  </div>
                  <Input
                    onChange={(e) =>
                      handleFilterChanges("toDuration", e.currentTarget.value)
                    }
                    value={sessionFilters.toDuration}
                    placeholder="Max (2h 30m)"
                    className="border-neutral-200 w-full"
                  />
                </div>
              </div>
            </form>
          </ContainerLayout>
        </div>
      </div>
    );
};

export default StudentSessions;

const SessionTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="flex items-center text-sm">
      <button
        onClick={() => setActiveTab(1)}
        className={`w-24 px-3 py-2 border-b-2 border-[#BABABA] hover:bg-slate-50 rounded-t-md ${
          activeTab === 1
            ? "border-primary_green font-semibold bg-light_green"
            : ""
        }`}
      >
        Upcoming
      </button>
      <button
        onClick={() => setActiveTab(2)}
        className={`w-24 px-3 py-2 border-b-2 border-[#BABABA] hover:bg-slate-50 rounded-t-md ${
          activeTab === 2
            ? "border-primary_green font-semibold bg-light_green"
            : ""
        }`}
      >
        Previous
      </button>
      <button
        onClick={() => setActiveTab(3)}
        className={`w-24 px-3 py-2 border-b-2 border-[#BABABA] hover:bg-slate-50 rounded-t-md ${
          activeTab === 3
            ? "border-primary_green font-semibold bg-light_green"
            : ""
        }`}
      >
        Canceled
      </button>
    </div>
  );
};

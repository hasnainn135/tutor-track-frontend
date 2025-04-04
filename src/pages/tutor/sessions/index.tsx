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
import { Session, StudentSchema } from "@/types/firebase";
import useAuthState from "@/states/AuthState";
import {
  getMyStudents,
  getSessions,
  getStudentById,
  parseDuration,
  timestampToDateOnly,
} from "@/utils/firestore";
import { TutorSchema } from "@/types/firebase";
import { FiFilter } from "react-icons/fi";
import SessionCard from "@/components/ui/SessionCard";
import { set } from "date-fns";

const TutorSessions = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState<boolean>(false);
  const [sessions, setSessions] = useState<Session[] | undefined>([]);
  const [sessionsBackup, setSessionsBackup] = useState<Session[] | undefined>(
    []
  );
  const [std, setStd] = useState<StudentSchema | null>(null);
  const [bookedStudents, setBookedStudents] = useState<StudentSchema[]>([]);
  const [toggleFilter, setToggleFilter] = useState<boolean>(false);

  //FILTERS
  const [date, setDate] = useState<Date | undefined>();
  const [sessionFilters, setSessionFilters] = useState<{
    student_id: string | undefined;
    student_absent: boolean;
    dates: string[];
    days: string[];
    time: string;
    fromDuration: string;
    toDuration: string;
  }>({
    student_id: undefined,
    student_absent: false,
    dates: [],
    days: [],
    time: "",
    fromDuration: "",
    toDuration: "",
  });

  const { user, userData } = useAuthState();
  const tutorData = userData as TutorSchema | null;

  useEffect(() => {
    const fetchTutorSessions = async () => {
      setSessionLoading(true);
      try {
        if (!user) return;
        const response = await getSessions(user?.uid, "tutor");

        setSessions(response);
        setSessionsBackup(response);
      } catch (err) {
        setSessionError((err as Error).message);
      } finally {
        setSessionLoading(false);
      }
    };

    async function fetchTutorStudents() {
      if (!user) return;
      try {
        const students = await getMyStudents(userData as TutorSchema);

        setBookedStudents(students);
      } catch (error) {
        console.error("Error fetching Tutor Data:", error);
      }
    }

    fetchTutorSessions();
    fetchTutorStudents();
  }, [user, userData]);

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
        .sort((a, b) =>
          sortDescending
            ? timestampToDateOnly(b.sessionDate).getTime() -
              timestampToDateOnly(a.sessionDate).getTime()
            : timestampToDateOnly(a.sessionDate).getTime() -
              timestampToDateOnly(b.sessionDate).getTime()
        )
        .reduce<Record<string, Session[]>>((acc, session) => {
          // Ensure consistent UTC parsing
          const sessionDateObj = timestampToDateOnly(session.sessionDate);

          const today = new Date();
          const tomorrow = new Date();
          tomorrow.setDate(today.getDate() + 1);

          let dateKey = sessionDateObj.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

          if (sessionDateObj.toDateString() === today.toDateString()) {
            dateKey = "Today";
          } else if (
            sessionDateObj.toDateString() === tomorrow.toDateString()
          ) {
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
          <div key={date} className="flex sm:flex-row flex-col gap-3">
            <div className="sm:w-20 text-center p-1 flex-shrink-0 bg-dark_green text-white grid place-content-center rounded-lg overflow-hidden text-sm">
              {date === "Today" || date === "Tomorrow" ? (
                <p>{date}</p>
              ) : (
                <div className="flex flex-col items-center">
                  <p>{date.split(",")[0]}</p>
                  <p>{date.split(",")[1]}</p>
                </div>
              )}
            </div>
            <div className="w-full flex flex-col gap-2 py-3">
              {sessionGroup.map((session) => (
                <div className="" key={session.id}>
                  <div className="sm:block hidden">
                    <SessionListItem session={session} />
                  </div>
                  <div className="sm:hidden block">
                    <SessionCard session={session} />
                  </div>
                </div>
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
  };

  //APPLY FILTERS
  useEffect(() => {
    const applyFilters = () => {
      if (!sessionsBackup) return;

      let filtered = [...sessionsBackup];

      // Filter by student_id
      if (
        sessionFilters.student_id &&
        sessionFilters.student_id !== "All_Student"
      ) {
        filtered = filtered.filter(
          (s) => s.studentId === sessionFilters.student_id
        );
      }

      // Filter by student_absent
      if (sessionFilters.student_absent) {
        filtered = filtered.filter((s) => s.isStudentAbsent);
      }

      // Filter by dates
      if (sessionFilters.dates.length > 0) {
        filtered = filtered.filter((s) => {
          const sessionDate = timestampToDateOnly(
            s.sessionDate
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          return sessionFilters.dates.includes(sessionDate);
        });
      }

      // Filter by days
      if (sessionFilters.days.length > 0) {
        filtered = filtered.filter((s) => {
          const sessionDay = timestampToDateOnly(
            s.sessionDate
          ).toLocaleDateString("en-US", {
            weekday: "long",
          });
          return sessionFilters.days.includes(sessionDay);
        });
      }

      // Filter by time
      if (sessionFilters.time) {
        filtered = filtered.filter((s) =>
          s.bookingStartTime
            .toLowerCase()
            .includes(sessionFilters.time.toLowerCase())
        );
      }

      // Filter by duration
      if (sessionFilters.fromDuration || sessionFilters.toDuration) {
        const from = parseDuration(sessionFilters.fromDuration);
        const to = parseDuration(sessionFilters.toDuration);

        filtered = filtered.filter((s) => {
          const sessionDuration = parseDuration(s.duration);
          return (
            (isNaN(from) || sessionDuration >= from) &&
            (isNaN(to) || sessionDuration <= to)
          );
        });
      }

      setSessions(filtered);
    };
    applyFilters();
  }, [sessionFilters]);

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

  return (
    <div className="flex gap-5 h-full relative">
      <ContainerLayout heading="Sessions">
        <div className="flex items-center justify-between gap-3 sm:flex-nowrap flex-wrap">
          <SessionTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="sm:w-fit sm:block flex w-full justify-end">
            <button
              className="xl:hidden block border p-3 border-light_gray rounded-md "
              onClick={() => setToggleFilter(true)}
            >
              <FiFilter className="" />
            </button>
          </div>
        </div>
        <div className="pt-6">
          {activeTab === 1 ? (
            renderSessionSection(upcomingSessions)
          ) : activeTab === 2 ? (
            renderSessionSection(previousSessions)
          ) : activeTab === 3 ? (
            renderSessionSection(canceledSessions)
          ) : (
            <div>No Sessions</div>
          )}
        </div>
      </ContainerLayout>

      <div className="xl:block hidden w-96 h-fit">
        <ContainerLayout>
          {/* HEADING AND CLEAR BTN */}
          <div className="flex items-center w-full justify-between">
            <div className="font-semibold text-xl">Filters</div>
            <button
              onClick={() => {
                setSessionFilters({
                  student_id: undefined,
                  student_absent: false,
                  dates: [],
                  days: [],
                  time: "",
                  fromDuration: "",
                  toDuration: "",
                });
              }}
              className="text-sm text-bright_green flex items-center gap-1.5 pt-1"
            >
              <span>Clear all</span>
              <span className="border border-bright_green rounded-full p-0.5">
                <RxCross2 className="size-2.5" />
              </span>
            </button>
          </div>
          {/* FILTERS */}
          <form
            action="#"
            className="filter_form pt-4 flex flex-col items-center gap-3 w-full"
          >
            {/* Tutor */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="tutor" className="text-sm">
                Student
              </label>
              <Select
                defaultValue="All_Student"
                value={sessionFilters.student_id ?? "All_Student"}
                onValueChange={(value) => {
                  handleFilterChanges("student_id", value);
                }}
              >
                <SelectTrigger id="tutor" className="w-full ">
                  <SelectValue placeholder="Select Tutor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"All_Student"}>All Students</SelectItem>
                  {bookedStudents.map((std) => {
                    if (std)
                      return (
                        <SelectItem key={std.uid} value={std.uid}>
                          {std.displayName}
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
                    "student_absent",
                    e.currentTarget.checked
                  );
                }}
                type="checkbox"
                id="student_absent"
                checked={sessionFilters.student_absent}
                className="peer hidden"
              />
              <div className="cursor-pointer w-4 h-4 rounded-sm border border-dark_gray peer-checked:bg-bright_green group-hover:bg-bright_green/30"></div>

              <label htmlFor="student_absent" className="cursor-pointer">
                Student Absent
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
                placeholder="e.g. 14:30"
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
      <div
        className={` rounded-lg xl:hidden block absolute duration-500 shadow-xl sm:w-96 w-full h-fit ${
          toggleFilter ? "right-0" : "-right-[200%]"
        }`}
      >
        <ContainerLayout>
          {/* HEADING AND CLEAR BTN */}
          <div className="flex items-center w-full justify-between">
            <div className="font-semibold text-xl">Filters</div>
            <button
              onClick={() => {
                setToggleFilter(false);
              }}
              className="text-sm text-dark_gray flex items-center gap-1.5 pt-1"
            >
              <span className="border border-dark_gray rounded-lg p-1.5">
                <RxCross2 className="size-4" />
              </span>
            </button>
          </div>
          <button
            onClick={() => {
              setSessionFilters({
                student_id: undefined,
                student_absent: false,
                dates: [],
                days: [],
                time: "",
                fromDuration: "",
                toDuration: "",
              });
            }}
            className="pt-4 text-sm text-bright_green flex items-center gap-1.5 "
          >
            <span>Clear all</span>
            <span className="border border-bright_green rounded-full p-0.5">
              <RxCross2 className="size-2.5" />
            </span>
          </button>
          {/* FILTERS */}
          <form
            action="#"
            className="filter_form pt-4 flex flex-col items-center gap-3 w-full"
          >
            {/* Tutor */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="tutor" className="text-sm">
                Student
              </label>
              <Select
                defaultValue="All_Student"
                onValueChange={(value) => {
                  handleFilterChanges("student_id", value);
                }}
              >
                <SelectTrigger id="tutor" className="w-full ">
                  <SelectValue placeholder="Select Tutor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"All_Student"}>All Students</SelectItem>
                  {bookedStudents.map((std) => {
                    if (std)
                      return (
                        <SelectItem key={std.uid} value={std.uid}>
                          {std.displayName}
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
                    "student_absent",
                    e.currentTarget.checked
                  );
                }}
                type="checkbox"
                id="student_absent"
                checked={sessionFilters.student_absent}
                className="peer hidden"
              />
              <div className="cursor-pointer w-4 h-4 rounded-sm border border-dark_gray peer-checked:bg-bright_green group-hover:bg-bright_green/30"></div>

              <label htmlFor="student_absent" className="cursor-pointer">
                Student Absent
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
                placeholder="e.g. 14:30"
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

export default TutorSessions;

const SessionTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="flex items-center sm:text-sm text-xs">
      <button
        onClick={() => setActiveTab(1)}
        className={`sm:w-24 px-3 py-2 border-b-2 border-[#BABABA] hover:bg-slate-50 rounded-t-md ${
          activeTab === 1
            ? "border-primary_green font-semibold bg-light_green"
            : ""
        }`}
      >
        Upcoming
      </button>
      <button
        onClick={() => setActiveTab(2)}
        className={`sm:w-24 px-3 py-2 border-b-2 border-[#BABABA] hover:bg-slate-50 rounded-t-md ${
          activeTab === 2
            ? "border-primary_green font-semibold bg-light_green"
            : ""
        }`}
      >
        Previous
      </button>
      <button
        onClick={() => setActiveTab(3)}
        className={`sm:w-24 px-3 py-2 border-b-2 border-[#BABABA] hover:bg-slate-50 rounded-t-md ${
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

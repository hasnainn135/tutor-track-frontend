import { Day } from "date-fns";

export type TutorType = {
  id: string;
  name: string;
  pfp: string;
  timeSlots: string[];
  sessions: string[] | undefined;
};

export type StudentType = {
  id: string;
  name: string;
  pfp: string;
  sessions: SessionsType[] | undefined;
  booked_tutors: {
    tutor_id: string;
    total_session: number;
    total_hours: string;
    dues: string;
  }[];
};

export type SessionsType = {
  id: string;
  student_id: string;
  tutor_id: string;
  session_date: Date;
  session_day: Day;
  session_time: string;
  session_limit: string | undefined;
  student_absent: boolean;
  tutor_absent: boolean;
  status: "ongoing" | "upcoming" | "completed" | "canceled";
  notes?: Notes[] | null;
};

export type Notes = {
  id: string;
  sender_type: "tutor" | "student";
  student_id: string;
  tutor_id: string;
  content: string;
  time: string;
};

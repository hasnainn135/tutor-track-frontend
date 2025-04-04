export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

interface UserSchema {
  uid: string;
  role: "student" | "tutor";
  displayName: string;
  profilePicture: string | null;
  email: string;
  educationLevel: string | null;
  instituteName: string | null;
  about: string | null;
  createdAt: Date;
  city: string | null;
  country: string | null;
}

interface TeachingLevel {
  level: string;
  subjects: string[];
}

export interface Reviews {
  id: string;
  reviewerID: string;
  reviewerName: string;
  reviewerPhotoURL: string;
  rating: number;
  timestamp: Date;
  content: string;
}

type TimeRange = {
  id: string;
  from: string;
  to: string;
};

export type WeeklySchedule = {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  timeRange: TimeRange[];
};

export interface MyStudents {
  studentId: string;
  chargesPerHour: number;
}

export interface TutorSchema extends UserSchema {
  teachingLevels: TeachingLevel[];
  reviews: Reviews[];
  myStudents: MyStudents[];
  yearsOfExperience: number | null;
  displayChargesPerHour: number | null;
  weeklySchedule: WeeklySchedule[] | null;
  overallRating: number | null;
  totalStudentsTaught: number | null;
}

export interface MyTutors {
  tutorId: string;
  chargesPerHour: number;
}

export interface StudentSchema extends UserSchema {
  myTutors: MyTutors[] | null;
}

export interface SessionNotes {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export interface Session {
  id: string;
  studentId: string;
  tutorId: string;
  monthYear: string;
  duration: string; // is this correct data type? please test
  status: "incomplete" | "completed" | "canceled";
  bookingStartTime: string; // is this correct data type? please test
  bookingEndTime: string; // is this correct data type? please test
  actualStartTime: string | null; // is this correct data type? please test
  actualEndTime: string | null; // is this correct data type? please test
  actualDuration: string | null; // is this correct data type? please test
  totalPauseTime: string | null; // is this correct data type? please test
  isStudentAbsent: boolean;
  isTutorAbsent: boolean;
  additionalNotes: string;
  createdAt: Date;
  chargesPerHour: number;
  sessionNotes: SessionNotes[];
  sessionDate: Date;
}

// Define a custom FirestoreTimestamp type
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

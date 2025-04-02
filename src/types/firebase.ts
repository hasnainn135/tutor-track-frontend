export interface FirestoreTimestamp {
    seconds: number;
    nanoseconds: number;
}

interface UserSchema {
    uid: string;
    role: string;
    fullName: string;
    profilePicture: string;
    email: string;
    educationLevel: string;
    instituteName: string;
    about: string;
    timestamp: FirestoreTimestamp;
    city: string | null;
    country: string | null;
}

interface TeachingLevel {
    level: string;
    subjects: string[];
}

interface Reviews {
    id: string;
    reviewerID: string;
    reviewerName: string;
    reviewerPhotoURL: string;
    rating: number;
    timestamp: string;
    content: string;
}

type TimeRange = {
    start: string;
    end: string;
};

type WeeklySchedule = {
    [day in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']?: TimeRange[];
};

export interface MyStudents {
    studentId: string;
    chargesPerHour: number;
}

export interface TutorSchema extends UserSchema {
    teachingLevels: TeachingLevel[];
    reviews: Reviews[];
    myStudents: MyStudents[];
    yearsOfExperience: number;
    displayChargesPerHour: number;
    weeklySchedule: WeeklySchedule;
}

export interface MyTutors {
    tutorId: string;
    chargesPerHour: number;
}

export interface StudentSchema extends UserSchema {
    myTutors: MyTutors[];
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
    isStudentAbsent: boolean
    isTutorAbsent: boolean;
    additionalNotes: string;
    createdAt: Date;
    chargesPerHour: number;
    sessionNotes: SessionNotes[];
}


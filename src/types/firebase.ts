export interface FirestoreTimestamp {
    seconds: number;
    nanoseconds: number;
}

interface UserSchema {
    uid: string;
    role: string;
    educationLevel: string;
    instituteName: string;
    about: string;
    timestamp: FirestoreTimestamp;
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

export interface TutorSchema extends UserSchema {
    teachingLevels: TeachingLevel[];
    reviews: Reviews[];
    myStudentsID: string[];
}

export interface StudentSchema extends UserSchema {
    myTutorsID: string[];
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
    sessionNotes: SessionNotes[];
}


interface FirestoreTimestamp {
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

interface SessionNotes {
    id: string;
    senderID: string;
    receiverID: string;
    content: string;
    time: string;
}

export interface Session {
    id: string;
    studentID: string;
    tutorID: string;
    monthYear: string;
    hours: string;
    timestamp: string;
    status: string;
    bookedStartingTime: string;
    bookedEndTime: string;
    actualStartingTime: string;
    actualDuration: string;
    actualEndTime: string;
    totalPauseTime: string;
    isStudentAbsent: boolean;
    isTutorAbsent: boolean;
    bookingNotes: string;
    sessionNotes: SessionNotes[];
}


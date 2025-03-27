interface FirestoreTimestamp {
    seconds: number;
    nanoseconds: number;
}

export interface StudentSchema {
    uid: string;
    role: string;
    educationLevel: string;
    instituteName: string;
    about: string;
    myTutors: string[];
    timestamp: FirestoreTimestamp;
}

interface TeachingLevel {
    level: string;
    subjects: string[];
}

export interface TutorSchema extends StudentSchema {
    teachingLevels: TeachingLevel[];
}
  
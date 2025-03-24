interface FirestoreTimestamp {
    seconds: number;
    nanoseconds: number;
  }
  
  export interface UserSchema {
    uid: string;
    full_name: string;
    role_id: string;
    user_name?: string; // we previously used to collect usernames at sign up.
    email: string;
    photoURL: string;
    timestamp: FirestoreTimestamp;
  }
  
  export interface TutorUserSchema extends UserSchema {
    highest_education: string;
    selected_subs: string[];
    tutor_resume: string;
  }
  
  
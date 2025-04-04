import {
  collection,
  DocumentData,
  getDocs,
  Query,
  query,
  where,
} from "@firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import {
  FirestoreTimestamp,
  Reviews,
  Session,
  SessionNotes,
  StudentSchema,
  TutorSchema,
} from "@/types/firebase";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  updateProfile,
  User,
} from "firebase/auth";

export const createTutor = async (
  email: string,
  pw: string,
  name: string
): Promise<void> => {
  try {
    const userCreds = await createUserWithEmailAndPassword(auth, email, pw);
    await updateProfile(userCreds.user, { displayName: name });
    await sendEmailVerification(userCreds.user);
    const data: TutorSchema = {
      uid: userCreds.user.uid,
      role: "tutor",
      displayName: name,
      profilePicture: null,
      email: email,
      educationLevel: null,
      instituteName: null,
      about: null,
      createdAt: new Date(),
      city: null,
      country: null,
      teachingLevels: [],
      reviews: [],
      myStudents: [],
      yearsOfExperience: null,
      displayChargesPerHour: null,
      weeklySchedule: null,
      overallRating: null,
      totalStudentsTaught: null,
    };
    await setDoc(doc(db, "users", userCreds.user.uid), data);
  } catch (e: any) {
    throw e;
  }
};

export const createStudent = async (
  email: string,
  pw: string,
  name: string
): Promise<void> => {
  try {
    const userCreds = await createUserWithEmailAndPassword(auth, email, pw);
    await updateProfile(userCreds.user, { displayName: name });
    await sendEmailVerification(userCreds.user);
    const data: StudentSchema = {
      uid: userCreds.user.uid,
      role: "student",
      displayName: name,
      profilePicture: null,
      email: email,
      educationLevel: null,
      instituteName: null,
      about: null,
      createdAt: new Date(),
      city: null,
      country: null,
      myTutors: null,
    };
    await setDoc(doc(db, "users", userCreds.user.uid), data);
  } catch (e: any) {
    throw e;
  }
};

export const deleteMyUser = async (user: User): Promise<void> => {
  try {
    await deleteUser(user);
  } catch (e) {
    throw e;
  }
};

export const addUser = async (
  tutorId: string,
  studentId: string,
  chargesPerHour: number
): Promise<void> => {
  try {
    const f1 = updateDoc(doc(db, "users", tutorId), {
      myStudents: arrayUnion({
        studentId,
        chargesPerHour,
      }),
    });
    const f2 = updateDoc(doc(db, "users", studentId), {
      myTutors: arrayUnion({
        tutorId,
        chargesPerHour,
      }),
    });
    await Promise.all([f1, f2]);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getTutors = async (): Promise<TutorSchema[]> => {
  try {
    const q = query(collection(db, "users"), where("role", "==", "tutor"));
    const qs = await getDocs(q);
    return qs.docs.map((doc) => doc.data() as TutorSchema);
  } catch (e) {
    throw e;
  }
};

export const getStudents = async (): Promise<StudentSchema[]> => {
  try {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const qs = await getDocs(q);
    return qs.docs.map((doc) => doc.data() as StudentSchema);
  } catch (e) {
    throw e;
  }
};

export const getMyTutors = async (
  studentData: StudentSchema
): Promise<TutorSchema[]> => {
  try {
    if (studentData.myTutors) {
      const fetchTutorsPromises = studentData.myTutors.map((tutor) =>
        getDoc(doc(db, "users", tutor.tutorId))
      );
      const docs = await Promise.all(fetchTutorsPromises);
      const tutors = docs.map((doc) => doc.data() as TutorSchema);
      return tutors;
    } else {
      return [];
    }
  } catch (e) {
    throw e;
  }
};

export const getTutorById = async (tutorId: string): Promise<TutorSchema> => {
  try {
    const ds = await getDoc(doc(db, "users", tutorId));
    return ds.data() as TutorSchema;
  } catch (e) {
    throw e;
  }
};

export const updateTutorDisplayCharges = async (
  tutorId: string,
  newAmount: number
): Promise<void> => {
  try {
    const docRef = doc(db, "users", tutorId);
    await updateDoc(docRef, {
      displayChargesPerHour: newAmount,
    });
  } catch (e) {
    throw e;
  }
};

export const getMyStudents = async (
  tutorData: TutorSchema
): Promise<StudentSchema[]> => {
  try {
    if (tutorData.myStudents) {
      const fetchStudentsPromises = tutorData.myStudents.map((student) =>
        getDoc(doc(db, "users", student.studentId))
      );
      const docs = await Promise.all(fetchStudentsPromises);
      const students = docs.map((doc) => doc.data() as StudentSchema);
      return students;
    } else {
      return [];
    }
  } catch (e) {
    throw e;
  }
};

export const getStudentById = async (
  studentId: string
): Promise<StudentSchema> => {
  try {
    const ds = await getDoc(doc(db, "users", studentId));
    return ds.data() as StudentSchema;
  } catch (e) {
    throw e;
  }
};

export const createSession = async (
  tutorId: string,
  studentId: string,
  duration: string,
  startTime: string,
  date: Date,
  additionalNotes: string,
  chargesPerHour: number
): Promise<void> => {
  const docRef = collection(db, "sessions");
  const docId = docRef.id;
  try {
    const data: Session = {
      id: docId,
      studentId: studentId,
      tutorId: tutorId,
      monthYear: `${date.getMonth() + 1}-${date.getFullYear()}`,
      duration: duration,
      status: "incomplete",
      bookingStartTime: startTime,
      bookingEndTime: duration,
      actualStartTime: null,
      actualEndTime: null,
      actualDuration: null,
      totalPauseTime: null,
      isStudentAbsent: false,
      isTutorAbsent: false,
      additionalNotes: additionalNotes,
      createdAt: new Date(),
      sessionNotes: [],
      chargesPerHour: chargesPerHour,
      sessionDate: date,
    };
    await addDoc(docRef, data);
  } catch (e) {
    throw e;
  }
};

export const getSessions = async (
  userId: string,
  roleType: "student" | "tutor"
): Promise<Session[]> => {
  try {
    let q: Query<DocumentData, DocumentData>;
    if (roleType === "student") {
      q = query(collection(db, "sessions"), where("studentId", "==", userId));
    } else {
      q = query(collection(db, "sessions"), where("tutorId", "==", userId));
    }
    const qs = await getDocs(q);
    return qs.docs.map((doc) => doc.data() as Session);
  } catch (e) {
    throw e;
  }
};

export const addSessionNote = async (
  sessionId: string,
  senderId: string,
  receiverId: string,
  content: string
): Promise<void> => {
  try {
    const collRef = collection(db, "sessions", sessionId, "sessionNotes");
    const docRef = doc(collRef);
    const noteId = docRef.id;
    const note: SessionNotes = {
      id: noteId,
      senderId,
      receiverId,
      content,
      timestamp: new Date(),
    };
    await setDoc(docRef, note);
  } catch (e) {
    throw e;
  }
};

export const getSessionNotes = async (
  sessionId: string
): Promise<SessionNotes[]> => {
  try {
    const q = query(collection(db, "sessions", sessionId, "sessionNotes"));
    const qs = await getDocs(q);
    return qs.docs.map((doc) => doc.data() as SessionNotes);
  } catch (e) {
    throw e;
  }
};

export const cancelSession = async (sessionId: string): Promise<void> => {
  try {
    const docRef = doc(db, "sessions", sessionId);
    await updateDoc(docRef, {
      status: "canceled",
    });
  } catch (e) {
    throw e;
  }
};

export const completeSession = async (sessionId: string): Promise<void> => {
  try {
    const docRef = doc(db, "sessions", sessionId);
    await updateDoc(docRef, {
      status: "completed",
    });
  } catch (e) {
    throw e;
  }
};

export const updateSessionAttendance = async (
  sessionId: string,
  isAbsent: boolean,
  roleType: "student" | "tutor"
): Promise<void> => {
  try {
    const docRef = doc(db, "sessions", sessionId);

    if (roleType === "student") {
      await updateDoc(docRef, {
        isStudentAbsent: isAbsent,
      });
    } else {
      await updateDoc(docRef, {
        isTutorAbsent: isAbsent,
      });
    }
  } catch (e) {
    throw e;
  }
};

export const addReview = async (
  studentId: string,
  studentName: string,
  studentPhotoURL: string,
  tutorId: string,
  rating: number,
  content: string
): Promise<void> => {
  try {
    const collRef = collection(db, "users", tutorId, "reviews");
    const docRef = doc(collRef);
    const reviewId = docRef.id;
    const data: Reviews = {
      id: reviewId,
      reviewerID: studentId,
      reviewerName: studentName,
      reviewerPhotoURL: studentPhotoURL,
      rating: rating,
      timestamp: new Date(),
      content: content,
    };
    await setDoc(docRef, data);
  } catch (e) {
    throw e;
  }
};

export const getAllReviews = async (tutorId: string): Promise<Reviews[]> => {
  try {
    const q = query(collection(db, "users", tutorId, "reviews"));
    const qs = await getDocs(q);
    return qs.docs.map((doc) => doc.data() as Reviews);
  } catch (e) {
    throw e;
  }
};

// Convert FirestoreTimestamp or JS Date to Date (with only the date part)
export const timestampToDateOnly = (
  timestamp: FirestoreTimestamp | Date
): Date => {
  if (!timestamp) {
    console.warn("timestampToDateOnly: timestamp is null or undefined");
    return new Date(NaN); // invalid
  }

  let jsDate: Date;

  if (timestamp instanceof Date) {
    jsDate = new Date(timestamp);
  } else if ("seconds" in timestamp) {
    jsDate = new Date(timestamp.seconds * 1000);
  } else {
    console.warn("timestampToDateOnly: invalid timestamp format", timestamp);
    return new Date(NaN); // invalid
  }

  return new Date(jsDate.getFullYear(), jsDate.getMonth(), jsDate.getDate());
};

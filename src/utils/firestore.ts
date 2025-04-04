import {
  collection,
  DocumentData,
  getDocs,
  onSnapshot,
  Query,
  query,
  Timestamp,
  where,
} from "@firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  serverTimestamp
} from "firebase/firestore";
import {
  FirestoreTimestamp,
  Reviews,
  Session,
  SessionNotes,
  StudentSchema,
  TeachingLevel,
  TutorSchema,
} from "@/types/firebase";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  updateProfile,
  User,
} from "firebase/auth";
import {v4 as uuid} from "uuid";

/**
 * Creates a new tutor account in Firebase Authentication and saves their profile in Firestore.
 *
 * @param email - The tutor's email address for authentication.
 * @param pw - The password used for account creation.
 * @param name - The display name to be shown on the tutor profile.
 * @returns A promise that resolves when the account is successfully created and saved.
 */
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

/**
 * Creates a new student account in Firebase Authentication and stores their profile in Firestore.
 *
 * @param email - The student's email address.
 * @param pw - The password for the account.
 * @param name - The display name for the student.
 * @returns A promise that resolves when the student is created and saved.
 */
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

/**
 * Deletes a user from Firebase Authentication.
 *
 * @param user - The authenticated user to delete.
 * @returns A promise that resolves when the user is deleted.
 */
export const deleteMyUser = async (user: User): Promise<void> => {
  try {
    await deleteUser(user);
  } catch (e) {
    throw e;
  }
};

/**
 * Associates a tutor and a student in Firestore by updating each of their user documents.
 *
 * @param tutorId - UID of the tutor.
 * @param studentId - UID of the student.
 * @param chargesPerHour - Agreed hourly rate between the tutor and student.
 * @returns A promise that resolves when both user documents are updated.
 */
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

/**
 * Fetches all tutor accounts from Firestore.
 *
 * @returns A promise that resolves with an array of tutor objects.
 */
export const getTutors = async (): Promise<TutorSchema[]> => {
  try {
    const q = query(collection(db, "users"), where("role", "==", "tutor"));
    const qs = await getDocs(q);
    return qs.docs.map((doc) => doc.data() as TutorSchema);
  } catch (e) {
    throw e;
  }
};

/**
 * Fetches all student accounts from Firestore.
 *
 * @returns A promise that resolves with an array of student objects.
 */
export const getStudents = async (): Promise<StudentSchema[]> => {
  try {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const qs = await getDocs(q);
    return qs.docs.map((doc) => doc.data() as StudentSchema);
  } catch (e) {
    throw e;
  }
};

/**
 * Retrieves the list of tutor objects linked to a given student.
 *
 * @param studentData - The student whose tutors are to be fetched.
 * @returns A promise that resolves with an array of tutor objects.
 */
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

/**
 * Fetches a single tutor profile from Firestore using tutor ID.
 *
 * @param tutorId - UID of the tutor.
 * @returns A promise that resolves with the tutor object.
 */
export const getTutorById = async (tutorId: string): Promise<TutorSchema> => {
  try {
    const ds = await getDoc(doc(db, "users", tutorId));
    return ds.data() as TutorSchema;
  } catch (e) {
    throw e;
  }
};

/**
 * Updates a tutor's hourly rate displayed on their profile.
 *
 * @param tutorId - UID of the tutor.
 * @param newAmount - New rate to be set.
 * @returns A promise that resolves when the rate is updated.
 */
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

/**
 * Retrieves the list of student objects linked to a given tutor.
 *
 * @param tutorData - The tutor whose students are to be fetched.
 * @returns A promise that resolves with an array of student objects.
 */
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

/**
 * Fetches a single student profile from Firestore using student ID.
 *
 * @param studentId - UID of the student.
 * @returns A promise that resolves with the student object.
 */
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

/**
 * Creates a new tutoring session between a tutor and a student.
 *
 * @param tutorId - UID of the tutor.
 * @param studentId - UID of the student.
 * @param duration - Scheduled duration of the session.
 * @param startTime - Scheduled start time of the session.
 * @param date - Date of the session.
 * @param additionalNotes - Any extra notes added during creation.
 * @param chargesPerHour - Tutor's hourly charge.
 * @returns A promise that resolves when the session is created.
 */
export const createSession = async (
  tutorId: string,
  studentId: string,
  duration: string,
  startTime: string,
  date: Date,
  additionalNotes: string,
  chargesPerHour: number
): Promise<void> => {
  const docCall = collection(db, "sessions");
  const docRef = doc(docCall);
  const docId = docRef.id;
  console.log("docRef.id = ", docRef.id);

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
      isStudentAbsent: false,
      isTutorAbsent: false,
      additionalNotes: additionalNotes,
      createdAt: new Date(),
      sessionNotes: [],
      chargesPerHour: chargesPerHour,
      sessionDate: date,
      start: false,
      end: false,
      pauseStartTime: null,
      totalPauseTime: null,
      paused: false,
      autoEnd: true,
    };
    await setDoc(docRef, data);
  } catch (e) {
    throw e;
  }
};

/**
 * Retrieves all sessions from Firestore for a given user based on their role.
 *
 * @param userId - UID of the student or tutor.
 * @param roleType - Indicates whether to filter by studentId or tutorId.
 * @returns A promise that resolves to an array of session objects.
 */
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

/**
 * Fetches a specific session by its ID.
 *
 * @param sessionId - ID of the session document.
 * @returns A promise that resolves with the session object or null if not found.
 */
export const getSessionById = async (
  sessionId: string
): Promise<Session | null> => {
  try {
    const sessionRef = doc(db, "sessions", sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (sessionSnap.exists()) {
      return sessionSnap.data() as Session;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching session:", error);
    throw error;
  }
};

/**
 * Marks a session as started and sets the actual start time.
 *
 * @param sessionId - ID of the session to update.
 * @returns A promise that resolves when the session is marked as started.
 */
export const startSessionInFirestore = async (sessionId: string) => {
  const sessionRef = doc(db, "sessions", sessionId);
  await updateDoc(sessionRef, {
    start: true,
    actualStartTime: new Date().toISOString(),
  });
};

/**
 * Marks a session as ended and sets the actual end time.
 *
 * @param sessionId - ID of the session to update.
 * @returns A promise that resolves when the session is marked as ended.
 */
export const endSessionInFirestore = async (sessionId: string) => {
  const sessionRef = doc(db, "sessions", sessionId);
  await updateDoc(sessionRef, {
    start: false,
    end: true,
    actualEndTime: new Date().toISOString(),
  });
};

/**
 * Pauses a session by recording the pause start time.
 *
 * @param sessionId - ID of the session to pause.
 * @returns A promise that resolves when the session is paused.
 */
export const pauseSessionInFirestore = async (sessionId: string) => {
  const sessionRef = doc(db, "sessions", sessionId);
  await updateDoc(sessionRef, {
    paused: true,
    pauseStartTime: new Date().toISOString(),
  });
};

/**
 * Resumes a paused session and updates the total pause duration.
 *
 * @param sessionId - ID of the session to resume.
 * @returns A promise that resolves when the session is resumed.
 */
export const resumeSessionInFirestore = async (sessionId: string) => {
  const sessionRef = doc(db, "sessions", sessionId);
  const sessionSnap = await getDoc(sessionRef);
  const session = sessionSnap.data();

  if (!session) return;

  const pauseStart = new Date(session.pauseStartTime);
  const now = new Date();
  const pausedMs = now.getTime() - pauseStart.getTime();
  const totalPaused = (session.totalPausedMs || 0) + pausedMs;

  await updateDoc(sessionRef, {
    paused: false,
    pauseStartTime: null,
    totalPauseTime: totalPaused,
  });
};

/**
 * Subscribes to real-time updates of a session document and triggers provided callbacks.
 *
 * @param sessionId - ID of the session to listen to.
 * @param isRunning - Whether the session is currently considered running in the UI.
 * @param onStart - Callback triggered when session starts.
 * @param onEnd - Callback triggered when session ends.
 * @param onPause - Callback triggered when session pauses.
 * @param onResume - Callback triggered when session resumes.
 * @returns A function to unsubscribe from the snapshot listener.
 */
export const listenToSessionChanges = ({
  sessionId,
  isRunning,
  onStart,
  onEnd,
  onPause,
  onResume,
}: {
  sessionId: string;
  isRunning: boolean;
  onStart: (actualStartTime: string | null) => void;
  onEnd: () => void;
  onPause?: () => void;
  onResume?: () => void;
}) => {
  const sessionRef = doc(db, "sessions", sessionId);

  const unsubscribe = onSnapshot(sessionRef, (docSnap) => {
    if (docSnap.exists()) {
      const sessionData = docSnap.data() as Session;

      if (sessionData.start && !isRunning) {
        onStart(sessionData.actualStartTime);
      }

      if (sessionData.end) {
        onEnd();
      }

      if (sessionData.paused === true && onPause) {
        onPause();
      }

      if (sessionData.paused === false && onResume) {
        onResume();
      }
    }
  });

  return unsubscribe;
};

/**
 * Adds a note to a specific session's `sessionNotes` subcollection.
 *
 * @param sessionId - ID of the session to add a note to.
 * @param senderId - UID of the user adding the note.
 * @param receiverId - UID of the recipient user.
 * @param content - Text content of the note.
 * @returns A promise that resolves when the note is added.
 */
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
      timestamp: Timestamp.now(),
    };
    await setDoc(docRef, note);
  } catch (e) {
    throw e;
  }
};

/**
 * Retrieves all notes associated with a given session.
 *
 * @param sessionId - ID of the session whose notes to fetch.
 * @returns A promise that resolves with an array of session notes.
 */
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

/**
 * Cancels a session by setting its status to "canceled".
 *
 * @param sessionId - ID of the session to cancel.
 * @returns A promise that resolves when the session is updated.
 */
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

/**
 * Completes a session by setting its status to "completed".
 *
 * @param sessionId - ID of the session to complete.
 * @returns A promise that resolves when the session is marked as completed.
 */
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

/**
 * Updates the auto-end flag for a session.
 *
 * @param sessionId - ID of the session to update.
 * @param auto - Boolean flag for auto-ending.
 * @returns A promise that resolves when the flag is updated.
 */
export const setAutoEndSession = async (
  sessionId: string,
  auto: boolean
): Promise<void> => {
  try {
    const docRef = doc(db, "sessions", sessionId);
    await updateDoc(docRef, {
      autoEnd: auto,
    });
  } catch (e) {
    throw e;
  }
};

/**
 * Updates a session’s attendance record to reflect absence of student or tutor.
 *
 * @param sessionId - ID of the session to update.
 * @param isAbsent - Whether the user was absent.
 * @param roleType - Whether the absent user is a "student" or "tutor".
 * @returns A promise that resolves when the attendance is updated.
 */
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

/**
 * Adds a review for a tutor by a student.
 *
 * @param studentId - UID of the student submitting the review.
 * @param studentName - Display name of the reviewer.
 * @param studentPhotoURL - Profile photo URL of the reviewer.
 * @param tutorId - UID of the tutor being reviewed.
 * @param rating - Numeric rating score.
 * @param content - Review message.
 * @returns A promise that resolves when the review is added.
 */
export const addReview = async (
  studentId: string,
  studentName: string,
  studentPhotoURL: string | null,
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
      timestamp: Timestamp.now(),
      content: content,
    };
    await setDoc(docRef, data);
  } catch (e) {
    throw e;
  }
};

/**
 * Retrieves all reviews for a specific tutor.
 *
 * @param tutorId - UID of the tutor whose reviews to fetch.
 * @returns A promise that resolves with an array of review objects.
 */
export const getAllReviews = async (tutorId: string): Promise<Reviews[]> => {
  try {
    const q = query(collection(db, "users", tutorId, "reviews"));
    const qs = await getDocs(q);
    return qs.docs.map((doc) => doc.data() as Reviews);
  } catch (e) {
    throw e;
  }
};

/**
 * Converts a Firestore Timestamp or Date to a JS Date object (stripped to date only).
 *
 * @param timestamp - Firestore Timestamp or JS Date object.
 * @returns A JS Date object representing only the date (time is zeroed out).
 */
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

/**
 * Parses a duration string like "1 hour 30 minutes" or "45m" into total minutes.
 *
 * @param duration - A human-readable duration string.
 * @returns Total number of minutes parsed from the string.
 */
export const parseDuration = (duration: string) => {
  // Match the format "X hours Y minutes", "Xh Ym", "Xm", "X h", etc.
  const parts = duration.match(/(\d+)\s*(h|hour|hrs|m|min|minutes?)/gi);

  if (!parts) return 0;

  let totalMinutes = 0;

  // Loop through each part to convert to total minutes
  parts.forEach((part) => {
    const match = part.trim().match(/(\d+)\s*(h|hour|hrs|m|min|minutes?)/i);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2].toLowerCase();

      if (unit.includes("h")) {
        totalMinutes += value * 60; // Convert hours to minutes
      } else if (unit.includes("m")) {
        totalMinutes += value; // Direct minutes
      }
    }
  });

  return totalMinutes;
};

/**
 * Adds a teaching level to a tutor's profile.
 *
 * @param tutorId - UID of the tutor.
 * @param newLevel - Teaching level object to add.
 * @returns A promise that resolves when the level is added.
 */
export const addTeachingLevel = async (
  tutorId: string,
  newLevel: TeachingLevel
) => {
  try {
    const tutorRef = doc(db, "users", tutorId);

    await updateDoc(tutorRef, {
      teachingLevels: arrayUnion(newLevel),
    });
  } catch (error) {
    console.error("Error adding teaching level:", error);
    throw error;
  }
};

/**
 * Replaces the subject list for a specific teaching level.
 *
 * @param tutorId - UID of the tutor.
 * @param levelName - Name of the teaching level to update.
 * @param newSubjects - New array of subjects to replace the old ones.
 * @returns A promise that resolves when the subjects are updated.
 */
export const updateTeachingLevelSubjects = async (
  tutorId: string,
  levelName: string,
  newSubjects: string[]
) => {
  try {
    const tutorRef = doc(db, "users", tutorId);
    const tutorSnap = await getDoc(tutorRef);

    if (!tutorSnap.exists()) {
      throw new Error("Tutor not found");
    }

    const tutorData = tutorSnap.data() as TutorSchema;
    const updatedLevels = tutorData.teachingLevels.map((level) =>
      level.level === levelName ? { ...level, subjects: newSubjects } : level
    );

    await updateDoc(tutorRef, {
      teachingLevels: updatedLevels,
    });
  } catch (error) {
    console.error("Error updating teaching level subjects:", error);
    throw error;
  }
};

/**
 * Removes a teaching level entirely from the tutor's profile.
 *
 * @param tutorId - UID of the tutor.
 * @param levelName - Name of the level to remove.
 * @returns A promise that resolves when the level is removed.
 */
export const removeTeachingLevel = async (
  tutorId: string,
  levelName: string
) => {
  try {
    const tutorRef = doc(db, "users", tutorId);
    const tutorSnap = await getDoc(tutorRef);

    if (!tutorSnap.exists()) {
      throw new Error("Tutor not found");
    }

    const tutorData = tutorSnap.data() as TutorSchema;
    const updatedLevels = tutorData.teachingLevels.filter(
      (level) => level.level !== levelName
    );

    await updateDoc(tutorRef, {
      teachingLevels: updatedLevels,
    });
  } catch (error) {
    console.error("Error removing teaching level:", error);
    throw error;
  }
};

/**
 * Removes a specific subject from a specific teaching level.
 *
 * @param tutorId - UID of the tutor.
 * @param levelName - Name of the teaching level.
 * @param subject - Name of the subject to remove.
 * @returns A promise that resolves when the subject is removed.
 */
export const removeSubjectFromLevel = async (
  tutorId: string,
  levelName: string,
  subject: string
) => {
  try {
    const tutorRef = doc(db, "users", tutorId);
    const tutorSnap = await getDoc(tutorRef);

    if (!tutorSnap.exists()) {
      throw new Error("Tutor not found");
    }

    const tutorData = tutorSnap.data() as TutorSchema;
    const updatedLevels = tutorData.teachingLevels.map((level) => {
      if (level.level === levelName) {
        return {
          ...level,
          subjects: level.subjects.filter((subj) => subj !== subject),
        };
      }
      return level;
    });

    await updateDoc(tutorRef, {
      teachingLevels: updatedLevels,
    });
  } catch (error) {
    console.error("Error removing subject from teaching level:", error);
    throw error;
  }
};

/**
 * Deletes a chat document from the current user's Firestore collection.
 *
 * @param chat - The chat object containing metadata including the combined chat ID.
 * @param currentUser - The user performing the deletion (usually the current logged-in user).
 * @returns A promise that resolves when the chat document is deleted.
 */
export const deleteChat = async (chat: any, currentUser: any) => {
  await deleteDoc(
    doc(db, "userChats", currentUser.uid, "chats", chat.combinedId),
  );
};

/**
 * Sends a message between two users by creating or updating their chat documents.
 *
 * @param combinedId - Unique identifier representing the chat between the two users.
 * @param messageText - The text content of the message.
 * @param user - The recipient user object.
 * @param currentUser - The sender (current logged-in user).
 * @returns A promise that resolves when the message is stored for both sender and recipient.
 */
export const sendMessageTest = async (
  combinedId:any,
  messageText:any,
  user:any,
  currentUser:any,
) => {

  const senderDocRef = doc(db, 'userChats', currentUser.uid, 'chats', combinedId)
  const recieverDocRef = doc(db, 'userChats', user.uid, 'chats', combinedId)

  const senderDoc = await getDoc(senderDocRef)
  const recieverDoc = await getDoc(recieverDocRef)

  let messageObject = {
      id: uuid(),
      senderId: currentUser.uid,
      receiverId: user.uid,
      text: messageText,
      date: Timestamp.now(),
      seen: false,
  }

  if (!senderDoc.exists()) {
      await setDoc(senderDocRef, {
          combinedId: combinedId,
          timestamp: serverTimestamp(),
          lastMessage: messageText,
          isBlocked: false,
          blockedBy: null,
          userInfo: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
          },
          messages: [
              messageObject
          ],
      },)

  } else {
      await updateDoc(senderDocRef, {
          lastMessage: messageText,
          messages: arrayUnion(messageObject),
      })
  }

  if (!recieverDoc.exists()) {
      await setDoc(recieverDocRef, {
          combinedId: combinedId,
          timestamp: serverTimestamp(),
          lastMessage: messageText,
          isBlocked: false,
          blockedBy: null,
          userInfo: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
          },
          messages: [
              messageObject
          ],
      },)
  } else {
      await updateDoc(recieverDocRef, {
          lastMessage: messageText,
          messages: arrayUnion(messageObject),
      })
  }
}

/**
 * Updates the 'seen' flag of all messages where the current user is the receiver.
 * Optionally updates the chat documents for both users with the new message array.
 *
 * @param updatedMessages - Array of messages with updated seen statuses.
 * @param selectedChat - Chat object representing the currently opened conversation.
 * @param currentUser - The currently logged-in user.
 * @param newFetchedMessages - Freshly fetched messages to scan and mark as seen.
 * @returns A promise that resolves when the messages are updated in Firestore (if enabled).
 */
export const updateMessagesSeenValue = async (updatedMessages:any, selectedChat:any, currentUser:any, newFetchedMessages:any) => {
  const flag = false;
  if (flag) {
      // for each message in the array
      newFetchedMessages.forEach((messageObj:any) => {
          // only mark seen as true for those messages where i am the receiver
          // and the message has not been seen before
          if (messageObj.receiverId === currentUser.uid && !messageObj.seen) {
              messageObj.seen = true;
          }
      });

      try {
          await updateDoc(doc(db, "userChats", currentUser.uid, "chats", selectedChat.combinedId), {
              messages: updatedMessages,
          });

          await updateDoc(doc(db, "userChats", selectedChat.userInfo.uid, "chats", selectedChat.combinedId), {
              messages: updatedMessages,
          });
      } catch (error) {
          console.error(error);
      }
  }
};

/**
 * Generates a unique chat ID (combinedId) based on the UIDs of two users.
 * Ensures consistent ordering regardless of which user initiates the chat.
 *
 * @param currentUser - The currently logged-in user.
 * @param user - The other user in the chat.
 * @returns A string representing the unique combined ID for the chat.
 */
export const getCombinedId = (currentUser:any, user:any) => {
  if (currentUser.uid > user.uid) {
      return currentUser.uid + user.uid
  }
  else {
      return user.uid + currentUser.uid
  }
}



export const blockUser = async (currentUser:any, blockedUser:any) => {
  try {
      console.log("blocking code ran")
      const combinedId = getCombinedId(currentUser, blockedUser)
      const senderDocRef = doc(db, 'userChats', currentUser.uid, 'chats', combinedId)
      const recieverDocRef = doc(db, 'userChats', blockedUser.uid, 'chats', combinedId)

      await updateDoc(doc(db, 'users', currentUser.uid), {
          blockedUsers: arrayUnion(blockedUser.uid)
      })

      await updateDoc(senderDocRef, {
          isBlocked: true,
          blockedBy: currentUser.uid,
      })

      await updateDoc(recieverDocRef, {
          isBlocked: true,
          blockedBy: currentUser.uid,
      })
      console.log("blocked successfully")
      location.reload()
  } catch (error) {
      console.error(error)
  }
}

export const fetchUserDetails = async (user_id:any) => {
  try { 
    console.log("user = ", user_id)
    const docRef = await getDoc(doc(db, 'users', user_id))
    const userData = docRef.data();
  return userData
  } catch (error) {
    console.log(error);
  }
}

export const reportUser = async (report_reason:any, currentUser:any, reportedUser:any) => {
  try {
      console.log("reporting ran")
      const combinedId = getCombinedId(currentUser, reportedUser)
      const docRef = await getDoc(doc(db, 'users', reportedUser.uid))
      let newReportedCount = docRef.data()?.reportedCount
      newReportedCount++
      await updateDoc(doc(db, 'users', reportedUser.uid), {
          reportedCount: newReportedCount
      })
      // low, mid, high, extreme
      let threat_level = 'low';
      if (newReportedCount >= 20) {
          threat_level = 'extreme';
      } else if (newReportedCount >= 10) {
          threat_level = 'high';
      } else if (newReportedCount >= 5) {
          threat_level = 'mid';
      }
      await setDoc(doc(db, 'reports', combinedId), {
          reportedBy: currentUser.uid,
          reportedAgainst: reportedUser.uid,
          reason: report_reason,
          threatLevel: threat_level
      })
  } catch (error) {
    console.log("Error : ", error)
  }
}


export const unblockUser = async (currentUser:any, blockedUser:any) => {
  try {
      console.log("unblocking code ran")
      const combinedId = getCombinedId(currentUser, blockedUser)
      const senderDocRef = doc(db, 'userChats', currentUser.uid, 'chats', combinedId)
      const recieverDocRef = doc(db, 'userChats', blockedUser.uid, 'chats', combinedId)
      const docRef = await getDoc(doc(db, 'users', currentUser.uid))
      let blocked_users = docRef.data()?.blockedUsers;
      if (blocked_users.includes(blockedUser.uid)) {
          blocked_users = blocked_users.filter((user:any) => user !== blockedUser.uid)
          await updateDoc(doc(db, 'users', currentUser.uid), {
              blockedUsers: blocked_users
          })
          await updateDoc(senderDocRef, {
              isBlocked: false,
              blockedBy: null,
          })
          await updateDoc(recieverDocRef, {
              isBlocked: false,
              blockedBy: null,
          })
          location.reload()
          console.log("unblocking successful")
      }
  } catch (error) {
      console.error(error)
  }
}
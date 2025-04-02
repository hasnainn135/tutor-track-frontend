import {collection, DocumentData, getDocs, Query, query, where} from "@firebase/firestore";
import {auth, db} from "@/firebase/firebase";
import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {
    Reviews,
    Session,
    SessionNotes,
    StudentSchema,
    TutorSchema
} from "@/types/firebase";
import {createUserWithEmailAndPassword, sendEmailVerification, updateProfile} from "firebase/auth";
import {arrayUnion} from "@firebase/firestore/lite";

export const createTutor = async (email: string, pw: string, name: string, userType: "student" | "tutor"): Promise<void> => {
    try {
        const userCreds = await createUserWithEmailAndPassword(auth, email, pw);
        await updateProfile(userCreds.user, {displayName: name,});
        await sendEmailVerification(userCreds.user);
        const data: TutorSchema = {
            uid: userCreds.user.uid,
            role: userType,
            fullName: name,
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
        }
        await setDoc(doc(db, "users", userCreds.user.uid), data);
    } catch (e: any) {
        throw e;
    }
}

export const createStudent = async (email: string, pw: string, name: string, userType: "student" | "tutor"): Promise<void> => {
    try {
        const userCreds = await createUserWithEmailAndPassword(auth, email, pw);
        await updateProfile(userCreds.user, {displayName: name,});
        await sendEmailVerification(userCreds.user);
        const data: StudentSchema = {
            uid: userCreds.user.uid,
            role: userType,
            fullName: name,
            profilePicture: null,
            email: email,
            educationLevel: null,
            instituteName: null,
            about: null,
            createdAt: new Date(),
            city: null,
            country: null,
            myTutors: null,
        }
        await setDoc(doc(db, "users", userCreds.user.uid), data);
    } catch (e: any) {
        throw e;
    }
}

export const addUser = async (tutorId: string, studentId: string, chargesPerHour: number): Promise<void> => {
    const f1 = updateDoc(doc(db, "users", tutorId), {
        myStudents: arrayUnion({
            studentId,
            chargesPerHour,
        })
    });
    const f2 = updateDoc(doc(db, "users", studentId), {
        myTutors: arrayUnion({
            tutorId,
            chargesPerHour,
        })
    })
    await Promise.all([f1, f2]);
}

export const getTutors = async (): Promise<TutorSchema[]> => {
    try {
        const q = query(collection(db, "users"), where("role", "==", "tutor"));
        const qs = await getDocs(q);
        return qs.docs.map((doc => doc.data() as TutorSchema));
    } catch (e) {
        throw e;
    }
}

export const getStudents = async (): Promise<StudentSchema[]> => {
    try {
        const q = query(collection(db, "users"), where("role", "==", "student"));
        const qs = await getDocs(q);
        return qs.docs.map((doc => doc.data() as StudentSchema));
    } catch (e) {
        throw e;
    }
}

export const getMyTutors = async (studentId: string): Promise<TutorSchema[]> => {
    try {
        const q = query(collection(db, "users"), where("myStudentsId", "array-contains", studentId));
        const qs = await getDocs(q);
        return qs.docs.map((doc) => doc.data() as TutorSchema);
    } catch (e) {
        throw e;
    }

}

export const getTutorById = async (tutorId: string): Promise<TutorSchema> => {
    try {
        const ds = await getDoc(doc(db, "users", tutorId));
        return ds.data() as TutorSchema;
    } catch (e) {
        throw e;
    }
}

export const updateTutorDisplayCharges = async (tutorId: string, newAmount: number): Promise<void> => {
    try {
        const docRef = doc(db, "users", tutorId);
        await updateDoc(docRef, {
            displayChargesPerHour: newAmount,
        });
    } catch (e) {
        throw e;
    }
}


export const getMyStudents = async (tutorId: string): Promise<StudentSchema[]> => {
    try {
        const q = query(collection(db, "users"), where("myTutorsId", "array-contains", tutorId));
        const qs = await getDocs(q);
        return qs.docs.map((doc) => doc.data() as StudentSchema);
    } catch (e) {
        throw e;
    }
}

export const getStudentById = async (studentId: string): Promise<StudentSchema> => {
    try {
        const ds = await getDoc(doc(db, "users", studentId));
        return ds.data() as StudentSchema;
    } catch (e) {
        throw e;
    }
}

export const createSession = async (tutorId: string, studentId: string, duration: string, startTime: string, date: Date, additionalNotes: string, chargesPerHour: number): Promise<void> => {
    try {
        const combinedId: string = tutorId + studentId;
        const data: Session = {
            id: combinedId,
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
        };
        const docRef = doc(db, "sessions", combinedId)
        await setDoc(docRef, data);
    } catch (e) {
        throw e;
    }
}

export const addSessionNote = async (sessionId: string, senderId: string, receiverId: string, content: string): Promise<void> => {
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
        }
        await setDoc(docRef, note);
    } catch (e) {
        throw e;
    }
}

export const getSessions = async (userId: string, roleType: "student" | "tutor"): Promise<Session[]> => {
    try {
        let q: Query<DocumentData, DocumentData>;
        if (roleType === "student") {
            q = query(collection(db, "sessions"), where("studentId", "==", userId));
        } else {
            q = query(collection(db, "sessions"), where("tutorId", "==", userId));
        }
        const qs = await getDocs(q);
        return qs.docs.map((doc => doc.data() as Session));
    } catch (e) {
        throw e;
    }
}

export const getSessionNotes = async (sessionId: string): Promise<SessionNotes[]> => {
    try {
        const q = query(collection(db, "sessions", sessionId, "sessionNotes"));
        const qs = await getDocs(q);
        return qs.docs.map((doc) => doc.data() as SessionNotes);
    } catch (e) {
        throw e;
    }
}

export const cancelSession = async (sessionId: string): Promise<void> => {
    try {
        const docRef = doc(db, "sessions", sessionId);
        await updateDoc(docRef, {
            status: "canceled",
        });
    } catch (e) {
        throw e;
    }
}

export const updateSessionAttendance = async (sessionId: string, isAbsent: boolean, roleType: "student" | "tutor"): Promise<void> => {
    try {
        const docRef = doc(db, "sessions", sessionId);

        if (roleType === "student") {
            await updateDoc(docRef, {
                isStudentAbsent: isAbsent,
            })
        } else {
            await updateDoc(docRef, {
                isTutorAbsent: isAbsent,
            })
        }
    } catch (e) {
        throw e;
    }
}

export const addReview = async (studentId: string, studentName: string, studentPhotoURL: string, tutorId: string, rating: number, content: string): Promise<void> => {
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
        }
        await setDoc(docRef, data);
    } catch (e) {
        throw e;
    }
}

export const getAllReviews = async (tutorId: string): Promise<Reviews[]> => {
    try {
        const q = query(collection(db, "users", tutorId, "reviews"));
        const qs = await getDocs(q);
        return qs.docs.map((doc => doc.data() as Reviews));
    } catch (e) {
        throw e;
    }
}



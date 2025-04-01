import {collection, DocumentData, getDocs, Query, query, where} from "@firebase/firestore";
import {db} from "@/firebase/firebase";
import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {Session, SessionNotes, StudentSchema, TutorSchema} from "@/types/firebase";

const getTutors = async (): Promise<TutorSchema[]> => {
    try {
        const q = query(collection(db, "tutors"));
        const qs = await getDocs(q);
        return qs.docs.map((doc => doc.data() as TutorSchema));
    } catch (e) {
        throw e;
    }
}


const getMyTutors = async (studentId: string): Promise<TutorSchema[]> => {
    try {
        const q = query(collection(db, "tutors"), where("myStudentsId", "array-contains", studentId));
        const qs = await getDocs(q);
        return qs.docs.map((doc) => doc.data() as TutorSchema);
    } catch (e) {
        throw e;
    }

}

const getTutorById = async (tutorId: string): Promise<TutorSchema> => {
    try {
        const ds = await getDoc(doc(db, "tutors", tutorId));
        return ds.data() as TutorSchema;
    } catch (e) {
        throw e;
    }
}


const getMyStudents = async (tutorId: string): Promise<StudentSchema[]> => {
    try {
        const q = query(collection(db, "students"), where("myTutorsId", "array-contains", tutorId));
        const qs = await getDocs(q);
        return qs.docs.map((doc) => doc.data() as StudentSchema);
    } catch (e) {
        throw e;
    }
}

const getStudentById = async (studentId: string): Promise<StudentSchema> => {
    try {
        const ds = await getDoc(doc(db, "students", studentId));
        return ds.data() as StudentSchema;
    } catch (e) {
        throw e;
    }
}

const createSession = async (tutorId: string, studentId: string, duration: string, startTime: string, date: Date, additionalNotes: string): Promise<void> => {
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
        };
        const docRef = doc(db, "sessions", combinedId)
        await setDoc(docRef, data);
    } catch (e) {
        throw e;
    }
}

const addSessionNote = async (sessionId: string, senderId: string, receiverId: string, content: string): Promise<void> => {
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

const getSessions = async (userId: string, roleType: "student" | "tutor"): Promise<Session[]> => {
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

const getSessionNotes = async (sessionId: string): Promise<SessionNotes[]> => {
    try {
        const q = query(collection(db, "sessions", sessionId, "sessionNotes"));
        const qs = await getDocs(q);
        return qs.docs.map((doc) => doc.data() as SessionNotes);
    } catch (e) {
        throw e;
    }
}

const cancelSession = async (sessionId: string): Promise<void> => {
    try {
        const docRef = doc(db, "sessions", sessionId);
        await updateDoc(docRef, {
            status: "canceled",
        });
    } catch (e) {
        throw e;
    }
}

const updateSessionAttendance = async (sessionId: string, isAbsent: boolean, roleType: "student" | "tutor"): Promise<void> => {
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




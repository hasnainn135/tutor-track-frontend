import {collection, getDocs, query, where} from "@firebase/firestore";
import {db} from "@/firebase/firebase";
import {doc, getDoc} from "firebase/firestore";
import {StudentSchema, TutorSchema} from "@/types/firebase";

const getTutors = async ():Promise<TutorSchema[]> => {
    try {
        const q = query(collection(db, "tutors"));
        const qs = await getDocs(q);
        return qs.docs.map((doc => doc.data() as TutorSchema));
    } catch (e) {
        throw e;
    }
}


const getMyTutors = async (studentID: string):Promise<TutorSchema[]> => {
    try {
        const q = query(collection(db, "tutors"), where("myStudentsID", "array-contains", studentID));
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


const getMyStudents = async (tutorID: string): Promise<StudentSchema[]> => {
    try {
        const q = query(collection(db, "students"), where("myTutorsID", "array-contains", tutorID));
        const qs = await getDocs(q);
        return qs.docs.map((doc) => doc.data() as StudentSchema);
    } catch (e) {
        throw e;
    }
}

const getStudentById = async (studentID: string): Promise<StudentSchema> => {
    try {
        const ds = await getDoc(doc(db, "students", studentID));
        return ds.data() as StudentSchema;
    } catch (e) {
        throw e;
    }
}

const createSession = async (studentID: string, tutorID: string):Promise<void> => {
}

const getMySessions = async () => {
}

const cancelSession = async () => {
}

//marking student as absent or present
const updateStudentAttendance = async (tutorId: string, studentID: string): Promise<void> => {
}

//marking tutor as absent or present
const updateTutorAttendance = async (tutorId: string, studentID: string): Promise<void> => {
}

const getSessionNotes = async (sessionID: string) => {
}


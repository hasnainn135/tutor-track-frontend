import { createContext, useContext, useEffect, useState } from "react";
import { StudentType, TutorType } from "@/types/usertypes";

const stdID = "stu_1";
const tutorID = "t3";

type UsersContextType = {
  userType: "student" | "tutor";
  tutors: TutorType[];
  students: StudentType[];
  loggedInStudent: StudentType | null;
  loggedInTutor: TutorType | null;
  loading: boolean;
  error: string | null;
  getTutorById: (id: string) => Promise<TutorType | null>;
  getStudentById: (id: string) => Promise<StudentType | null>;
  fetchTutors: () => Promise<void>;
  fetchStudents: () => Promise<void>;
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({
  children,
  userType,
}: {
  children: React.ReactNode;
  userType: "student" | "tutor";
}) => {
  const [tutors, setTutors] = useState<TutorType[]>([]);
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loggedInStudent, setLoggedInStudent] = useState<StudentType | null>(
    null
  );
  const [loggedInTutor, setLoggedInTutor] = useState<TutorType | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/tutors.json");
      if (!response.ok) throw new Error("Failed to load data");
      const data: TutorType[] = await response.json();
      setTutors(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/students.json");
      if (!response.ok) throw new Error("Failed to load data");
      const data: StudentType[] = await response.json();
      setStudents(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getTutorById = async (id: string) => {
    return tutors.find((tutor) => tutor.id === id) || null;
  };

  const getStudentById = async (id: string) => {
    return students.find((student) => student.id === id) || null;
  };

  useEffect(() => {
    fetchTutors();
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchLoggedInStudent = async () => {
      const student = await getStudentById(stdID);
      setLoggedInStudent(student);
    };

    const fetchLoggedInTutor = async () => {
      const tutor = await getTutorById(tutorID);
      setLoggedInTutor(tutor);
    };

    if (userType === "student") fetchLoggedInStudent();
    else if (userType === "tutor") fetchLoggedInTutor();

    console.log("UE", loggedInTutor);
  }, [students, tutors]);

  return (
    <UsersContext.Provider
      value={{
        userType,
        tutors,
        students,
        loggedInStudent,
        loggedInTutor,
        loading,
        error,
        getTutorById,
        getStudentById,
        fetchTutors,
        fetchStudents,
      }}>
      {children}
    </UsersContext.Provider>
  );
};

// Custom Hook to Use Context
export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};

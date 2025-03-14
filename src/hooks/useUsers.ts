import { StudentType, TutorType } from "@/types/usertypes";
import { useState, useEffect } from "react";

// Custom hook to fetch user data
export const useUsers = () => {
  const [tutors, setTutors] = useState<TutorType[]>([]);
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loggedInStudent, setLoggedInStudent] = useState<StudentType | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  //FETCHES ALL TUTORS' DATA
  const fetchTutors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/tutors.json"); // Fetch from public folder
      if (!response.ok) {
        throw new Error("Failed to load data");
      }
      const data: TutorType[] = await response.json();
      setTutors(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  //FETCHES ALL STUDENTS' DATA
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/students.json"); // Fetch from public folder
      if (!response.ok) {
        throw new Error("Failed to load data");
      }
      const data: StudentType[] = await response.json();
      setStudents(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Function to get a tutor by ID
  const getTutorById = async (id: string) => {
    try {
      const response = await fetch("/tutors.json");
      if (!response.ok) {
        throw new Error("Failed to load data");
      }
      const data: TutorType[] = await response.json();
      return data.find((user) => user.id === id) || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Function to get a student by ID
  const getStudentById = async (id: string) => {
    try {
      const response = await fetch("/students.json");
      if (!response.ok) {
        throw new Error("Failed to load data");
      }
      const data: StudentType[] = await response.json();
      return data.find((user) => user.id === id) || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    // setLoggedInStudent(async () => getStudentById(""));
    fetchTutors();
    // fetchStudents();
  }, []);

  return {
    tutors,
    students,
    loggedInStudent,
    loading,
    error,
    getTutorById,
    getStudentById,
  };
};

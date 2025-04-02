import {MyStudents, Session, StudentSchema} from "@/types/firebase";

const getSessionsByMonth = (month:number, year:number, sessions:Session[]) => {};

const getSessionsByWeek = (week:number, month:number, year:number, sessions:Session[]) => {};

const getEarningsByMonth = (month:number, year:number, numberOfSessions:number, students:MyStudents[]) => {};

const getEarningsByWeek = (week:number, month:number, year:number, numberOfSessions:number, charges: number) => {};

const getMyTotalHoursByMonth = (month:number, year:number, sessions:Session[]) => {};

const getMyTotalHoursByWeek = (week:number, month:number, year:number, sessions:Session[]) => {};

const getNumberOfSessionsByMonth = (month:number, year:number, sessions:Session[]) => {};

const getNumberOfSessionsByWeek = (week:number, month:number, year:number, sessions:Session[]) => {};

const getActiveStudentsByMonth = (month:number, year:number, sessions:Session[], students:MyStudents[]) => {};

const getActiveStudentsByWeek = (week:number, month:number, year:number, sessions:Session[], students:MyStudents[]) => {};

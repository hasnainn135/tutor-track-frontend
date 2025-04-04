import {create} from "zustand";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
} from "firebase/auth";
import {auth, db} from "@/firebase/firebase";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {TutorSchema, StudentSchema} from "@/types/firebase";
import {createStudent, createTutor} from "@/utils/firestore";

interface AuthStateType {
    user: User | null;
    userData: StudentSchema | TutorSchema | null;
    authLoading: boolean;
    setUser: (user: User) => void;
    setUserData: (userData: StudentSchema | TutorSchema) => void;
    setAuthLoading: (authLoading: boolean) => void;
    setAuthState: (user: User | null, userData: StudentSchema | TutorSchema | null, authLoading: boolean) => void;
    signUp: (
        email: string,
        pw: string,
        name: string,
        userType: string,
    ) => Promise<void>;
    signIn: (
        email: string,
        pw: string,
    ) => Promise<{ user: User; userData: StudentSchema | TutorSchema }>;
    signOut: () => Promise<void>;
    sendEmailVerification: (user: User) => Promise<void>;
}

const useAuthState = create<AuthStateType>((set) => ({
    user: null,
    userData: null,
    authLoading: true,
    setUser: (user: User) => set(() => ({user: user})),
    setUserData: (userData) => set(() => ({userData: userData})),
    setAuthLoading: (authLoading) => set(() => ({authLoading: authLoading})),
    setAuthState: (user, userData, authLoading) => {
        set(() => ({
            user: user,
            userData: userData,
            authLoading: authLoading,
        }));
    },
    signUp: async (email, pw, name, userType) => {
        set(() => ({authLoading: true}));
        if (userType === "student") {
            await createStudent(email, pw, name);
        } else {
            await createTutor(email, pw, name);
        }
        set(() => ({authLoading: false}));
    },
    signIn: async (email, pw) => {
        try {
            set(() => ({authLoading: true}));
            const userCreds = await signInWithEmailAndPassword(auth, email, pw);
            const docRef = await getDoc(doc(db, "users", userCreds.user.uid));
            set(() => ({
                user: userCreds.user,
                userData: docRef.data() as StudentSchema | TutorSchema,
                authLoading: false,
            }));
            return {
                user: userCreds.user,
                userData: docRef.data() as StudentSchema | TutorSchema,
            };
        } catch (e: any) {
            set(() => ({authLoading: false}));
            throw e;
        }
    },
    signOut: async () => {
        try {
            set(() => ({authLoading: true}));
            await signOut(auth);
            set(() => ({user: null, userData: null, authLoading: false}));
        } catch (e: any) {
            set(() => ({authLoading: false}));
            throw e;
        }
    },
    sendEmailVerification: async (user: User) => {
        try {
            set(() => ({authLoading: true}));
            await sendEmailVerification(user);
            set(() => ({user: null, userData: null, authLoading: false}));
        } catch (e: any) {
            set(() => ({authLoading: false}));
            throw e;
        }
    },
}));

auth.onAuthStateChanged(async (user) => {
    const setAuthState = useAuthState.getState().setAuthState
    if (user) {
        console.log("user is authenticated");
        const docRef = await getDoc(doc(db, "users", user.uid));
        setAuthState(user, docRef.data() as StudentSchema | TutorSchema, false)
    } else {
        console.log("user is not authenticated");
        setAuthState(null, null, false)
    }
})

export default useAuthState;

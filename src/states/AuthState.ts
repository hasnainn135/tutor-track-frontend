import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  User
} from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const useAuthState = create((set) => ({
  user: null,
  userData: null,
  authLoading: true,
  setUser: (user:User) => set(() => ({ user: user })),
  setUserData: (userData:any) => set(() => ({ userData: userData })),
  setAuthLoading: (authLoading:boolean) => set(() => ({ authLoading: authLoading })),
  initAuth: () => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // console.log("user is authenticated");
        const docRef = await getDoc(doc(db, "users", user.uid));
        set(() => ({
          user: user,
          userData: docRef.data(),
          authLoading: false,
        }));
      } else {
        // console.log("user is not authenticated");
        set(() => ({
          user: null,
          userData: null,
          authLoading: false,
        }));
      }
    });

    return unsub;
  },
  signUp: async (email, pw, name, userType) => {
    try {
      set(() => ({ authLoading: true }));

      //register user
      const userCreds = await createUserWithEmailAndPassword(auth, email, pw);

      //update user auth information
      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      //send email verification
      await sendEmailVerification(auth.currentUser);

      //set user role
      let role;
      if (userType === "tutor") {
        role = process.env.NEXT_PUBLIC_TEACHER_ROLE_ID;
      } else {
        role = process.env.NEXT_PUBLIC_STUDENT_ROLE_ID;
      }

      //create user data in database
      await setDoc(doc(db, "users", userCreds.user.uid), {
        timestamp: new Date(),
        uid: userCreds.user.uid,
        full_name: name,
        email: email,
        photoURL: null,
        role_id: role,
      });

      set(() => ({ authLoading: false }));

      // set(() => ({ user: userCreds.user, userData: }));
    } catch (e) {
      console.error("error signing up:", e);
      set(() => ({ authLoading: false }));
    }
  },
  signIn: async (email, pw) => {
    try {
      set(() => ({ authLoading: true }));
      const userCreds = await signInWithEmailAndPassword(auth, email, pw);
      const docRef = await getDoc(doc(db, "users", userCreds.user.uid));
      set(() => ({
        user: userCreds.user,
        userData: docRef.data(),
        authLoading: false,
      }));
      console.log("USER ON FC= ", userCreds.user);
      console.log("USERDATA ON FC= ", docRef.data());
      return { user: userCreds.user, userData: docRef.data() };
    } catch (e) {
      console.error("error signing in:", e);
      set(() => ({ authLoading: false }));
      throw e;
    }
  },
  signOut: async () => {
    try {
      set(() => ({ authLoading: true }));
      await signOut(auth);
      set(() => ({ user: null, userData: null, authLoading: false }));
    } catch (e) {
      console.error("error signing out:", e);
      set(() => ({ authLoading: false }));
    }
  },
}));

export default useAuthState;

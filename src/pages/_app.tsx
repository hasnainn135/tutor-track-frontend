import StudentSidebar from "@/components/StudentSidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NavbarWrapper from "@/components/NavbarWrapper";
import useAuthState from "@/states/AuthState";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { listenToSessionChanges } from "@/utils/firestore";
import useTimerState from "@/states/TimerState";

export default function App({ Component, pageProps }: AppProps) {
  const { user, userData, authLoading } = useAuthState();

  const {
    syncTimer,
    sessionId,
    isRunning,
    paused,
    startTimer,
    stopTimer,
    resetTimer,
    pauseTimer,
    resumeTimer,
  } = useTimerState();

  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (user && userData) {
      if (router.pathname === "/" || router.pathname.includes("/auth")) {
        userData.role === "student"
          ? router.push("/student/dashboard")
          : router.push(`/tutor/dashboard`);
      }
      if (userData.role === "student" && router.pathname.includes("/tutor")) {
        router.push("/student/dashboard");
      }
      if (userData.role === "tutor" && router.pathname.includes("/student")) {
        router.push("/tutor/dashboard");
      }
    }
    if (!user || !userData) {
      if (router.pathname !== "/" && !router.pathname.includes("/auth"))
        router.push("/auth/login");
    }
  }, [user, userData, router]);

  useEffect(() => {
    if (!sessionId) return;

    console.log("APP USE EFFECT");

    const unsubscribe = listenToSessionChanges({
      sessionId,
      isRunning,
      onStart: (actualStartTime) => {
        if (!paused)
          if (actualStartTime) {
            console.log("ON START ACTUAL SYNC");
            // Sync timer when the user joins late
            syncTimer(actualStartTime);
          } else {
            console.log("ON START");
            startTimer();
          }
      },
      onEnd: () => {
        console.log("ON END");
        stopTimer();
        resetTimer();
      },
      onPause: () => {
        if (!paused) {
          console.log("ON PAUSE");
          pauseTimer();
        }
      },
      onResume: () => {
        if (paused) {
          console.log("ON RESUME");
          resumeTimer();
        }
      },
    });

    return () => unsubscribe();
  }, [sessionId, isRunning, syncTimer]);

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <StudentSidebar>
      <NavbarWrapper />
      <Component {...pageProps} />
    </StudentSidebar>
  );
}

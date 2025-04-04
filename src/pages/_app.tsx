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

  const { syncTimer, sessionId, isRunning, startTimer, stopTimer, resetTimer } =
    useTimerState();

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

    const unsubscribe = listenToSessionChanges({
      sessionId,
      isRunning,
      onStart: (actualStartTime) => {
        if (actualStartTime) {
          // Sync timer when the user joins late
          syncTimer(actualStartTime);
        } else {
          startTimer();
        }
      },
      onEnd: () => {
        stopTimer();
        resetTimer();
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

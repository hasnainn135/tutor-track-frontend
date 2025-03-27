import StudentSidebar from "@/components/StudentSidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NavbarWrapper from "@/components/NavbarWrapper";
import useAuthState from "@/states/AuthState";
import {useRouter} from "next/router";
import {useEffect} from "react";

export default function App({ Component, pageProps }: AppProps) {

    const {user, userData} = useAuthState();
    const router = useRouter();

    useEffect(() => {
        if (user && userData) {
            if (router.pathname === "/" || router.pathname.includes("/auth")) {
                userData?.role === "student" ? router.push("/student/dashboard") : router.push(`/tutor/dashboard`)
            }
        }

        if (!user || !userData) {
            if (router.pathname !== "/" && !router.pathname.includes("/auth")) router.push("/auth/login");
        }
    }, [user, userData, router]);

  return (
      <StudentSidebar>
        <NavbarWrapper/>
        <Component {...pageProps} />
      </StudentSidebar>
  );
}

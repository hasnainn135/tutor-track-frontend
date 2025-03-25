import StudentSidebar from "@/components/StudentSidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NavbarWrapper from "@/components/NavbarWrapper";

export default function App({ Component, pageProps }: AppProps) {
  return (
      <StudentSidebar>
        <NavbarWrapper/>
        <Component {...pageProps} />
      </StudentSidebar>
  );
}

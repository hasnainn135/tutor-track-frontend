import StudentSidebar from "@/components/StudentSidebar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {

  return (
      <StudentSidebar>
        <Navbar/>
        <Component {...pageProps} />
      </StudentSidebar>
  );
}

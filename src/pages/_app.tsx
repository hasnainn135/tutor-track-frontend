import StudentSidebar from "@/components/StudentSidebar";
import { UsersProvider } from "@/hooks/useUsers";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UsersProvider userType="tutor">
      <StudentSidebar>
        <Component {...pageProps} />
      </StudentSidebar>
    </UsersProvider>
  );
}

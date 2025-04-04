import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { RxCalendar } from "react-icons/rx";
import { RiSettings3Line } from "react-icons/ri";
import { PiUsersThree, PiGraduationCap } from "react-icons/pi";
import { MdLogout } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoAnalytics } from "react-icons/io5";
import { BsGrid1X2 } from "react-icons/bs";
import useAuthState from "@/states/AuthState";

type StudentSidebarProps = {
  children: React.ReactNode;
};

const StudentSidebar: FC<StudentSidebarProps> = ({ children }) => {
  const router = useRouter();
  const { user, userData, signOut } = useAuthState();
  const userType = userData?.role;

  // Define pages where the sidebar should be shown
  const pagesWithSidebar = [
    // student pages
    "/student/dashboard",
    "/student/sessions",
    "/student/my-tutors",
    "/student/find-tutors",
    "/student/book-a-session",
    "/student/add-tutor",
    // tutor pages
    "/tutor/dashboard",
    "/tutor/sessions",
    "/tutor/my-students",
    "/tutor/analytics",
    "/tutor/add-student",
    "/tutor/my-profile",
    //chat
    "/chat",
  ];

  const dynamicPagesWithSidebar = [
    /^\/student\/sessions\/[^/]+\/notes$/, // Matches /student/sessions/{sessionId}/notes
    /^\/tutor\/sessions\/[^/]+\/notes$/,
  ];

  const showSidebar =
    pagesWithSidebar.some((page) => router.pathname.startsWith(page)) ||
    dynamicPagesWithSidebar.some((regex) => regex.test(router.pathname));

  const studentLinks = [
    {
      href: "/student/dashboard",
      label: "Dashboard",
      icon: <BsGrid1X2 className="size-5" />,
    },
    {
      href: "/student/sessions",
      label: "Sessions",
      icon: <RxCalendar className="size-6" />,
    },
    {
      href: "/student/my-tutors",
      label: "My Tutors",
      icon: <PiUsersThree className="size-6" />,
    },
    {
      href: "/student/find-tutors",
      label: "Find Tutors",
      icon: <PiGraduationCap className="size-6" />,
    },
  ];
  const tutorLinks = [
    {
      href: "/tutor/dashboard",
      label: "Dashboard",
      icon: <BsGrid1X2 className="size-5" />,
    },
    {
      href: "/tutor/sessions",
      label: "Sessions",
      icon: <RxCalendar className="size-6" />,
    },
    {
      href: "/tutor/my-students",
      label: "My Students",
      icon: <PiUsersThree className="size-6" />,
    },
    {
      href: "/tutor/analytics",
      label: "Analytics",
      icon: <IoAnalytics className="size-6" />,
    },
  ];

  return (
    <div className={`${showSidebar ? "flex bg-[#E6E6E6]" : ""}`}>
      {showSidebar && (
        <aside className="bg-dark_green text-white min-h-svh relative w-80">
          <div className="h-svh px-7 py-9 flex flex-col gap-9 w-80 sticky top-0">
            <div className="">
              <img src="/imgs/TutorTrack.svg" alt="Tutor track logo" />
            </div>

            <div className="h-full flex-col flex justify-between">
              {/* TOP LINKS */}
              <div className="flex flex-col gap-2">
                {userType === "student" ? (
                  <>
                    {studentLinks.map((nav) => {
                      return (
                        <Link
                          key={nav.href}
                          href={nav.href}
                          className={`px-4 py-2 flex gap-2 items-center text-lg hover:bg-light_green/10 rounded-md w-full ${
                            router.pathname === nav.href
                              ? "bg-light_green/10 font-semibold"
                              : ""
                          }`}
                        >
                          {nav.icon}
                          {nav.label}
                        </Link>
                      );
                    })}
                  </>
                ) : userType === "tutor" ? (
                  <>
                    {tutorLinks.map((nav) => {
                      return (
                        <Link
                          key={nav.href}
                          href={nav.href}
                          className={`px-4 py-2 flex gap-4 items-center text-lg hover:bg-light_green/10 rounded-md w-full ${
                            router.pathname === nav.href
                              ? "bg-light_green/10 font-semibold"
                              : ""
                          }`}
                        >
                          {nav.icon}
                          {nav.label}
                        </Link>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </div>
              {/* BOTTOM LINKS */}
              <div className="flex flex-col">
                {userType === "student" ? (
                  <>
                    <Link
                      href={"/student/settings"}
                      className={`px-4 py-2 flex gap-2 items-center text-lg hover:bg-light_green/10 rounded-md w-full ${
                        router.pathname === "/student/settings"
                          ? "bg-light_green/10 font-semibold"
                          : ""
                      }`}
                    >
                      <RiSettings3Line className="size-5" />
                      Settings
                    </Link>
                  </>
                ) : userType === "tutor" ? (
                  <>
                    <Link
                      href={"/tutor/my-profile"}
                      className={`px-4 py-2 flex gap-2 items-center text-lg hover:bg-light_green/10 rounded-md w-full ${
                        router.pathname === "/tutor/my-profile"
                          ? "bg-light_green/10 font-semibold"
                          : ""
                      }`}
                    >
                      <FaRegCircleUser className="size-5" />
                      My Profile
                    </Link>
                    <Link
                      href={"/tutor/settings"}
                      className={`px-4 py-2 flex gap-2 items-center text-lg hover:bg-light_green/10 rounded-md w-full ${
                        router.pathname === "/tutor/settings"
                          ? "bg-light_green/10 font-semibold"
                          : ""
                      }`}
                    >
                      <RiSettings3Line className="size-5" />
                      Settings
                    </Link>
                  </>
                ) : (
                  <></>
                )}

                <Link
                  onClick={async () => await signOut()}
                  href={"/auth/login"}
                  className="px-4 py-2 flex gap-2 items-center text-lg hover:bg-light_green/10 rounded-md w-full"
                >
                  <MdLogout className="size-5" />
                  Log Out
                </Link>
              </div>
            </div>
          </div>
        </aside>
      )}

      <div className={`${showSidebar ? "py-9 px-10 w-full" : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default StudentSidebar;

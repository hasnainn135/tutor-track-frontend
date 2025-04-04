import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import { RxCalendar } from "react-icons/rx";
import { RiSettings3Line } from "react-icons/ri";
import { PiUsersThree, PiGraduationCap } from "react-icons/pi";
import { MdLogout } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoAnalytics } from "react-icons/io5";
import { BsGrid1X2 } from "react-icons/bs";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import useAuthState from "@/states/AuthState";
import { MdOutlineBook } from "react-icons/md";

type StudentSidebarProps = {
  children: React.ReactNode;
};

const StudentSidebar: FC<StudentSidebarProps> = ({ children }) => {
  const router = useRouter();
  const { user, userData, signOut } = useAuthState();
  const userType = userData?.role;
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const pagesWithSidebar = [
    "/student/dashboard",
    "/student/sessions",
    "/student/my-tutors",
    "/student/find-tutors",
    "/student/book-a-session",
    "/student/add-tutor",
    "/tutor/dashboard",
    "/tutor/sessions",
    "/tutor/my-students",
    "/tutor/analytics",
    "/tutor/add-student",
    "/tutor/my-profile",
    "/chat",
  ];

  const dynamicPagesWithSidebar = [
    /^\/student\/sessions\/[^/]+\/notes$/,
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
    {
      href: "/student/book-a-session",
      label: "Book a Session",
      icon: <MdOutlineBook className="size-6" />,
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

  const navLinks =
    userType === "student"
      ? studentLinks
      : userType === "tutor"
      ? tutorLinks
      : [];

  return (
    <div className={`${showSidebar ? "bg-[#E6E6E6] min-h-screen flex" : ""}`}>
      {/* Sidebar */}
      {showSidebar && (
        <>
          {/* Mobile Sidebar Overlay */}
          <div
            className={`lg:hidden fixed flex flex-col top-0 left-0 h-full w-64 bg-dark_green text-white z-50 transform transition-transform duration-300 ${
              isMobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-5 flex justify-between items-center border-b border-white/20">
              <img src="/imgs/TutorTrack.svg" alt="Logo" className="w-32 " />
              <IoClose
                className="text-white size-6 cursor-pointer"
                onClick={() => setIsMobileOpen(false)}
              />
            </div>

            <div className="px-6 py-4 flex flex-col justify-between h-full ">
              <div className="flex flex-col gap-2">
                {navLinks.map((nav) => (
                  <Link
                    key={nav.href}
                    href={nav.href}
                    className={`px-3 py-2 flex gap-3 items-center text-lg rounded-md hover:bg-light_green/10 ${
                      router.pathname === nav.href
                        ? "bg-light_green/10 font-semibold"
                        : ""
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {nav.icon}
                    {nav.label}
                  </Link>
                ))}
              </div>
              <div className=" flex flex-col gap-2">
                {userType === "student" ? (
                  <Link
                    href="/student/settings"
                    className={`px-3 py-2 flex gap-3 items-center text-lg rounded-md hover:bg-light_green/10 ${
                      router.pathname === "/student/settings"
                        ? "bg-light_green/10 font-semibold"
                        : ""
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <RiSettings3Line className="size-5" />
                    Settings
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/tutor/my-profile"
                      className={`px-3 py-2 flex gap-3 items-center text-lg rounded-md hover:bg-light_green/10 ${
                        router.pathname === "/tutor/my-profile"
                          ? "bg-light_green/10 font-semibold"
                          : ""
                      }`}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <FaRegCircleUser className="size-5" />
                      My Profile
                    </Link>
                    <Link
                      href="/tutor/settings"
                      className={`px-3 py-2 flex gap-3 items-center text-lg rounded-md hover:bg-light_green/10 ${
                        router.pathname === "/tutor/settings"
                          ? "bg-light_green/10 font-semibold"
                          : ""
                      }`}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <RiSettings3Line className="size-5" />
                      Settings
                    </Link>
                  </>
                )}

                <Link
                  onClick={async () => {
                    await signOut();
                    setIsMobileOpen(false);
                  }}
                  href="/auth/login"
                  className="px-3 py-2 flex gap-3 items-center text-lg rounded-md hover:bg-light_green/10"
                >
                  <MdLogout className="size-5" />
                  Log Out
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex bg-dark_green text-white min-h-screen w-80 sticky top-0">
            <div className="h-svh px-7 py-9 flex flex-col gap-9 w-80 sticky top-0">
              <img
                src="/imgs/TutorTrack.svg"
                alt="Tutor track logo"
                className="max-w-52 "
              />

              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-2">
                  {navLinks.map((nav) => (
                    <Link
                      key={nav.href}
                      href={nav.href}
                      className={`px-4 py-2 flex gap-3 items-center text-lg hover:bg-light_green/10 rounded-md ${
                        router.pathname === nav.href
                          ? "bg-light_green/10 font-semibold"
                          : ""
                      }`}
                    >
                      {nav.icon}
                      {nav.label}
                    </Link>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  {userType === "student" ? (
                    <Link
                      href="/student/settings"
                      className={`px-4 py-2 flex gap-3 items-center text-lg hover:bg-light_green/10 rounded-md ${
                        router.pathname === "/student/settings"
                          ? "bg-light_green/10 font-semibold"
                          : ""
                      }`}
                    >
                      <RiSettings3Line className="size-5" />
                      Settings
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/tutor/my-profile"
                        className={`px-4 py-2 flex gap-3 items-center text-lg hover:bg-light_green/10 rounded-md ${
                          router.pathname === "/tutor/my-profile"
                            ? "bg-light_green/10 font-semibold"
                            : ""
                        }`}
                      >
                        <FaRegCircleUser className="size-5" />
                        My Profile
                      </Link>
                      <Link
                        href="/tutor/settings"
                        className={`px-4 py-2 flex gap-3 items-center text-lg hover:bg-light_green/10 rounded-md ${
                          router.pathname === "/tutor/settings"
                            ? "bg-light_green/10 font-semibold"
                            : ""
                        }`}
                      >
                        <RiSettings3Line className="size-5" />
                        Settings
                      </Link>
                    </>
                  )}

                  <Link
                    onClick={async () => await signOut()}
                    href="/auth/login"
                    className="px-4 py-2 flex gap-3 items-center text-lg hover:bg-light_green/10 rounded-md"
                  >
                    <MdLogout className="size-5" />
                    Log Out
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full ">
        {/* Mobile Topbar */}
        {showSidebar && (
          <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white shadow-md sticky top-0 z-40">
            <button onClick={() => setIsMobileOpen(true)}>
              <HiMenu className="text-dark_green size-6" />
            </button>
            <img
              src="/imgs/TutorTrackBlack.svg"
              alt="Tutor track logo"
              className="w-28 "
            />
            <div className="w-6" /> {/* Empty space for balance */}
          </div>
        )}

        <div className={`${showSidebar ? "p-4 lg:p-10 bg-[#E6E6E6]" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;

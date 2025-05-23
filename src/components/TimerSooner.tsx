// import { useUsers } from "@/hooks/useUsers";
import useAuthState from "@/states/AuthState";
import useTimerState from "@/states/TimerState";
import { StudentSchema, TutorSchema } from "@/types/firebase";
import { getStudentById, getTutorById } from "@/utils/firestore";
import Image from "next/image";
import { FC, use, useEffect, useState } from "react";
import { FaExpandAlt } from "react-icons/fa";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import pfp2 from "@/assets/pfp2.png";
import Link from "next/link";

const TimerSooner: FC = () => {
  const { time, sessionId } = useTimerState();
  const { userData } = useAuthState();
  const [studnetOrTutor, setStudnetOrTutor] = useState<
    TutorSchema | StudentSchema
  >();

  return (
    <div className="shadow-[0_0px_4px_0px_#BABABA]   bg-white rounded-xl p-3 z-50">
      <h4 className="text-xs font-semibold">Ongoing Session</h4>
      <div className="flex items-center gap-4 pt-3">
        <div className="font-semibold text-2xl pb-1">{time}</div>

        <Link
          href={`/${
            userData?.role === "student" ? "student" : "tutor"
          }/sessions/${sessionId}/tracking`}
          className="border border-light_gray p-2 rounded-md"
        >
          <FaExpandAlt className="size-4" />
        </Link>
      </div>
    </div>
  );
};

export default TimerSooner;

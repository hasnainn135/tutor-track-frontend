import useTimerState from "@/states/TimerState";
import { useEffect, useState } from "react";

const Timer = () => {
  const { time } = useTimerState();

  return (
    <div className="text-center">
      <div className="md:text-5xl text-3xl font-semibold ">{time}</div>
      <div className="grid grid-cols-3 text-center font-medium text-light_gray text-sm">
        <div className="pr-6">hrs</div>
        <div className="">mins</div>
        <div className="pl-6">secs</div>
      </div>
    </div>
  );
};

export default Timer;

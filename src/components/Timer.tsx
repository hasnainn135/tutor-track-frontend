import { useUsers } from "@/hooks/useUsers";
import { useEffect, useState } from "react";

const Timer = ({
  start,
  count,
  setCount,
}: {
  start: boolean;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { time, setTime } = useUsers();

  function convertToMilliseconds(timeString: string) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600000 + minutes * 60000 + seconds * 1000;
  }

  let initTime = Date.now();

  const showTimer = (ms: number) => {
    // const milliseconds = Math.floor((ms % 1000) / 10)
    //   .toString()
    //   .padStart(2, "0");
    const second = Math.floor((ms / 1000) % 60)
      .toString()
      .padStart(2, "0");
    const minute = Math.floor((ms / 1000 / 60) % 60)
      .toString()
      .padStart(2, "0");
    const hour = Math.floor(ms / 1000 / 60 / 60)
      .toString()
      .padStart(2, "0");

    setTime(`${hour} : ${minute} : ${second}`);
  };

  //UPDATE COUNTER
  useEffect(() => {
    if (!start) return;

    const intervalId = setInterval(() => {
      const elapsedTime = convertToMilliseconds(time) + (Date.now() - initTime);

      console.log("TIMER TIME", elapsedTime);

      setCount(elapsedTime);
      showTimer(elapsedTime);

      if (elapsedTime <= 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [start, count]);

  return (
    <div className="text-center">
      <div className="text-5xl font-semibold ">{time}</div>
      <div className="grid grid-cols-3 text-center font-medium text-light_gray text-sm">
        <div className="pr-6">hrs</div>
        <div className="">mins</div>
        <div className="pl-6">secs</div>
      </div>
    </div>
  );
};

export default Timer;

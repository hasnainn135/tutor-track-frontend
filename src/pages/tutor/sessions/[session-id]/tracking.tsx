import { Button } from "@/components/ui/button";
import ContainerLayout from "@/pages/layouts/ContainerLayout";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Timer from "@/components/Timer";
import { useUsers } from "@/hooks/useUsers";
import { IoMdAdd } from "react-icons/io";
import { Notes } from "@/types/usertypes";

const TutorTracking: FC = () => {
  const { time, setTime } = useUsers();

  const [start, setStart] = useState<boolean>(false);
  const [pause, setPause] = useState<boolean>(false);
  const [note, setNote] = useState<string>();
  const [noteList, setNoteList] = useState<Notes[]>([]);
  const [count, setCount] = useState(0);

  const [disableStartButton, setDisableStartButton] = useState<boolean>(false);
  const [disableStatus, setDisableStatus] = useState<string | null>(null);
  const [wait, setWait] = useState<number>(30);

  const router = useRouter();
  const { "session-id": sessionId } = router.query;

  const handleStartStopSession = () => {
    setStart(!start);
    setPause(!start ? true : false);

    // Disable the "Start Session" button for 30s after it's clicked
    if (!start) {
      setDisableStartButton(true);
      // setWait(wait - 1);

      setTimeout(() => {
        setDisableStartButton(false);
        setDisableStatus(null);
      }, 0.5 * 60 * 1000);
    } else {
      setTime("00 : 00 : 00");
      setCount(0);
    }
  };

  useEffect(() => {
    console.log("time", time);
    if (time !== "00 : 00 : 00") {
      setStart(true);
      setPause(true);
    }
  }, [, time]);

  const addNote = () => {
    if (note) {
      const newNoteList = [...noteList];
      const newNote: Notes = {
        id: "n12",
        sender_type: "tutor",
        student_id: "s1",
        tutor_id: "t2",
        content: note,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };

      newNoteList.push(newNote);
      setNoteList(newNoteList);
      setNote("");
    }
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <ContainerLayout heading="Ongoing Session">
        <div className="flex flex-col items-center gap-3 w-fit mx-auto">
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm">Session Duration</p>
            <Select defaultValue={"auto"}>
              <SelectTrigger className="w-[200px] border border-primary_green text-center flex justify-center items-center text-primary_green font-medium text-md gap-2">
                <SelectValue placeholder="Select Timer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">2hrs 30mins</SelectItem>
                <SelectItem value="manual">Manual Timer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-40 flex items-center justify-end">
              <Button
                variant={"outline_green"}
                className="text-md"
                disabled={!start}
                onClick={() => {
                  setPause(!pause);
                }}
              >
                {pause ? (
                  <>
                    <IoMdPause />
                    Pause Session
                  </>
                ) : (
                  <>
                    <IoMdPlay />
                    Resume Session
                  </>
                )}
              </Button>
            </div>
            <div className="relative">
              {disableStartButton && (
                <div
                  className=" z-10 w-full h-full absolute rounded-full"
                  onClick={() => {
                    if (disableStartButton)
                      setDisableStatus(`Wait ${wait}s before Ending Session`);
                  }}
                ></div>
              )}
              <button
                onClick={() => {
                  handleStartStopSession();
                }}
                className="w-52 h-52 border-2 border-primary_green bg-light_green rounded-full text-xl font-semibold text-primary_green disabled:opacity-60"
                disabled={disableStartButton}
              >
                {start ? "End Session" : "Start Session"}
              </button>
            </div>
            <div className="flex items-center justify-start gap-2 w-40">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                <img src={""} alt="" className="object-cover h-12" />
              </div>
              <div className="text-lg">
                <p>{"Tony Stark"}</p>
              </div>
            </div>
          </div>
          {disableStatus && (
            <p className="text-xs text-red font-medium">{disableStatus}</p>
          )}
          <div className="">
            <Timer start={pause} count={count} setCount={setCount} />
          </div>
        </div>
      </ContainerLayout>
      <ContainerLayout heading="Notes">
        <div className="flex gap-3 items-center justify-between">
          <textarea
            value={note}
            onChange={(e) => setNote(e.currentTarget.value)}
            placeholder="Write Note"
            rows={1}
            className="resize-none border border-light_gray p-2 w-full rounded-md"
          ></textarea>
          <button
            className="grid place-content-center bg-primary_green text-white rounded-md flex-shrink-0 w-8 h-8"
            onClick={addNote}
          >
            <IoMdAdd className="size-5" />
          </button>
        </div>
        <div className="">
          {noteList?.map((note) => {
            return (
              <div
                key={note.id}
                className={`flex items-center py-2 text-sm gap-3  ${
                  note.sender_type === "student" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-slate-200`}
                >
                  <img src={" "} alt="" className="object-cover h-8" />
                </div>
                <p
                  className={`w-full  ${
                    note.sender_type === "student" ? "text-right" : ""
                  }`}
                >
                  {note.content}
                </p>
                <p className="text-xs flex-shrink-0 text-gray-400">
                  {note.time}
                </p>
              </div>
            );
          })}
        </div>
      </ContainerLayout>
    </div>
  );
};

export default TutorTracking;

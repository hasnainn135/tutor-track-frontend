import { Button } from "@/components/ui/button";
import ContainerLayout from "@/pages/layouts/ContainerLayout";
import useAuthState from "@/states/AuthState";
import { StudentSchema } from "@/types/firebase";
import { addUser, getStudents } from "@/utils/firestore";

import { FC, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/ui/loading-spinner";

const AddTutor: FC = () => {
  const [allstd, setAllStd] = useState<StudentSchema[]>([]);
  const { user } = useAuthState();
  const [searchVal, setSearchVal] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  
  useEffect(() => {
    const fetchStudents = async () => {
      const students = await getStudents();
      setAllStd(students);
      console.log("students", students);
    };

    fetchStudents();
  }, []);

  const handleButtonClick = async (tutorID:string, studentID:string) => {
    setIsLoading(true); 
    await addUser(tutorID, studentID, 500); //TUTOR'S PER HOUR CHARGES
    router.push("/tutor/my-students");
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <div className="h-[80vh] justify-center items-center flex flex-col gap-3">
      <LoadingSpinner/>
      </div>
    )
  }

  if (user)
    return (
      <div className="flex flex-col gap-3">
        <ContainerLayout>
          <div className="flex w-full justify-between items-center gap-3">
            <div className="w-full">
              <input
                value={searchVal}
                onChange={(e) => setSearchVal(e.currentTarget.value)}
                type="search"
                placeholder="Search by Email"
                className="border border-light_gray rounded-md w-full py-2 px-3"
              />
            </div>
            <div className="flex-shrink-0">
              <Button>
                <IoSearchOutline className="" />
                Find
              </Button>
            </div>
          </div>
        </ContainerLayout>

        <ContainerLayout heading="Add Student" margin="0">
          {allstd?.map((std) => {
            if (searchVal)
              if (std?.email?.toLowerCase().includes(searchVal.toLowerCase()))
                return (
                  <div
                    key={std.uid}
                    className="even:bg-light_green px-7 py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center justify-start gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200">
                        <img
                          src={std.profilePicture ?? undefined}
                          alt=""
                          className="object-cover h-9"
                        />
                      </div>
                      <div className="">
                        <p>{std.displayName}</p>
                        <p className="text-sm font-medium">{std.email}</p>
                      </div>
                    </div>
                    <Button
                      variant={"outline_green"}
                      onClick={async () => {
                        await handleButtonClick(user.uid, std.uid);
                      }}
                    >
                      Add Student
                    </Button>
                  </div>
                );
          })}
        </ContainerLayout>
      </div>
    );
};

export default AddTutor;

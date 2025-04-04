import { Button } from "@/components/ui/button";
import ContainerLayout from "@/pages/layouts/ContainerLayout";
import useAuthState from "@/states/AuthState";
import { TutorSchema } from "@/types/firebase";
import { addUser, getTutors } from "@/utils/firestore";

import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import pfp2 from "@/assets/pfp2.png";
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/ui/loading-spinner";

const AddTutor: FC = () => {
  const [alltutors, setAlltutors] = useState<TutorSchema[]>([]);
  const { user } = useAuthState();
  const [searchVal, setSearchVal] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTutors = async () => {
      const tutors = await getTutors();
      setAlltutors(tutors);
      console.log("tutors", tutors);
    };
    fetchTutors();
  }, []);

  const handleButtonClick = async (tutorID:string, studentID:string, displayChargesPerHour:number | null) => {
    setIsLoading(true); 
    const charges = displayChargesPerHour? displayChargesPerHour : 100;
    await addUser(tutorID, studentID, charges); //TUTOR'S PER HOUR CHARGES
    router.push("/student/my-tutors");
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
                type="search"
                value={searchVal}
                onChange={(e) => setSearchVal(e.currentTarget.value)}
                placeholder="Search by Email"
                className="border border-light_gray rounded-md w-full py-2 px-3"
              />
            </div>
            <div className="flex-shrink-0">
              <Button>
                <IoSearchOutline className="" />
                <p className="sm:block hidden">Find</p>
              </Button>
            </div>
          </div>
        </ContainerLayout>

        <ContainerLayout heading="Add Tutor" margin="0">
          {alltutors?.map((tutor) => {
            if (searchVal)
              if (tutor?.email?.toLowerCase().includes(searchVal.toLowerCase()))
                return (
                  <div
                    key={tutor.uid}
                    className="even:bg-light_green sm:px-7 px-4 py-3 flex items-center justify-between sm:text-base text-sm"
                  >
                    <div className="flex items-center justify-start gap-3">
                      <div className="flex-shrink-0 sm:w-9 sm:h-9 w-6 h-6 rounded-full overflow-hidden bg-slate-200">
                        <Image
                          src={tutor.profilePicture ?? pfp2}
                          alt=""
                          className="object-cover sm:h-9 h-6"
                        />
                      </div>
                      <div className=" overflow-hidden">
                        <p>{tutor.displayName}</p>
                        <p className="sm:text-sm text-xs font-medium">
                          {tutor.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      className="flex-shrink-0"
                      variant={"outline_green"}
                      onClick={async () => await handleButtonClick(tutor.uid, user.uid, tutor.displayChargesPerHour)}
                    >
                      <p className="sm:block hidden">Add Tutor</p>
                      <p className="sm:hidden block ">Add</p>
                    </Button>
                  </div>
                );
          })}
        </ContainerLayout>
      </div>
    );
};

export default AddTutor;

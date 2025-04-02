import { Button } from "@/components/ui/button";
import { db } from "@/firebase/firebase";
import ContainerLayout from "@/pages/layouts/ContainerLayout";
import { StudentSchema, TutorSchema } from "@/types/firebase";
import { getStudents, getTutors } from "@/utils/firestore";
import { log } from "console";
import { collection, getDocs } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

const AddTutor: FC = () => {
  const [alltutors, setAlltutors] = useState<TutorSchema[]>([]);

  useEffect(() => {
    const fetchTutors = async () => {
      const tutors = await getTutors();
      setAlltutors(tutors);
      console.log("tutors", tutors);
    };

    fetchTutors();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <ContainerLayout>
        <div className="flex w-full justify-between items-center gap-3">
          <div className="w-full">
            <input
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

      <ContainerLayout heading="Add Tutor" margin="0">
        {alltutors?.map((tutor) => {
          return (
            <div key={tutor.uid} className="">
              {tutor.fullName}
            </div>
          );
        })}
      </ContainerLayout>
    </div>
  );
};

export default AddTutor;

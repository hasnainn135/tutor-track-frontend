import { Button } from "@/components/ui/button";
import ContainerLayout from "@/pages/layouts/ContainerLayout";
import useAuthState from "@/states/AuthState";
import { TutorSchema } from "@/types/firebase";
import { addUser, getTutors } from "@/utils/firestore";
import { FC, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

const AddTutor: FC = () => {
  const [alltutors, setAlltutors] = useState<TutorSchema[]>([]);
  const { user, userData } = useAuthState();
  const [searchVal, setSearchVal] = useState<string>();

  useEffect(() => {
    const fetchTutors = async () => {
      const tutors = await getTutors();
      setAlltutors(tutors);
      console.log("tutors", tutors);
    };
    fetchTutors();
  }, []);

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
                Find
              </Button>
            </div>
          </div>
        </ContainerLayout>

        <ContainerLayout heading="Add Tutor" margin="0">
          <div className=""></div>
          {alltutors?.map((tutor) => {
            if (searchVal)
              if (tutor?.email?.toLowerCase().includes(searchVal.toLowerCase()))
                return (
                  <div
                    key={tutor.uid}
                    className="even:bg-light_green px-7 py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center justify-start gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200">
                        <img
                          src={tutor.profilePicture ?? undefined}
                          alt=""
                          className="object-cover h-9"
                        />
                      </div>
                      <div className="">
                        <p>{tutor.fullName}</p>
                        <p className="text-sm font-medium">{tutor.email}</p>
                      </div>
                    </div>
                    <Button
                      variant={"outline_green"}
                      onClick={() => addUser(tutor.uid, user.uid, 500)}
                    >
                      Add Tutor
                    </Button>
                  </div>
                );
          })}
        </ContainerLayout>
      </div>
    );
};

export default AddTutor;

import ContainerLayout from "@/pages/layouts/ContainerLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import DatePicker from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { getTutors } from "@/utils/firestore";
import { TutorSchema } from "@/types/firebase";
import { ca } from "date-fns/locale";
import LoadingSpinner from "@/components/ui/loading-spinner";
import pfp2 from "@/assets/pfp2.png";
import Image from "next/image";
import { IoLocationOutline, IoSearchOutline } from "react-icons/io5";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MdOutlineStarBorderPurple500,
  MdOutlineStarHalf,
  MdOutlineStarPurple500,
} from "react-icons/md";
import { set } from "date-fns";
import { FiFilter } from "react-icons/fi";

const eduLevels = [
  "Primary School",
  "Secondary School",
  "High School",
  "Undergraduate",
  "Postgraduate",
  "PhD",
];

const FindTutors = () => {
  const [allTutors, setAllTutors] = useState<TutorSchema[]>([]);
  const [tutorsBackup, setTutorsBackup] = useState<TutorSchema[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchVal, setSearchVal] = useState<string>("");
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [allSubjects, setAllSubjects] = useState<string[]>([]);
  const [toggleFilter, setToggleFilter] = useState<boolean>(false);

  const [tutorFilters, setTutorFilters] = useState<{
    country: string;
    yourLevelOfEdu: string;
    tutorsLevelOfEdu: string;
    subjects: string[];
    fromPrice: number;
    toPrice: number;
  }>({
    country: "",
    yourLevelOfEdu: "",
    tutorsLevelOfEdu: "",
    subjects: [],
    fromPrice: 0,
    toPrice: 0,
  });

  const handleFilterChanges = (
    field: keyof typeof tutorFilters,
    value: any
  ) => {
    const updatedFilters = {
      ...tutorFilters,
      [field]: value,
    };

    setTutorFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const applyFilters = (filters: typeof tutorFilters) => {
    const filtered = tutorsBackup.filter((tutor) => {
      // Filter by country
      if (
        filters.country &&
        filters.country !== "All" &&
        tutor.country !== filters.country
      ) {
        return false;
      }

      // Filter by yourLevelOfEdu (matching tutor's teachingLevels.level)
      if (
        filters.yourLevelOfEdu &&
        !tutor.teachingLevels?.some((level) =>
          level.level
            .toLowerCase()
            .includes(filters.yourLevelOfEdu.toLowerCase())
        )
      ) {
        return false;
      }

      // Filter by tutor's level of education (assuming `tutor.educationLevel`)
      if (
        filters.tutorsLevelOfEdu &&
        !tutor.educationLevel
          ?.toLowerCase()
          .includes(filters.tutorsLevelOfEdu.toLowerCase())
      ) {
        return false;
      }

      // Filter by subjects
      if (
        filters.subjects.length > 0 &&
        !filters.subjects.every((sub) =>
          tutor.teachingLevels?.some((level) => level.subjects.includes(sub))
        )
      ) {
        return false;
      }

      // Filter by price
      const price = tutor.displayChargesPerHour ?? 0;

      if (filters.fromPrice > 0 && price < filters.fromPrice) return false;
      if (filters.toPrice > 0 && price > filters.toPrice) return false;

      return true;
    });

    setAllTutors(filtered);
  };

  // Fetch all tutors when the component mounts
  useEffect(() => {
    setLoading(true);
    const fetchAllTutors = async () => {
      try {
        const tutors = await getTutors();
        setAllTutors(tutors);
        setTutorsBackup(tutors);
      } catch (error) {
        console.error("Error fetching tutors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTutors();
  }, []);

  const renderStars = (rating: number, size: number) => {
    // Calculate the number of full, half, and empty stars based on the rating
    const fullStars = Math.floor(rating); // Full stars (integer part)
    const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Half star (check if there is a 0.5 or higher remainder)
    const emptyStars = 5 - fullStars - halfStars; // Empty stars

    // Create an array of star components based on the calculated number of stars
    const stars = [
      ...Array(fullStars).fill(
        <MdOutlineStarPurple500 className={`size-${size}`} />
      ),
      ...Array(halfStars).fill(
        <MdOutlineStarHalf className={`size-${size}`} />
      ),
      ...Array(emptyStars).fill(
        <MdOutlineStarBorderPurple500 className={`size-${size}`} />
      ),
    ];

    return stars;
  };

  useEffect(() => {
    if (searchVal === "") {
      setAllTutors(tutorsBackup); // reset to original list
      return;
    }

    const filteredTutors = tutorsBackup.filter((tutor) => {
      const nameMatch = tutor.displayName
        ?.toLowerCase()
        .includes(searchVal.toLowerCase());

      const levelMatch = tutor.educationLevel
        ?.toLowerCase()
        .includes(searchVal.toLowerCase());

      return nameMatch || levelMatch;
    });

    setAllTutors(filteredTutors);
  }, [searchVal, tutorsBackup]);

  useEffect(() => {
    // Get all countries and from the tutors list
    const countries = new Set<string>();
    tutorsBackup.forEach((tutor) => {
      if (tutor.country) {
        countries.add(tutor.country);
      }
    });
    setAllCountries(Array.from(countries));

    // Get all subjects from the tutors list
    const subjects = new Set<string>();
    tutorsBackup.forEach((tutor) => {
      tutor.teachingLevels?.forEach((level) => {
        level.subjects.forEach((subject) => {
          subjects.add(subject);
        });
      });
    });
    setAllSubjects(Array.from(subjects));
  }, [tutorsBackup]);

  return (
    <div className="flex gap-5 h-full relative ">
      <div className="w-full">
        <div className="mb-3">
          <ContainerLayout>
            <div className="flex w-full justify-between items-center gap-3">
              <div className="w-full">
                <input
                  type="search"
                  value={searchVal}
                  onChange={(e) => {
                    setSearchVal(e.currentTarget.value);
                  }}
                  placeholder="Search by name or level"
                  className="border border-light_gray rounded-md w-full py-2 px-3"
                />
              </div>
              {/* <div className="flex-shrink-0">
                <Button>
                  <IoSearchOutline className="" />
                  <p className="sm:block hidden">Find</p>
                </Button>
              </div> */}
              <button
                className="xl:hidden block border p-3 border-light_gray rounded-md "
                onClick={() => setToggleFilter(true)}
              >
                <FiFilter className="" />
              </button>
            </div>
          </ContainerLayout>
        </div>
        <ContainerLayout>
          <div className="">
            {loading ? (
              <div className="flex justify-center w-full my-20">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-3">
                {allTutors.length <= 0
                  ? "No tutors found"
                  : allTutors?.map((tutor) => {
                      return (
                        <div
                          key={tutor.uid}
                          className="border border-light_gray/50 bg-[#FBFBFB] rounded-lg p-4 sm:flex justify-between gap-3"
                        >
                          <div className="flex flex-col gap-3">
                            <div className="flex sm:items-center gap-3">
                              <div className="flex-shrink-0 sm:w-20 sm:h-20 w-12 h-12 rounded-lg overflow-hidden">
                                <Image
                                  src={tutor.profilePicture ?? pfp2}
                                  alt=""
                                  className="object-cover sm:h-20 h-12 w-full"
                                />
                              </div>

                              <div className=" ">
                                <p className=" font-medium">
                                  {tutor?.displayName}
                                </p>
                                <p className="">
                                  <span className="text-sm font-semibold">
                                    {tutor?.educationLevel}
                                  </span>{" "}
                                  from{" "}
                                  <span className=" font-semibold text-primary_green">
                                    {tutor.instituteName}
                                  </span>
                                </p>
                                <p className="sm:block hidden">
                                  Experience{" "}
                                  <span className="text-sm font-semibold text-primary_green">
                                    {tutor?.yearsOfExperience}
                                  </span>{" "}
                                  years
                                </p>
                              </div>
                            </div>
                            <div className="sm:hidden block">
                              <p className="">
                                Experience{" "}
                                <span className="text-sm font-semibold text-primary_green">
                                  {tutor?.yearsOfExperience}
                                </span>{" "}
                                years
                              </p>
                            </div>
                            <p className="line-clamp-4">{tutor?.about}</p>
                          </div>
                          <div className="flex flex-col sm:w-fit w-full  items-end sm:pt-0 pt-5  gap-1">
                            <div className="text-2xl font-semibold">
                              <span>£{tutor.displayChargesPerHour}</span>
                              <span className="font-bold text-light_gray">
                                {" "}
                                /hour
                              </span>
                            </div>
                            {tutor?.overallRating && (
                              <div className=" font-medium text-gold flex items-center gap-2">
                                {tutor?.overallRating}
                                <div className="flex items-center gap-1">
                                  {renderStars(tutor?.overallRating, 5)}
                                </div>
                              </div>
                            )}
                            {tutor.totalStudentsTaught && (
                              <div className="font-medium text-xl">
                                <span className="text-primary_green font-bold">
                                  {tutor.totalStudentsTaught < 10
                                    ? tutor.totalStudentsTaught
                                    : Math.floor(
                                        tutor.totalStudentsTaught / 10
                                      ) *
                                        10 +
                                      "+"}
                                </span>{" "}
                                Students Taught
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <IoLocationOutline className="size-5" />{" "}
                              {tutor.city}, {tutor.country}
                            </div>
                            <div className="flex flex-col gap-2 sm:w-40 w-full py-2">
                              <Link
                                href={`/student/find-tutors/${tutor.uid}`}
                                className=""
                              >
                                <Button className="w-full">View Profile</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
              </div>
            )}
          </div>
        </ContainerLayout>
      </div>
      <div className="xl:block hidden w-96 h-fit">
        <ContainerLayout>
          {/* HEADING AND CLEAR BTN */}
          <div className="flex items-center w-full justify-between">
            <div className="font-semibold text-xl">Filters</div>
            <button
              onClick={() => {
                const reset = {
                  country: "",
                  yourLevelOfEdu: "",
                  tutorsLevelOfEdu: "",
                  subjects: [],
                  fromPrice: 0,
                  toPrice: 0,
                };
                setTutorFilters(reset);
                setAllTutors(tutorsBackup); // show all tutors again
              }}
              className="text-sm text-bright_green flex items-center gap-1.5 pt-1"
            >
              <span>Clear all</span>
              <span className="border border-bright_green rounded-full p-0.5">
                <RxCross2 className="size-2.5" />
              </span>
            </button>
          </div>
          {/* FILTERS */}
          <form
            action="#"
            className="pt-4 flex flex-col items-center gap-3 w-full filter_form"
          >
            {/* country */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="country" className="text-sm">
                Country
              </label>
              <Select
                value={tutorFilters.country}
                onValueChange={(value) => {
                  handleFilterChanges("country", value);
                }}
              >
                <SelectTrigger id="country" className="w-full ">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"All"}>All</SelectItem>
                  {allCountries.map((country) => {
                    return (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            {/* yourLevelOfEdu  */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="yourLevelOfEdu" className="text-sm">
                Your Level of Education
              </label>
              <Select
                value={tutorFilters.yourLevelOfEdu}
                onValueChange={(value) => {
                  handleFilterChanges("yourLevelOfEdu", value);
                }}
              >
                <SelectTrigger id="yourLevelOfEdu" className="w-full ">
                  <SelectValue placeholder="Select Education Level" />
                </SelectTrigger>
                <SelectContent>
                  {eduLevels.map((level) => {
                    return (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Subjects */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="subjects" className="text-sm">
                Subjects
              </label>
              <Select
                value=""
                onValueChange={(value) => {
                  const addSub = [...tutorFilters.subjects];
                  if (!addSub.includes(value)) {
                    addSub.push(value);
                    handleFilterChanges("subjects", addSub);
                  }
                }}
              >
                <SelectTrigger id="subjects" className="w-full">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {allSubjects.map((subject) => {
                    return (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap w-full gap-1 font-medium text-xs">
                {tutorFilters.subjects.map((subject) => {
                  return (
                    <div
                      key={subject}
                      className="flex items-center gap-2 bg-primary_green py-1.5 px-3 rounded-md text-white"
                    >
                      <p>{subject}</p>
                      <button
                        className="font-semibold mt-[1px] hover:text-rose-500"
                        onClick={() => {
                          const removeSub = [...tutorFilters.subjects];

                          removeSub.splice(removeSub.indexOf(subject), 1);
                          handleFilterChanges("subjects", removeSub);
                        }}
                      >
                        &#10005;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm">Price Range</label>
              <div className="w-full flex justify-between items-center gap-2">
                <Input
                  onChange={(e) =>
                    handleFilterChanges("fromPrice", e.currentTarget.value)
                  }
                  type="number"
                  min={0}
                  value={tutorFilters.fromPrice}
                  placeholder="Min (30 m)"
                  className="border-neutral-200 w-full"
                />
                <div className="text-2xl pb-1 text-neutral-400 font-extralight">
                  &#10230;
                </div>
                <Input
                  onChange={(e) =>
                    handleFilterChanges("toPrice", e.currentTarget.value)
                  }
                  type="number"
                  min={tutorFilters.fromPrice}
                  value={tutorFilters.toPrice}
                  placeholder="Max (2h 30m)"
                  className="border-neutral-200 w-full"
                />
              </div>
            </div>
            {/* tutorsLevelOfEdu  */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="tutorsLevelOfEdu" className="text-sm">
                Tutor's Level of Education
              </label>
              <Select
                value={tutorFilters.tutorsLevelOfEdu}
                onValueChange={(value) => {
                  handleFilterChanges("tutorsLevelOfEdu", value);
                }}
              >
                <SelectTrigger id="tutorsLevelOfEdu" className="w-full ">
                  <SelectValue placeholder="Select Education Level" />
                </SelectTrigger>
                <SelectContent>
                  {eduLevels.map((level) => {
                    return (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </form>
        </ContainerLayout>
      </div>
      {/* Mobile Filters */}
      <div
        className={`rounded-lg xl:hidden block absolute duration-500 shadow-xl sm:w-96 w-full h-fit ${
          toggleFilter ? "right-0" : "-right-[200%]"
        }`}
      >
        <ContainerLayout>
          {/* HEADING AND CLEAR BTN */}
          <div className="flex items-center w-full justify-between">
            <div className="font-semibold text-xl">Filters</div>
            <button
              onClick={() => {
                setToggleFilter(false);
              }}
              className="text-sm text-dark_gray flex items-center gap-1.5 pt-1"
            >
              <span className="border border-dark_gray rounded-lg p-1.5">
                <RxCross2 className="size-4" />
              </span>
            </button>
          </div>
          <div className=" pt-2">
            <button
              onClick={() => {
                const reset = {
                  country: "",
                  yourLevelOfEdu: "",
                  tutorsLevelOfEdu: "",
                  subjects: [],
                  fromPrice: 0,
                  toPrice: 0,
                };
                setTutorFilters(reset);
                setAllTutors(tutorsBackup); // show all tutors again
              }}
              className="text-sm text-bright_green flex items-center gap-1.5 pt-1"
            >
              <span>Clear all</span>
              <span className="border border-bright_green rounded-full p-0.5">
                <RxCross2 className="size-2.5" />
              </span>
            </button>
          </div>
          {/* FILTERS */}
          <form
            action="#"
            className="pt-4 flex flex-col items-center gap-3 w-full filter_form"
          >
            {/* country */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="country" className="text-sm">
                Country
              </label>
              <Select
                value={tutorFilters.country}
                onValueChange={(value) => {
                  handleFilterChanges("country", value);
                }}
              >
                <SelectTrigger id="country" className="w-full ">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"All"}>All</SelectItem>
                  {allCountries.map((country) => {
                    return (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            {/* yourLevelOfEdu  */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="yourLevelOfEdu" className="text-sm">
                Your Level of Education
              </label>
              <Select
                value={tutorFilters.yourLevelOfEdu}
                onValueChange={(value) => {
                  handleFilterChanges("yourLevelOfEdu", value);
                }}
              >
                <SelectTrigger id="yourLevelOfEdu" className="w-full ">
                  <SelectValue placeholder="Select Education Level" />
                </SelectTrigger>
                <SelectContent>
                  {eduLevels.map((level) => {
                    return (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Subjects */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="subjects" className="text-sm">
                Subjects
              </label>
              <Select
                value=""
                onValueChange={(value) => {
                  const addSub = [...tutorFilters.subjects];
                  if (!addSub.includes(value)) {
                    addSub.push(value);
                    handleFilterChanges("subjects", addSub);
                  }
                }}
              >
                <SelectTrigger id="subjects" className="w-full">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {allSubjects.map((subject) => {
                    return (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap w-full gap-1 font-medium text-xs">
                {tutorFilters.subjects.map((subject) => {
                  return (
                    <div
                      key={subject}
                      className="flex items-center gap-2 bg-primary_green py-1.5 px-3 rounded-md text-white"
                    >
                      <p>{subject}</p>
                      <button
                        className="font-semibold mt-[1px] hover:text-rose-500"
                        onClick={() => {
                          const removeSub = [...tutorFilters.subjects];

                          removeSub.splice(removeSub.indexOf(subject), 1);
                          handleFilterChanges("subjects", removeSub);
                        }}
                      >
                        &#10005;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm">Price Range</label>
              <div className="w-full flex justify-between items-center gap-2">
                <Input
                  onChange={(e) =>
                    handleFilterChanges("fromPrice", e.currentTarget.value)
                  }
                  type="number"
                  min={0}
                  value={tutorFilters.fromPrice}
                  placeholder="Min (30 m)"
                  className="border-neutral-200 w-full"
                />
                <div className="text-2xl pb-1 text-neutral-400 font-extralight">
                  &#10230;
                </div>
                <Input
                  onChange={(e) =>
                    handleFilterChanges("toPrice", e.currentTarget.value)
                  }
                  type="number"
                  min={tutorFilters.fromPrice}
                  value={tutorFilters.toPrice}
                  placeholder="Max (2h 30m)"
                  className="border-neutral-200 w-full"
                />
              </div>
            </div>
            {/* tutorsLevelOfEdu  */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="tutorsLevelOfEdu" className="text-sm">
                Tutor's Level of Education
              </label>
              <Select
                value={tutorFilters.tutorsLevelOfEdu}
                onValueChange={(value) => {
                  handleFilterChanges("tutorsLevelOfEdu", value);
                }}
              >
                <SelectTrigger id="tutorsLevelOfEdu" className="w-full ">
                  <SelectValue placeholder="Select Education Level" />
                </SelectTrigger>
                <SelectContent>
                  {eduLevels.map((level) => {
                    return (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </form>
        </ContainerLayout>
      </div>
    </div>
  );
};

export default FindTutors;

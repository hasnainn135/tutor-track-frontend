import React from "react";
import ContainerLayout from "../layouts/ContainerLayout";
import { Chart } from "@/components/Chart";

const students = [
  {
    id: "s1",
    name: "John Doe",
    pfp: " ",
    hours: "15hrs 34mins",
    earnings: "$200",
  },
  {
    id: "s2",
    name: "Jane Smith",
    pfp: " ",
    hours: "10hrs 12mins",
    earnings: "$150",
  },
  {
    id: "s3",
    name: "Alice Johnson",
    pfp: " ",
    hours: "8hrs 45mins",
    earnings: "$120",
  },
  {
    id: "s4",
    name: "Bob Brown",
    pfp: " ",
    hours: "5hrs 20mins",
    earnings: "$80",
  },
  {
    id: "s5",
    name: "Charlie Davis",
    pfp: " ",
    hours: "3hrs 15mins",
    earnings: "$50",
  },
];

const Analytics = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <ContainerLayout>
          <div className="font-medium flex flex-col justify-between">
            <p>
              Total Earnings <span className="text-light_gray">This Month</span>
            </p>
            <p className="text-3xl font-bold text-primary_green">$603.98</p>
          </div>
        </ContainerLayout>
        <ContainerLayout>
          <div className="font-medium flex flex-col justify-between">
            <p>
              Total Hours <span className="text-light_gray">This Month</span>
            </p>
            <p className="text-3xl font-bold ">105hr : 26mins</p>
          </div>
        </ContainerLayout>
        <ContainerLayout>
          <div className="font-medium flex flex-col justify-between">
            <p>
              Total Sessions <span className="text-light_gray">This Month</span>
            </p>
            <p className="text-3xl font-bold ">56</p>
          </div>
        </ContainerLayout>
        <ContainerLayout>
          <div className="font-medium flex flex-col justify-between">
            <p>
              Active Students{" "}
              <span className="text-light_gray">This Month</span>
            </p>
            <p className="text-3xl font-bold ">12</p>
          </div>
        </ContainerLayout>
      </div>
      <ContainerLayout heading="Earnings">
        <div className="">
          <Chart />
        </div>
      </ContainerLayout>
      <ContainerLayout heading="Earnings per Student" margin="0">
        <div className="">
          <div className="my-3 px-5 text-light_gray font-medium grid grid-cols-3">
            <p>Students</p>
            <p className="text-center">Total Hours</p>
            <p className="text-right">Earnings</p>
          </div>
          {students.map((student) => {
            return (
              <div
                key={student.id}
                className="grid grid-cols-3 items-center even:bg-light_green px-5 py-3"
              >
                <div className="flex items-center gap-3 ">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                    <img src={student.pfp} alt="" className="object-cover" />
                  </div>
                  <p>{student.name}</p>
                </div>
                <p className="text-center font-semibold">{student.hours}</p>
                <p className="text-right text-primary_green font-semibold">
                  {student.earnings}
                </p>
              </div>
            );
          })}
        </div>
      </ContainerLayout>
    </div>
  );
};

export default Analytics;

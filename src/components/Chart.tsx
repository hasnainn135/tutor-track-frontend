"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { day: "1", earnings: 186 },
  { day: "2", earnings: 305 },
  { day: "3", earnings: 237 },
  { day: "4", earnings: 73 },
  { day: "5", earnings: 209 },
  { day: "6", earnings: 214 },
  { day: "7", earnings: 186 },
  { day: "8", earnings: 305 },
  { day: "9", earnings: 237 },
  { day: "10", earnings: 73 },
  { day: "11", earnings: 209 },
  { day: "12", earnings: 214 },
  { day: "13", earnings: 237 },
  { day: "14", earnings: 73 },
  { day: "15", earnings: 209 },
  { day: "16", earnings: 214 },
  { day: "17", earnings: 186 },
  { day: "18", earnings: 305 },
  { day: "19", earnings: 237 },
  { day: "20", earnings: 73 },
  { day: "21", earnings: 209 },
  { day: "22", earnings: 214 },
  { day: "23", earnings: 237 },
  { day: "24", earnings: 73 },
  { day: "25", earnings: 209 },
  { day: "26", earnings: 0 },
  { day: "27", earnings: 0 },
  { day: "28", earnings: 0 },
  { day: "29", earnings: 0 },
  { day: "30", earnings: 0 },
  { day: "31", earnings: 0 },
];

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "#DEDEDE",
  },
} satisfies ChartConfig;

export function Chart() {
  return (
    <Card className="border-none p-0 m-0 shadow-none">
      {/* <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent className="bg-white border border-light_gray" />
              }
            />
            <Bar
              dataKey="earnings"
              fill="var(--color-earnings)"
              radius={4}
              className="hover:fill-primary_green duration-100"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}

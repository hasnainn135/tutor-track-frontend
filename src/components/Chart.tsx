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

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "#DEDEDE",
  },
} satisfies ChartConfig;

export function Chart({ data }: { data: { day: string; earnings: number }[] }) {
  return (
    <Card className="border-none p-0 m-0 shadow-none">
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
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
    </Card>
  );
}

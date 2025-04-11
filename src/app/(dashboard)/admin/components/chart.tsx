"use client";

import {
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Zap,
  Activity,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
  Line,
  LineChart,
} from "recharts";
import { motion } from "framer-motion";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const chartDataOne = [
  { month: "January", desktop: 186, mobile: 120 },
  { month: "February", desktop: 305, mobile: 180 },
  { month: "March", desktop: 237, mobile: 190 },
  { month: "April", desktop: 73, mobile: 110 },
  { month: "May", desktop: 209, mobile: 140 },
  { month: "June", desktop: 214, mobile: 170 },
];

const chartConfigOne = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ChartOne() {
  const [selectedPeriod, setSelectedPeriod] = React.useState("6m");
  const [chartType, setChartType] = React.useState("bar");

  const getChartComponent = () => {
    switch (chartType) {
      case "area":
        return (
          <AreaChart
            data={chartDataOne}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradientDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="gradientMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.2}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="desktop"
              stroke="hsl(var(--chart-1))"
              fillOpacity={1}
              fill="url(#gradientDesktop)"
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="mobile"
              stroke="hsl(var(--chart-2))"
              fillOpacity={1}
              fill="url(#gradientMobile)"
              animationDuration={1000}
            />
          </AreaChart>
        );
      case "line":
        return (
          <LineChart
            data={chartDataOne}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.2}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="desktop"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1000}
            />
            <Line
              type="monotone"
              dataKey="mobile"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1000}
            />
          </LineChart>
        );
      default:
        return (
          <BarChart
            data={chartDataOne}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.2}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="desktop"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
            <Bar
              dataKey="mobile"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        );
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="h-full"
    >
      <Card className="border-none h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-medium">
              Platform Traffic
            </CardTitle>
            <CardDescription>
              Comparing desktop vs mobile traffic
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Tabs
              defaultValue="bar"
              value={chartType}
              onValueChange={setChartType}
            >
              <TabsList className="h-8 p-1">
                <TabsTrigger value="bar" className="text-xs px-2 py-0 h-6">
                  Bar
                </TabsTrigger>
                <TabsTrigger value="line" className="text-xs px-2 py-0 h-6">
                  Line
                </TabsTrigger>
                <TabsTrigger value="area" className="text-xs px-2 py-0 h-6">
                  Area
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Select
              defaultValue="6m"
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger className="h-8 w-20 text-xs">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="p-6">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-1))]" />
                  <span className="text-xs text-muted-foreground">Desktop</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-2))]" />
                  <span className="text-xs text-muted-foreground">Mobile</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className="text-xs bg-muted/50 py-0 h-6 gap-1"
                >
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">+12.5%</span>
                </Badge>
              </div>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {getChartComponent()}
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground px-6 py-4"></CardFooter>
      </Card>
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border rounded-lg shadow-md">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs">{item.name}: </span>
            <span className="text-xs font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

const chartDataTwo = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];

const chartConfigTwo = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ChartTwo() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfigTwo>("desktop");
  const [timeRange, setTimeRange] = React.useState("3m");

  const total = React.useMemo(
    () => ({
      desktop: chartDataTwo.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartDataTwo.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  );

  // Limited data for performance
  const visibleData = React.useMemo(() => {
    switch (timeRange) {
      case "1m":
        return chartDataTwo.slice(0, 30);
      case "2m":
        return chartDataTwo.slice(0, 60);
      default:
        return chartDataTwo;
    }
  }, [timeRange]);

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <Card className="border-none overflow-hidden">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Traffic Analytics</CardTitle>
                <CardDescription>
                  Visitor data for the last quarter
                </CardDescription>
              </div>
              <div className="hidden sm:block">
                <Select
                  defaultValue="3m"
                  value={timeRange}
                  onValueChange={setTimeRange}
                >
                  <SelectTrigger className="h-8 w-24 text-xs">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 Month</SelectItem>
                    <SelectItem value="2m">2 Months</SelectItem>
                    <SelectItem value="3m">3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex">
            {["desktop", "mobile"].map((key) => {
              const chart = key as keyof typeof chartConfigTwo;
              return (
                <motion.button
                  key={chart}
                  data-active={activeChart === chart}
                  className="group relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                  whileTap={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfigTwo[chart].label}
                  </span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold leading-none sm:text-3xl">
                      {total[key as keyof typeof total].toLocaleString()}
                    </span>
                    <span className="ml-2 flex items-center text-xs text-green-500">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                      5.2%
                    </span>
                  </div>
                  {activeChart === chart && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
                      layoutId="activeIndicator"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 py-6 sm:p-6">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={visibleData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  opacity={0.2}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background p-3 border rounded-lg shadow-md">
                          <p className="font-medium mb-1 text-xs">
                            {new Date(label).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: payload[0].color }}
                            />
                            <span className="text-xs">
                              {activeChart === "desktop" ? "Desktop" : "Mobile"}
                              :{" "}
                            </span>
                            <span className="text-xs font-medium">
                              {payload[0].value}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey={activeChart}
                  fill={`var(--color-${activeChart})`}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <Activity className="h-3 w-3 mr-1" />
            <span>
              {activeChart === "desktop" ? "Desktop" : "Mobile"} traffic is up
              <span className="text-green-500 ml-1 font-medium">5.2%</span> from
              last month
            </span>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
            <Zap className="h-3 w-3" />
            Download Report
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

"use client"

import {useMemo, useState} from "react"
import {useSelector} from "react-redux"
import {useQuery} from "@tanstack/react-query"
import {
    addDays,
    endOfMonth,
    endOfWeek,
    format,
    formatISO,
    startOfDay,
    startOfMonth,
    startOfWeek,
    subDays
} from "date-fns"
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Checkbox} from "@/components/ui/checkbox"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Calendar} from "@/components/ui/calendar"
import {Calendar as CalendarIcon, ChevronLeft, ChevronRight} from "lucide-react"
import {RootState} from "@/store"
import {ChartConfig} from "../ui/chart"
import {
    getDailyPostureData,
    getDailyPostureDataQuery,
    getMonthlyPostureData,
    getMonthlyPostureDataQuery,
    getWeeklyPostureData,
    getWeeklyPostureDataQuery
} from "@/api/posture-data";

// Chart configuration
const chartConfig: ChartConfig = {
    overall: {
        label: "Overall Score",
        color: "#10b981",
    },
    neck: {
        label: "Neck",
        color: "#2563eb",
    },
    torso: {
        label: "Torso",
        color: "#ef4444",
    },
    shoulders: {
        label: "Shoulders",
        color: "#f59e0b",
    }
}

// Threshold configuration
const thresholdConfig = {
    label: "Threshold",
    color: "#dc2626",
}

// Types for the chart data
type ChartDataPoint = {
    time?: string;
    day?: string;
    week?: string;
    overall: number;
    neck: number;
    torso: number;
    shoulders: number;
}

type VisibleLines = {
    overall: boolean;
    neck: boolean;
    torso: boolean;
    shoulders: boolean;
}

type ComputedPostureData = {
    time_marker: string;
    overall: number;
    neck: number;
    torso: number;
    shoulders: number;
};

type TimeRange = "daily" | "weekly" | "monthly"

type DateParams = {
    date?: string;
    start_date?: string;
    end_date?: string;
    interval?: string;
}

interface PostureChartProps {
    deviceId: string;
    deviceSensitivity: number;
}

export function PostureChart({deviceId, deviceSensitivity}: PostureChartProps) {
    const {username} = useSelector((state: RootState) => state.auth)
    const [activeTab, setActiveTab] = useState<TimeRange>("daily")
    const thresholdValue = deviceSensitivity

    // State for date selection
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(startOfWeek(new Date()))
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())

    const [selectedInterval, setSelectedInterval] = useState<string>("1");

    // State to handle calendar popover
    const [calendarOpen, setCalendarOpen] = useState(false)

    // State to track which lines to display
    const [visibleLines, setVisibleLines] = useState<VisibleLines>({
        overall: true,
        neck: true,
        torso: true,
        shoulders: true
    })

    // Generate date parameters based on active tab and selected dates
    const dateParams = useMemo((): DateParams => {
        switch (activeTab) {
            case "daily":
                // For daily view, use selected date
                return {
                    date: formatISO(selectedDate, {representation: 'date'}),
                    interval: selectedInterval
                }

            case "weekly":
                // For weekly view, use selected week
                const weekEnd = endOfWeek(selectedWeekStart)
                return {
                    start_date: formatISO(startOfDay(selectedWeekStart), {representation: 'date'}),
                    end_date: formatISO(startOfDay(weekEnd), {representation: 'date'})
                }

            case "monthly":
                // For monthly view, use selected month
                const monthStart = startOfMonth(selectedMonth)
                const monthEnd = endOfMonth(selectedMonth)
                return {
                    start_date: formatISO(startOfDay(monthStart), {representation: 'date'}),
                    end_date: formatISO(startOfDay(monthEnd), {representation: 'date'})
                }
        }
    }, [activeTab, selectedDate, selectedWeekStart, selectedMonth, selectedInterval])

    const {
        data: postureData,
        isLoading: isLoadingPostureData,
        isError: isErrorPostureData,
        isSuccess: isPosturePostureData
    } = useQuery<ComputedPostureData[]>({
        queryKey: [
            ...(activeTab === "daily"
                ? getDailyPostureDataQuery(username, deviceId, selectedInterval)
                : activeTab === "weekly"
                    ? getWeeklyPostureDataQuery(username, deviceId)
                    : getMonthlyPostureDataQuery(username, deviceId)),
            dateParams,
        ],
        queryFn: () => {
            if (activeTab === "daily") {
                return getDailyPostureData(deviceId, dateParams);
            } else if (activeTab === "weekly") {
                return getWeeklyPostureData(deviceId, dateParams);
            } else {
                return getMonthlyPostureData(deviceId, dateParams);
            }
        },
    });

    // Process data for different time periods
    const {chartData} = useMemo(() => {
        if (!postureData?.length) {
            return {chartData: []};
        }

        const formattedData: ChartDataPoint[] = postureData.map((item) => {
            if (activeTab === "daily") {
                return {
                    time: item.time_marker,
                    overall: item.overall,
                    neck: item.neck,
                    torso: item.torso,
                    shoulders: item.shoulders
                };
            } else if (activeTab === "weekly") {
                return {
                    day: item.time_marker,
                    overall: item.overall,
                    neck: item.neck,
                    torso: item.torso,
                    shoulders: item.shoulders
                };
            } else {
                return {
                    week: item.time_marker,
                    overall: item.overall,
                    neck: item.neck,
                    torso: item.torso,
                    shoulders: item.shoulders
                };
            }
        });

        return {chartData: formattedData};
    }, [postureData, activeTab]);

    // Toggle line visibility
    const toggleLineVisibility = (line: keyof VisibleLines) => {
        setVisibleLines(prev => ({
            ...prev,
            [line]: !prev[line]
        }))
    }

    // Date navigation handlers
    const navigateDay = (direction: 'prev' | 'next') => {
        setSelectedDate(prev =>
            direction === 'prev' ? subDays(prev, 1) : addDays(prev, 1)
        )
    }

    const navigateWeek = (direction: 'prev' | 'next') => {
        setSelectedWeekStart(prev =>
            direction === 'prev' ? subDays(prev, 7) : addDays(prev, 7)
        )
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
        setSelectedMonth(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1))
            return newDate
        })
    }

    // Calendar selection handlers
    const handleDaySelect = (day: Date | undefined) => {
        if (day) {
            setSelectedDate(day)
            setCalendarOpen(false)
        }
    }

    const handleWeekSelect = (day: Date | undefined) => {
        if (day) {
            setSelectedWeekStart(startOfWeek(day))
            setCalendarOpen(false)
        }
    }

    const handleMonthSelect = (day: Date | undefined) => {
        if (day) {
            setSelectedMonth(day)
            setCalendarOpen(false)
        }
    }

    // Date range display formatters
    const formatDailyDisplay = () => {
        return format(selectedDate, 'MMMM d, yyyy')
    }

    const formatWeeklyDisplay = () => {
        const weekEnd = endOfWeek(selectedWeekStart)
        return `${format(selectedWeekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
    }

    const formatMonthlyDisplay = () => {
        return format(selectedMonth, 'MMMM yyyy')
    }

    // Date picker component for the active tab
    const DatePicker = () => {
        let dateFormatter: () => string
        let handlePrev: () => void
        let handleNext: () => void
        let handleSelect: (date: Date | undefined) => void

        switch (activeTab) {
            case "daily":
                dateFormatter = formatDailyDisplay
                handlePrev = () => navigateDay('prev')
                handleNext = () => navigateDay('next')
                handleSelect = handleDaySelect
                break
            case "weekly":
                dateFormatter = formatWeeklyDisplay
                handlePrev = () => navigateWeek('prev')
                handleNext = () => navigateWeek('next')
                handleSelect = handleWeekSelect
                break
            case "monthly":
                dateFormatter = formatMonthlyDisplay
                handlePrev = () => navigateMonth('prev')
                handleNext = () => navigateMonth('next')
                handleSelect = handleMonthSelect
                break
        }

        return (
            <div className="flex items-center justify-evenly mb-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    className="text-xs p-1 h-8 sm:p-2"
                >
                    <ChevronLeft className="h-4 w-4"/>
                </Button>

                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex items-center justify-center gap-2 h-8 min-w-32 sm:min-w-40"
                        >
                            <CalendarIcon className="h-4 w-4"/>
                            <span className="text-xs sm:text-sm font-medium">
                                {dateFormatter()}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                            mode={activeTab === "daily" ? "single" : activeTab === "weekly" ? "single" : "single"}
                            selected={
                                activeTab === "daily"
                                    ? selectedDate
                                    : activeTab === "weekly"
                                        ? selectedWeekStart
                                        : selectedMonth
                            }
                            onSelect={handleSelect}
                            modifiers={
                                activeTab === "weekly"
                                    ? {
                                        weekHighlight: (date) => {
                                            const start = startOfWeek(selectedWeekStart)
                                            const end = endOfWeek(selectedWeekStart)
                                            return date >= start && date <= end
                                        }
                                    }
                                    : undefined
                            }
                            modifiersStyles={{
                                weekHighlight: {backgroundColor: "rgba(37, 99, 235, 0.1)"}
                            }}
                        />
                    </PopoverContent>
                </Popover>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    className="text-xs p-1 h-8 sm:p-2"
                >
                    <ChevronRight className="h-4 w-4"/>
                </Button>
            </div>
        )
    }

    // Line toggle checkboxes component
    const LineToggles = () => (
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 w-full">
            <div
                className={"flex gap-4"}
            >
                {(Object.entries(chartConfig) as [keyof VisibleLines, {
                    label: string,
                    color: string
                }][]).map(([key, config]) => (
                    <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                            id={`toggle-${key}`}
                            checked={visibleLines[key]}
                            onCheckedChange={() => toggleLineVisibility(key)}
                            className="border-2"
                            style={{
                                backgroundColor: visibleLines[key] ? config.color : 'transparent',
                                borderColor: config.color
                            }}
                        />
                        <Label
                            htmlFor={`toggle-${key}`}
                            className="text-xs sm:text-sm cursor-pointer"
                        >
                            {config.label}
                        </Label>
                    </div>
                ))}
            </div>

            <div>
                {activeTab === "daily" ? (
                    <Tabs
                        defaultValue="1"
                        value={selectedInterval}
                        onValueChange={setSelectedInterval}
                    >
                        <TabsList className="flex items-center space-x-2">
                            <TabsTrigger
                                value="1"
                                className="text-xs sm:text-sm"
                            >
                                1m
                            </TabsTrigger>
                            <TabsTrigger
                                value="10"
                                className="text-xs sm:text-sm"
                            >
                                10m
                            </TabsTrigger>
                            <TabsTrigger
                                value="30"
                                className="text-xs sm:text-sm"
                            >
                                30m
                            </TabsTrigger>

                        </TabsList>
                    </Tabs>
                ) : null}
            </div>

        </div>
    )

    // Chart component based on the active tab
    const renderChart = () => {
        const getDataKey = () => {
            switch (activeTab) {
                case "daily":
                    return "time"
                case "weekly":
                    return "day"
                case "monthly":
                    return "week"
            }
        }

        return (
            <div className="h-64 sm:h-80 mt-2 sm:mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{top: 5, right: 10, left: 0, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis
                            dataKey={getDataKey()}
                            tick={{fontSize: 10}}
                            tickFormatter={(value) =>
                                activeTab === "daily" && window.innerWidth < 640 ? value.slice(0, -3) : value
                            }
                        />
                        <YAxis domain={[0, 100]} width={28} tick={{fontSize: 10}}/>
                        <Tooltip
                            contentStyle={{fontSize: '12px'}}
                            itemStyle={{fontSize: '12px'}}
                            formatter={(value, name) => {
                                return [value, name];
                            }}
                        />
                        <Legend wrapperStyle={{fontSize: '10px', marginTop: '10px'}}/>

                        {/* Add threshold line */}
                        <ReferenceLine
                            y={thresholdValue}
                            stroke={thresholdConfig.color}
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            label={{
                                value: `Threshold (${thresholdValue})`,
                                position: "insideTopRight",
                                fill: thresholdConfig.color,
                                fontSize: 10
                            }}
                        />

                        {visibleLines.overall && (
                            <Line
                                type="monotone"
                                dataKey="overall"
                                stroke={chartConfig.overall.color}
                                activeDot={{r: 6}}
                                name={"Overall"}
                                strokeWidth={2}
                            />
                        )}

                        {visibleLines.neck && (
                            <Line
                                type="monotone"
                                dataKey="neck"
                                stroke={chartConfig.neck.color}
                                name={"Neck"}
                                strokeWidth={2}
                            />
                        )}

                        {visibleLines.torso && (
                            <Line
                                type="monotone"
                                dataKey="torso"
                                stroke={chartConfig.torso.color}
                                name={"Torso"}
                                strokeWidth={2}
                            />
                        )}

                        {visibleLines.shoulders && (
                            <Line
                                type="monotone"
                                dataKey="shoulders"
                                stroke={chartConfig.shoulders.color}
                                name={"Shoulders"}
                                strokeWidth={2}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader className="sm:px-6 px-4">
                <CardTitle className="text-xl sm:text-2xl">Posture Statistics</CardTitle>
                <CardDescription className="text-sm sm:text-base">View your posture data over time</CardDescription>
            </CardHeader>
            <CardContent className="sm:px-6 px-3">
                <div className="flex">
                    <Tabs
                        value={activeTab}
                        className="w-full"
                        onValueChange={(value) => setActiveTab(value as TimeRange)}
                    >
                        <TabsList className="w-full mb-2 grid grid-cols-3 sm:flex">
                            <TabsTrigger value="daily" className="text-xs sm:text-sm">Daily</TabsTrigger>
                            <TabsTrigger value="weekly" className="text-xs sm:text-sm">Weekly</TabsTrigger>
                            <TabsTrigger value="monthly" className="text-xs sm:text-sm">Monthly</TabsTrigger>
                        </TabsList>

                        {/* Date picker for selected range */}
                        <DatePicker/>

                        <div className="flex items-center justify-center mt-2 w-full">
                            <LineToggles/>
                        </div>

                        {isLoadingPostureData ? (
                            <div className="flex items-center justify-center h-32">
                                <p className="text-sm text-muted-foreground">Loading data...</p>
                            </div>
                        ) : isErrorPostureData ? (
                            <div className="flex items-center justify-center h-32">
                                <p className="text-sm text-red-500">Error loading data</p>
                            </div>
                        ) : isPosturePostureData ? (
                            <div>
                                <TabsContent value="daily">
                                    {renderChart()}
                                </TabsContent>

                                <TabsContent value="weekly">
                                    {renderChart()}
                                </TabsContent>

                                <TabsContent value="monthly">
                                    {renderChart()}
                                </TabsContent>
                            </div>
                        ) : null}
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    )
}
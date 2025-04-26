"use client"

import {useMemo, useState} from "react"
import {useSelector} from "react-redux"
import {useQuery} from "@tanstack/react-query"
import {format, formatISO, startOfDay, subDays, subWeeks} from "date-fns"
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Checkbox} from "@/components/ui/checkbox"
import {Label} from "@/components/ui/label"
import {getPostureData, getPostureDataQuery} from "@/api/posture-data"
import {PostureRecord} from "@/interfaces"
import {RootState} from "@/store"
import {ChartConfig} from "../ui/chart"

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

type TimeRange = "daily" | "weekly" | "monthly"

type DateParams = {
    date?: string;
    start_date?: string;
    end_date?: string;
}

interface PostureChartProps {
    deviceId: string;
}

export function PostureChart({deviceId}: PostureChartProps) {
    const {username} = useSelector((state: RootState) => state.auth)
    const [activeTab, setActiveTab] = useState<TimeRange>("daily")

    // State to track which lines to display
    const [visibleLines, setVisibleLines] = useState<VisibleLines>({
        overall: true,
        neck: true,
        torso: true,
        shoulders: true
    })

    // Generate date parameters based on active tab
    const dateParams = useMemo((): DateParams => {
        const today = new Date()
        const formattedToday = formatISO(today, {representation: 'date'})

        switch (activeTab) {
            case "daily":
                // For daily view, just use today's date
                return {date: formattedToday}

            case "weekly":
                // For weekly view, use last 7 days
                const weekAgo = subDays(today, 6)
                return {
                    start_date: formatISO(startOfDay(weekAgo), {representation: 'date'}),
                    end_date: formattedToday
                }

            case "monthly":
                // For monthly view, use last 4 weeks
                const fourWeeksAgo = subWeeks(today, 4)
                return {
                    start_date: formatISO(startOfDay(fourWeeksAgo), {representation: 'date'}),
                    end_date: formattedToday
                }
        }
    }, [activeTab])

    const {
        data: postureData,
        isLoading: isLoadingPostureData,
        isError: isErrorPostureData,
    } = useQuery<PostureRecord[]>({
        queryKey: [...getPostureDataQuery(username, deviceId), dateParams],
        queryFn: () => getPostureData(deviceId, dateParams),
    })

    // Process data for different time periods
    const {chartData} = useMemo(() => {
        if (!postureData?.length) {
            return {chartData: []}
        }

        // Sort data by timestamp
        const sortedData = [...postureData].sort((a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )

        let chartData: ChartDataPoint[] = []

        if (activeTab === "daily") {
            // Format data for daily view - hourly intervals
            chartData = sortedData.map(record => {
                const time = format(new Date(record.timestamp), 'HH:mm')
                const neckScore = record.components.find(c => c.component_type === "neck")?.score || 0
                const torsoScore = record.components.find(c => c.component_type === "torso")?.score || 0
                const shouldersScore = record.components.find(c => c.component_type === "shoulders")?.score || 0

                return {
                    time,
                    overall: record.overall_score,
                    neck: neckScore,
                    torso: torsoScore,
                    shoulders: shouldersScore
                }
            })
        } else if (activeTab === "weekly") {
            // Group by day for weekly view
            const dailyGroups = new Map<string, PostureRecord[]>()

            sortedData.forEach(record => {
                const date = new Date(record.timestamp)
                const day = format(date, 'EEE')

                if (!dailyGroups.has(day)) {
                    dailyGroups.set(day, [])
                }

                dailyGroups.get(day)?.push(record)
            })

            // Process each day's data
            chartData = Array.from(dailyGroups.entries()).map(([day, records]) => {
                const averageOverall = Math.round(
                    records.reduce((sum, record) => sum + record.overall_score, 0) / records.length
                )

                const neckScores = records.map(record =>
                    record.components.find(c => c.component_type === "neck")?.score || 0
                )
                const torsoScores = records.map(record =>
                    record.components.find(c => c.component_type === "torso")?.score || 0
                )
                const shouldersScores = records.map(record =>
                    record.components.find(c => c.component_type === "shoulders")?.score || 0
                )

                const avgNeck = Math.round(neckScores.reduce((sum, score) => sum + score, 0) / neckScores.length)
                const avgTorso = Math.round(torsoScores.reduce((sum, score) => sum + score, 0) / torsoScores.length)
                const avgShoulders = Math.round(shouldersScores.reduce((sum, score) => sum + score, 0) / shouldersScores.length)

                return {
                    day,
                    overall: averageOverall,
                    neck: avgNeck,
                    torso: avgTorso,
                    shoulders: avgShoulders
                }
            })

            // Ensure days are in correct order (Mon-Sun)
            const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            chartData.sort((a, b) => {
                if (a.day && b.day) {
                    return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
                }
                return 0
            })
        } else {
            // Group by week for monthly view
            const now = new Date()
            const weekBuckets: { label: string; startDate: Date; endDate: Date; records: PostureRecord[] }[] = []

            for (let i = 0; i < 4; i++) {
                const startDate = subWeeks(new Date(now), 4 - i)
                const endDate = i === 3 ? new Date(now) : subWeeks(new Date(now), 3 - i)
                weekBuckets.push({
                    label: `Week ${i + 1}`,
                    startDate,
                    endDate,
                    records: [] as PostureRecord[]
                })
            }

            // Assign records to appropriate week buckets
            sortedData.forEach(record => {
                const recordDate = new Date(record.timestamp)

                for (const bucket of weekBuckets) {
                    if (recordDate >= bucket.startDate && recordDate <= bucket.endDate) {
                        bucket.records.push(record)
                        break
                    }
                }
            })

            // Calculate averages for each week
            chartData = weekBuckets.map(bucket => {
                if (bucket.records.length === 0) {
                    return {
                        week: bucket.label,
                        overall: 0,
                        neck: 0,
                        torso: 0,
                        shoulders: 0
                    }
                }

                const averageOverall = Math.round(
                    bucket.records.reduce((sum, record) => sum + record.overall_score, 0) / bucket.records.length
                )

                const neckScores = bucket.records.map(record =>
                    record.components.find(c => c.component_type === "neck")?.score || 0
                )
                const torsoScores = bucket.records.map(record =>
                    record.components.find(c => c.component_type === "torso")?.score || 0
                )
                const shouldersScores = bucket.records.map(record =>
                    record.components.find(c => c.component_type === "shoulders")?.score || 0
                )

                const avgNeck = Math.round(neckScores.reduce((sum, score) => sum + score, 0) / neckScores.length)
                const avgTorso = Math.round(torsoScores.reduce((sum, score) => sum + score, 0) / torsoScores.length)
                const avgShoulders = Math.round(shouldersScores.reduce((sum, score) => sum + score, 0) / shouldersScores.length)

                return {
                    week: bucket.label,
                    overall: averageOverall,
                    neck: avgNeck,
                    torso: avgTorso,
                    shoulders: avgShoulders
                }
            })
        }

        return {chartData}
    }, [postureData, activeTab])

    // Toggle line visibility
    const toggleLineVisibility = (line: keyof VisibleLines) => {
        setVisibleLines(prev => ({
            ...prev,
            [line]: !prev[line]
        }))
    }

    // Loading, error, and empty state handling
    if (isLoadingPostureData) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    if (isErrorPostureData) {
        return <div className="flex items-center justify-center h-screen">Error loading posture data</div>
    }

    if (!postureData || postureData.length === 0) {
        return <div className="flex items-center justify-center h-screen">No posture data available</div>
    }

    // Line toggle checkboxes component
    const LineToggles = () => (
        <div className="flex flex-wrap gap-3 mb-4 justify-center sm:justify-start">
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
                        />
                        <Legend wrapperStyle={{fontSize: '10px', marginTop: '10px'}}/>

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
        <div className="space-y-4">
            <Card>
                <CardHeader className="sm:px-6 px-4">
                    <CardTitle className="text-xl sm:text-2xl">Posture Statistics</CardTitle>
                    <CardDescription className="text-sm sm:text-base">View your posture data over time</CardDescription>
                </CardHeader>
                <CardContent className="sm:px-6 px-3">
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

                        <div
                            className={"grid items-center justify-center mt-4"}
                        >
                            <LineToggles/>
                        </div>

                        <TabsContent value="daily">
                            {renderChart()}
                        </TabsContent>

                        <TabsContent value="weekly">
                            {renderChart()}
                        </TabsContent>

                        <TabsContent value="monthly">
                            {renderChart()}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {ChartConfig} from "../ui/chart"
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"

// Mock data for the charts
const dailyData = [
    {time: "8:00", score: 95},
    {time: "9:00", score: 90},
    {time: "10:00", score: 75},
    {time: "11:00", score: 60},
    {time: "12:00", score: 85},
    {time: "13:00", score: 90},
    {time: "14:00", score: 95},
    {time: "15:00", score: 80},
    {time: "16:00", score: 70},
    {time: "17:00", score: 85},
]

const weeklyData = [
    {day: "Mon", score: 85, alerts: 3},
    {day: "Tue", score: 78, alerts: 5},
    {day: "Wed", score: 90, alerts: 2},
    {day: "Thu", score: 87, alerts: 3},
    {day: "Fri", score: 92, alerts: 1},
    {day: "Sat", score: 95, alerts: 0},
    {day: "Sun", score: 88, alerts: 2},
]

const monthlyData = [
    {week: "Week 1", score: 82},
    {week: "Week 2", score: 85},
    {week: "Week 3", score: 87},
    {week: "Week 4", score: 90},
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
    score: {
        label: "Posture Score",
        color: "#10b981",
    },
    alerts: {
        label: "Posture Alerts",
        color: "#ef4444",
    }
} satisfies ChartConfig

export function PostureChart() {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="sm:px-6 px-4">
                    <CardTitle className="text-xl sm:text-2xl">Posture Statistics</CardTitle>
                    <CardDescription className="text-sm sm:text-base">View your posture data over time</CardDescription>
                </CardHeader>
                <CardContent className="sm:px-6 px-3">
                    <Tabs defaultValue="daily" className="w-full">
                        <TabsList className="w-full mb-2 grid grid-cols-4 sm:flex">
                            <TabsTrigger value="daily" className="text-xs sm:text-sm">Daily</TabsTrigger>
                            <TabsTrigger value="weekly" className="text-xs sm:text-sm">Weekly</TabsTrigger>
                            <TabsTrigger value="monthly" className="text-xs sm:text-sm">Monthly</TabsTrigger>
                        </TabsList>

                        <TabsContent value="daily">
                            <div className="h-64 sm:h-80 mt-2 sm:mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={dailyData} margin={{top: 5, right: 10, left: 0, bottom: 5}}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="time"
                                            tick={{fontSize: 10}}
                                            tickFormatter={(value) => window.innerWidth < 640 && value.includes(":00") ? value.replace(":00", "") : value}
                                        />
                                        <YAxis width={28} tick={{fontSize: 10}} />
                                        <Tooltip
                                            contentStyle={{fontSize: '12px'}}
                                            itemStyle={{fontSize: '12px'}}
                                        />
                                        <Legend wrapperStyle={{fontSize: '10px', marginTop: '10px'}} />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke={chartConfig.score.color}
                                            activeDot={{r: 6}}
                                            name={chartConfig.score.label}
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </TabsContent>

                        <TabsContent value="weekly">
                            <div className="h-64 sm:h-80 mt-2 sm:mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={weeklyData} margin={{top: 5, right: 10, left: 0, bottom: 5}}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" tick={{fontSize: 10}} />
                                        <YAxis yAxisId="left" width={28} tick={{fontSize: 10}} />
                                        <YAxis yAxisId="right" orientation="right" width={28} tick={{fontSize: 10}} />
                                        <Tooltip
                                            contentStyle={{fontSize: '12px'}}
                                            itemStyle={{fontSize: '12px'}}
                                        />
                                        <Legend wrapperStyle={{fontSize: '10px', marginTop: '10px'}} />
                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="score"
                                            stroke={chartConfig.score.color}
                                            name={chartConfig.score.label}
                                            strokeWidth={2}
                                        />
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="alerts"
                                            stroke={chartConfig.alerts.color}
                                            name={chartConfig.alerts.label}
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </TabsContent>

                        <TabsContent value="monthly">
                            <div className="h-64 sm:h-80 mt-2 sm:mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyData} margin={{top: 5, right: 10, left: 0, bottom: 5}}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="week" tick={{fontSize: 10}} />
                                        <YAxis domain={[60, 100]} width={28} tick={{fontSize: 10}} />
                                        <Tooltip
                                            contentStyle={{fontSize: '12px'}}
                                            itemStyle={{fontSize: '12px'}}
                                        />
                                        <Legend wrapperStyle={{fontSize: '10px', marginTop: '10px'}} />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke={chartConfig.score.color}
                                            name={chartConfig.score.label}
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
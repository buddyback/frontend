"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"

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

export function PostureChart() {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Posture Statistics</CardTitle>
                    <CardDescription>View your posture data over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="account" className={"w-full"}>
                        <TabsList
                            className={"w-full"}
                        >
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">Make changes to your account here.</TabsContent>
                        <TabsContent value="password">Change your password here.</TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
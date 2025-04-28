'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Activity, AlertTriangle, Clock, ThumbsUp} from "lucide-react"
import {useQuery} from "@tanstack/react-query";
import {getDeviceStatistics, getDeviceStatisticsQueryKey} from "@/api/statistics";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {Device, DeviceStatistics} from "@/interfaces";
import {secondsParser} from "@/utils/seconds-parser";
import {dateParser} from "@/utils/date-parser";

interface DeviceStatsProps {
    device: Device
}

export function DeviceStats({device}: DeviceStatsProps) {

    const {username} = useSelector((state: RootState) => state.auth)

    const {
        data: deviceStats,
        isLoading: isLoadingDeviceStats,
        isError: isErrorDeviceStats,
        isSuccess: isSuccessDeviceStats,
    } = useQuery<DeviceStatistics>({
        queryKey: getDeviceStatisticsQueryKey(username, device.id),
        queryFn: () => getDeviceStatistics(device.id),
    })

    if (isLoadingDeviceStats) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    if (isErrorDeviceStats) {
        return <div className="flex items-center justify-center h-screen">Error loading device stats</div>
    }

    if (!isSuccessDeviceStats) {
        return <div className="flex items-center justify-center h-screen">No device stats</div>
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
                    <ThumbsUp className="h-4 w-4 text-teal-500"/>
                </CardHeader>
                <CardContent>
                    <div
                        className="text-2xl font-bold"
                    >
                        {secondsParser(deviceStats.summary.total_seconds).hours}h {secondsParser(deviceStats.summary.total_seconds).minutes}m
                    </div>
                    <p className="text-xs text-muted-foreground">from {dateParser(device.registration_date)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Usage</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div
                        className="text-2xl font-bold">{secondsParser(deviceStats.summary.average_session_seconds).hours}h {secondsParser(deviceStats.summary.average_session_seconds).minutes}m
                    </div>
                    <p className="text-xs text-muted-foreground">for each session</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                    <ThumbsUp className="h-4 w-4 text-teal-500"/>
                </CardHeader>
                <CardContent>
                    <div
                        className="text-2xl font-bold"
                    >
                        {deviceStats.summary.total_sessions}
                    </div>
                    <p className="text-xs text-muted-foreground">from {dateParser(device.registration_date)}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Consistency Score</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{deviceStats.summary.consistency_score}</div>
                    <p className="text-xs text-muted-foreground">
                        {deviceStats.summary.current_streak_days} days streak
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

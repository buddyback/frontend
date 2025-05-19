'use client'
import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {ChartAreaIcon, Clock, Layers, ThumbsUp} from "lucide-react"
import {useQuery} from "@tanstack/react-query";
import {getDeviceStatistics, getDeviceStatisticsQueryKey} from "@/api/statistics";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {Device, DeviceStatistics} from "@/interfaces";
import {secondsParser} from "@/utils/seconds-parser";
import {dateParser} from "@/utils/date-parser";
import {Carousel, type CarouselApi, CarouselContent, CarouselItem} from "@/components/ui/carousel";

interface DeviceStatsProps {
    device: Device
}

export function DeviceStats({device}: DeviceStatsProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

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

    useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap());
        };

        api.on("select", onSelect);
        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    if (isLoadingDeviceStats) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    if (isErrorDeviceStats) {
        return <div className="flex items-center justify-center h-screen">Error loading device stats</div>
    }

    if (!isSuccessDeviceStats) {
        return <div className="flex items-center justify-center h-screen">No device stats</div>
    }

    const statsCards = [
        {
            title: "Total Usage",
            icon: <Clock className="h-6 w-6 text-teal-600"/>,
            value: `${secondsParser(deviceStats.summary.total_seconds).hours}h ${secondsParser(deviceStats.summary.total_seconds).minutes}m`,
            subtitle: `from ${dateParser(device.registration_date)}`
        },
        {
            title: "Average Usage",
            icon: <ChartAreaIcon className="h-6 w-6 text-teal-600"/>,
            value: `${secondsParser(deviceStats.summary.average_session_seconds).hours}h ${secondsParser(deviceStats.summary.average_session_seconds).minutes}m`,
            subtitle: "for each session"
        },
        {
            title: "Total Sessions",
            icon: <Layers className="h-6 w-6 text-teal-600"/>,
            value: deviceStats.summary.total_sessions,
            subtitle: `from ${dateParser(device.registration_date)}`
        },
        {
            title: "Consistency Score",
            icon: <ThumbsUp className="h-6 w-6 text-teal-600"/>,
            value: deviceStats.summary.consistency_score,
            subtitle: `${deviceStats.summary.current_streak_days} days streak`
        }
    ];

    return (
        <>
            {/* Mobile View with Carousel */}
            <div className="lg:hidden flex flex-col items-center justify-center">
                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                    }}
                >
                    <CarouselContent
                        className={"w-screen"}
                    >
                        {statsCards.map((stat, index) => (
                            <CarouselItem key={index}>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                        {stat.icon}
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                {/* Pagination dots */}
                <div className="flex justify-center gap-1 mt-2">
                    {statsCards.map((_, index) => (
                        <button
                            key={index}
                            className={`h-2 rounded-full transition-all ${
                                index === current ? "w-4 bg-teal-600" : "w-2 bg-gray-300"
                            }`}
                            onClick={() => api?.scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Desktop View with Grid */}
            <div className="hidden lg:grid gap-4 grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}
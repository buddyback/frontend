'use client';
import React, {useEffect, useState} from 'react';
import RankCard from "@/components/cards/rank-card";
import {useQuery} from "@tanstack/react-query";
import {getRanks, getRanksQueryKey} from "@/api/ranks";
import {UserRank} from "@/interfaces";
import {Card, CardContent, CardDescription} from "@/components/ui/card";

import {Carousel, type CarouselApi, CarouselContent, CarouselItem} from "@/components/ui/carousel"

const DashboardRanks = () => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    const {
        data: ranks,
        isLoading: loadingRanks,
        isError: errorLoadingRanks,
        isSuccess: successLoadingRanks,
    } = useQuery<UserRank[]>({
        queryKey: getRanksQueryKey(),
        queryFn: () => getRanks()
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

    if (loadingRanks) {
        return (
            <div className={"grid gap-4"}>
                <p>Loading ranks...</p>
            </div>
        );
    }

    if (errorLoadingRanks) {
        return (
            <div className={"grid gap-4"}>
                <p>Error loading ranks...</p>
            </div>
        );
    }

    const items = successLoadingRanks && ranks.length !== 0
        ? ranks
        : [{category: "no-ranks"}];

    return (
        <>
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
                        {successLoadingRanks && ranks.length !== 0 ? (
                            ranks.map((rank) => (
                                <CarouselItem
                                    key={rank.category}
                                >
                                    <RankCard rank={rank}/>
                                </CarouselItem>
                            ))
                        ) : (
                            <CarouselItem>
                                <Card>
                                    <CardContent>
                                        <CardDescription>No ranks available. They will be available after the first
                                            session.</CardDescription>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        )}
                    </CarouselContent>
                </Carousel>

                {/* Pagination dots */}
                <div className="flex justify-center gap-1 mt-2">
                    {items.map((_, index) => (
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

            <div className={"hidden lg:grid lg:grid-cols-4 gap-4"}>
                {successLoadingRanks && ranks.length !== 0 ? (
                    ranks.map((rank) => (
                        <div key={rank.category}>
                            <RankCard rank={rank}/>
                        </div>
                    ))
                ) : successLoadingRanks && ranks.length === 0 ? (
                    <div>
                        <Card className={"md:col-span-2 lg:col-span-4"}>
                            <CardContent>
                                <CardDescription>No ranks available. They will be available after the first
                                    session.</CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                ) : null}
            </div>
        </>
    );
};

export default DashboardRanks;
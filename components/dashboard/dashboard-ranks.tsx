'use client';
import React from 'react';
import RankCard from "@/components/cards/rank-card";
import {useQuery} from "@tanstack/react-query";
import {getRanks, getRanksQueryKey} from "@/api/ranks";
import {UserRank} from "@/interfaces";
import {Card, CardContent, CardDescription} from "@/components/ui/card";

const DashboardRanks = () => {

    const {
        data: ranks,
        isLoading: loadingRanks,
        isError: errorLoadingRanks,
        isSuccess: successLoadingRanks,
    } = useQuery<UserRank[]>({
        queryKey: getRanksQueryKey(),
        queryFn: () => getRanks()
    })

    if (loadingRanks) {
        return (
            <div
                className={"grid gap-4"}
            >
                <p>Loading ranks...</p>
            </div>
        );
    }

    if (errorLoadingRanks) {
        return (
            <div
                className={"grid gap-4"}
            >
                <p>Error loading ranks...</p>
            </div>
        );
    }

    return (
        <div
            className={"grid grid-cols-2 lg:grid-cols-4 gap-4"}
        >
            {successLoadingRanks && ranks.length !== 0 ? (
                ranks.map((rank) => (
                    <RankCard
                        key={rank.category}
                        rank={rank}
                    />
                ))
            ) : successLoadingRanks && ranks.length === 0 ? (
                <Card
                    className={"md:col-span-2  lg:col-span-4"}
                >
                    <CardContent>
                        <CardDescription>No ranks available. They will be available after the first
                            session.</CardDescription>
                    </CardContent>
                </Card>
            ) : null}
        </div>
    );
};

export default DashboardRanks;
import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress, ProgressLabel, ProgressValue} from "@/components/ui/progress";
import {UserRank} from "@/interfaces";
import Image from "next/image";
import NoneRank from "@/assets/icons/NONE.svg"
import BronzeRank from "@/assets/icons/BRONZE.svg"
import SilverRank from "@/assets/icons/SILVER.svg"
import GoldRank from "@/assets/icons/GOLD.svg"
import PlatinumRank from "@/assets/icons/PLATINUM.svg"
import DiamondRank from "@/assets/icons/DIAMOND.svg"


interface RankCardProps {
    rank: UserRank;
}

const RankCard = ({rank}: RankCardProps) => {

    const rankIcon = (): string => {
        switch (rank.tier.name) {
            case "BRONZE":
                return BronzeRank;
            case "SILVER":
                return SilverRank;
            case "GOLD":
                return GoldRank;
            case "PLATINUM":
                return PlatinumRank;
            case "DIAMOND":
                return DiamondRank;
            default:
                return NoneRank;
        }
    }

    // Calculate progress percentage
    const calculateProgress = () => {
        if (!rank.next_tier) return 100;

        const currentPoints = rank.current_score;
        const nextTierPoints = rank.next_tier.minimum_score;
        const currentTierPoints = rank.tier.minimum_score;

        // Calculate progress as percentage between current tier minimum and next tier minimum
        const totalPointsNeeded = nextTierPoints - currentTierPoints;
        const pointsAchieved = currentPoints - currentTierPoints;

        return Math.min(Math.max((pointsAchieved / totalPointsNeeded) * 100, 0), 100);
    };

    // Format date for better readability
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                    <span>{rank.category}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col items-start gap-2 lg:flex-row  justify-between lg:items-center">
                    <div
                        className="flex items-center justify-center gap-2"
                    >
                        <Image
                            src={rankIcon()}
                            alt={`rank-${rank.tier.name}`}
                            className={`h-8 w-8 ${rank.tier.name === "NONE" ? "dark:invert" : ""}`}
                        />
                        <div className="font-medium text-lg">
                            {rank.tier.name === "NONE" ? "Unranked" : rank.tier.name}
                        </div>
                    </div>

                    <div className="text-sm font-medium">
                        Score: {rank.current_score}
                    </div>
                </div>

                <Progress
                    value={calculateProgress()}
                    className={"my-6"}
                >
                    <ProgressLabel
                        className={"text-xs md:text-sm"}
                    >
                        To {rank.next_tier.name.toLowerCase()}
                    </ProgressLabel>
                    <ProgressValue
                        className={"text-xs md:text-sm"}
                    />
                </Progress>

                <div>
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Last Update:</span>
                        <span>{formatDate(rank.last_updated).split(",")[0]}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RankCard;
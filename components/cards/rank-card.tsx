import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {UserRank} from "@/interfaces";

interface RankCardProps {
    rank: UserRank;
}

const RankCard = ({rank}: RankCardProps) => {
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
        <Card className="shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                    <span>{rank.category}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="font-medium text-lg">
                        {rank.tier.name === "NONE" ? "Unranked" : rank.tier.name}
                    </div>
                    <div className="text-sm font-medium">
                        Score: {rank.current_score}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="space-y-1">
                        <Progress value={calculateProgress()} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{rank.tier.name} ({rank.tier.minimum_score})</span>
                            <span>{rank.next_tier.name} ({rank.next_tier.minimum_score})</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span>{formatDate(rank.last_updated)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RankCard;
import React from 'react';
import {DeviceList} from "@/components/dashboard/device-list";
import {Card, CardContent} from "@/components/ui/card";
import DashboardRanks from "@/components/dashboard/dashboard-ranks";

const Dashboard = () => {
    return (
        <div className="grid gap-10">
            <div className={"grid gap-4"}>
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>
            </div>


            <div
                className={"grid gap-10"}
            >
                <DashboardRanks/>

                <Card>
                    <CardContent>
                        <DeviceList/>
                    </CardContent>
                </Card>
            </div>


        </div>
    );
};

export default Dashboard;
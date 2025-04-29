import React from 'react';
import {DeviceList} from "@/components/dashboard/device-list";
import {Card, CardContent} from "@/components/ui/card";

const Dashboard = () => {
    return (
        <div className="grid gap-10">
            <div className={"grid gap-4"}>
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>
            </div>

            <Card>
                <CardContent>
                    <DeviceList/>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
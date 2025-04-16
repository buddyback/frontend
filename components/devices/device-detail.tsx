import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Badge} from "@/components/ui/badge"
import {AlertTriangle, Info} from "lucide-react"

interface DeviceDetailProps {
    id: string
}

export function DeviceDetail({id}: DeviceDetailProps) {

    const deviceData = {
        name: id === "raspberry-pi-1" ? "Living Room" : id === "raspberry-pi-2" ? "Office" : "Bedroom",
        model: "Raspberry Pi 4 Model B",
        serialNumber: "RP4-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        firmwareVersion: "v2.3.1",
        lastCalibration: "2023-10-15",
        status: id !== "raspberry-pi-3" ? "online" : "offline",
        recentAlerts: [
            {
                id: 1,
                type: "warning",
                message: "Poor posture detected for more than 15 minutes",
                time: "Today, 10:23 AM",
            },
            {
                id: 2,
                type: "info",
                message: "Device calibration recommended",
                time: "Yesterday, 3:45 PM",
            },
        ],
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Device Information</CardTitle>
                    <CardDescription>Technical details about this device</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                    <div className="flex justify-between py-1 border-b">
                        <span className="font-medium">Status</span>
                        <Badge
                            variant={deviceData.status === "online" ? "default" : "secondary"}>{deviceData.status}</Badge>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                        <span className="font-medium">Model</span>
                        <span className="text-muted-foreground">{deviceData.model}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                        <span className="font-medium">Serial Number</span>
                        <span
                            className="text-muted-foreground text-xs sm:text-sm truncate ml-2">{deviceData.serialNumber}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                        <span className="font-medium">Firmware</span>
                        <span className="text-muted-foreground">{deviceData.firmwareVersion}</span>
                    </div>
                    <div className="flex justify-between py-1">
                        <span className="font-medium">Last Calibration</span>
                        <span className="text-muted-foreground">{deviceData.lastCalibration}</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Recent Alerts</CardTitle>
                    <CardDescription>Notifications from this device</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {deviceData.recentAlerts.map((alert) => (
                        <Alert key={alert.id} variant={alert.type === "warning" ? "destructive" : "default"}>
                            {alert.type === "warning" ? <AlertTriangle className="h-4 w-4"/> :
                                <Info className="h-4 w-4"/>}
                            <AlertTitle
                                className="ml-2">{alert.type === "warning" ? "Warning" : "Information"}</AlertTitle>
                            <AlertDescription className="ml-2 flex flex-col">
                                <span className="text-xs sm:text-sm">{alert.message}</span>
                                <span className="text-xs text-muted-foreground">{alert.time}</span>
                            </AlertDescription>
                        </Alert>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

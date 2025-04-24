'use client'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Device} from "@/interfaces";
import {dateParser} from "@/utils/date-parser";
import {Slider} from "@/components/ui/slider";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {getDeviceQueryKey, updateDevice} from "@/api/devices";
import {toast} from "sonner";
import {Loader2Icon, PencilIcon, XIcon} from "lucide-react";
import {useSelector} from "react-redux";
import {RootState} from "@/store";

interface DeviceDetailProps {
    device: Device;
}

export function DeviceDetail({device}: DeviceDetailProps) {

    const {username} = useSelector((state: RootState) => state.auth)
    const queryClient = useQueryClient();
    const [temDeviceSensitivity, setTemDeviceSensitivity] = useState(device.sensitivity);
    const [temDeviceVibrationIntensity, setTemDeviceVibrationIntensity] = useState(device.vibration_intensity);
    const [tempDeviceName, setTemDeviceName] = useState(device.name);

    const [isEditingName, setIsEditingName] = useState(false);

    const updateDeviceSettingsMutation = useMutation({
        mutationFn: () => updateDevice(
            device.id,
            tempDeviceName,
            temDeviceSensitivity,
            temDeviceVibrationIntensity
        ),
        onSuccess: async (data) => {

            await queryClient.invalidateQueries({
                queryKey: getDeviceQueryKey(username, device.id),
            })

            toast.success("Device settings updated successfully.");
            setTemDeviceSensitivity(data.sensitivity);
            setTemDeviceVibrationIntensity(data.vibration_intensity);
        },
        onError: (error) => {
            console.error("Error updating device settings:", error);
        },
    })

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Device Information</CardTitle>
                    <CardDescription>Technical details about this device</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 items-center divide-y">
                    <div className="flex justify-between items-center py-1 pb-4">
                        <span className="font-medium">Name</span>
                        {isEditingName ? (
                            <div
                                className={"flex items-center justify-center gap-4"}
                            >
                                <input
                                    className={"focus:outline-none"}
                                    value={tempDeviceName}
                                    onChange={(e) => {
                                        setTemDeviceName(e.target.value);
                                    }}
                                />
                                <XIcon
                                    className={"h-4 w-4 cursor-pointer"}
                                    onClick={() => {
                                        setIsEditingName(!isEditingName);
                                    }}
                                />
                            </div>
                        ) : (
                            <div
                                className={"flex items-center justify-center gap-4"}
                            >
                                <div>
                                    {tempDeviceName}
                                </div>
                                <PencilIcon
                                    className={"h-4 w-4 cursor-pointer"}
                                    onClick={() => {
                                        setIsEditingName(!isEditingName);
                                    }}
                                />
                            </div>

                        )}

                    </div>
                    <div className="flex justify-between items-center py-1 pb-4">
                        <span className="font-medium">Status</span>
                        <Badge
                            variant={device.is_active ? "default" : "outline"}>
                            {device.is_active ? "Active" : "Disabled"}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center py-1 pb-4">
                        <span className="font-medium">ID</span>
                        <span className="text-muted-foreground">{device.id}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 pb-4">
                        <span className="font-medium">Registration Date</span>
                        <span
                            className="text-muted-foreground text-xs sm:text-sm truncate ml-2"
                        >
                            {dateParser(device.registration_date)}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className={"grid gap-2"}>
                            <div className={"flex items-center justify-between"}>
                                <span className="font-medium">Sensitivity</span>
                                <div className="flex items-center">
                                <span
                                    className="text-muted-foreground text-xs sm:text-sm truncate ml-2"
                                >
                                    {temDeviceSensitivity}%
                                </span>
                                </div>
                            </div>
                            <Slider
                                defaultValue={[temDeviceSensitivity]}
                                max={100}
                                step={1}
                                onValueChange={(value) => {
                                    setTemDeviceSensitivity(value[0]);
                                }}
                            />
                        </div>
                        <div className={"grid gap-2"}>
                            <div className={"flex items-center justify-between"}>
                                <span className="font-medium">Vibration Intensity</span>
                                <div className="flex items-center">
                                <span
                                    className="text-muted-foreground text-xs sm:text-sm truncate ml-2"
                                >
                                    {temDeviceVibrationIntensity}%
                                </span>
                                </div>
                            </div>
                            <Slider
                                defaultValue={[temDeviceVibrationIntensity]}
                                max={100}
                                step={1}
                                onValueChange={(value) => {
                                    setTemDeviceVibrationIntensity(value[0]);
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className={"mt-4"}
                        disabled={
                            temDeviceSensitivity === device.sensitivity
                            && temDeviceVibrationIntensity === device.vibration_intensity
                            && tempDeviceName === device.name
                            || updateDeviceSettingsMutation.isPending
                        }
                        onClick={() => updateDeviceSettingsMutation.mutate()}
                    >
                        {updateDeviceSettingsMutation.isPending ? (
                            <Loader2Icon
                                className="mr-2 h-4 w-4 animate-spin"
                            />
                        ) : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Recent Alerts</CardTitle>
                    <CardDescription>Notifications from this device</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/*{deviceData.recentAlerts.map((alert) => (*/}
                    {/*    <Alert key={alert.id} variant={alert.type === "warning" ? "destructive" : "default"}>*/}
                    {/*        {alert.type === "warning" ? <AlertTriangle className="h-4 w-4"/> :*/}
                    {/*            <Info className="h-4 w-4"/>}*/}
                    {/*        <AlertTitle*/}
                    {/*            className="ml-2">{alert.type === "warning" ? "Warning" : "Information"}</AlertTitle>*/}
                    {/*        <AlertDescription className="ml-2 flex flex-col">*/}
                    {/*            <span className="text-xs sm:text-sm">{alert.message}</span>*/}
                    {/*            <span className="text-xs text-muted-foreground">{alert.time}</span>*/}
                    {/*        </AlertDescription>*/}
                    {/*    </Alert>*/}
                    {/*))}*/}
                </CardContent>
            </Card>
        </div>
    )
}

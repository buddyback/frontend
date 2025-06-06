'use client'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Device} from "@/interfaces";
import {dateParser} from "@/utils/date-parser";
import {Slider} from "@/components/ui/slider";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getDeviceQueryKey, getDevicesQueryKey, unclaimDevice, updateDevice} from "@/api/devices";
import {toast} from "sonner";
import {Loader2Icon, PencilIcon, XIcon} from "lucide-react";
import {useSelector} from "react-redux";
import {RootState} from "@/store";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {useRouter} from "next/navigation";
import {djangoInstance} from "@/config/axios-config";
import {isDeviceAliveQueryKey} from "@/api/device-sessions";

interface DeviceDetailProps {
    device: Device;
    action: (isOnline: boolean) => void;
}

export function DeviceDetail({device, action}: DeviceDetailProps) {

    const router = useRouter();
    const {username} = useSelector((state: RootState) => state.auth)
    const queryClient = useQueryClient();
    const [temDeviceSensitivity, setTemDeviceSensitivity] = useState(device.sensitivity);
    const [temDeviceVibrationIntensity, setTemDeviceVibrationIntensity] = useState(device.vibration_intensity);
    const [tempAudioIntensity, setTempAudioIntensity] = useState(device.audio_intensity);
    const [tempDeviceName, setTemDeviceName] = useState(device.name);

    const [isEditingName, setIsEditingName] = useState(false);

    const updateDeviceSettingsMutation = useMutation({
        mutationFn: () => updateDevice(
            device.id,
            tempDeviceName,
            temDeviceSensitivity,
            temDeviceVibrationIntensity,
            tempAudioIntensity,
        ),
        onSuccess: async (data) => {

            await queryClient.invalidateQueries({
                queryKey: getDeviceQueryKey(username, device.id),
            })

            toast.success("Device settings updated successfully.");
            setTemDeviceSensitivity(data.sensitivity);
            setTemDeviceVibrationIntensity(data.vibration_intensity);
            setTempAudioIntensity(data.audio_intensity);
        },
        onError: (error) => {
            console.error("Error updating device settings:", error);
        },
    })


    const handleRemoveDeviceMutation = useMutation({
        mutationFn: () => unclaimDevice(device.id),
        onSuccess: async () => {
            router.push(`/dashboard`);
            await queryClient.invalidateQueries({
                queryKey: getDevicesQueryKey(username),
            })
            toast.success("Device removed successfully.");
        },
    })

    const getIsDeviceAlive = async (deviceId: string) => {
        const res = await djangoInstance.get(`/devices/${deviceId}/is-alive/`);
        if (action) {
            action(res.data.is_alive);
        }
        return res.data.is_alive;
    }

    useQuery({
        queryKey: isDeviceAliveQueryKey(username, device.id),
        queryFn: () => getIsDeviceAlive(device.id),
        refetchInterval: 20 * 1000, // 40 seconds interval
    })

    return (
        <div className="grid gap-4">
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
                    <div
                        className={"flex w-full items-center justify-end"}
                    >
                        <Button
                            className={"mt-4 w-full md:w-fit"}
                            variant={"accent"}
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
                    </div>

                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Remove Device
                    </CardTitle>
                    <CardDescription>
                        This device is registered to your account. You can remove it by clicking the button below.
                        Once removed, you will not be able to use it until you register it again.
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    <div
                        className={"flex w-full items-center justify-end"}
                    >
                        <div
                            className={"flex w-full md:w-fit items-center justify-end"}
                        >
                            <AlertDialog>
                                <AlertDialogTrigger
                                    className={"w-full"}
                                    asChild
                                >
                                    <Button
                                        variant={"destructive"}
                                        className="w-full"
                                        disabled={handleRemoveDeviceMutation.isPending}
                                    >
                                        Remove Device
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Once you remove this device, you will not be able to use it until you
                                            register
                                            it again and
                                            all of your data will be lost. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            disabled={handleRemoveDeviceMutation.isPending}
                                            className={"bg-destructive hover:bg-destructive/90"}
                                            onClick={() => handleRemoveDeviceMutation.mutate()}
                                        >
                                            {handleRemoveDeviceMutation.isPending ? (
                                                <Loader2Icon
                                                    className="h-4 w-4 animate-spin"
                                                />
                                            ) : "Remove Device"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

'use client'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Device, DeviceSession} from "@/interfaces";
import {dateParser} from "@/utils/date-parser";
import {Slider} from "@/components/ui/slider";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getDeviceQueryKey, getDevicesQueryKey, unclaimDevice, updateDevice} from "@/api/devices";
import {toast} from "sonner";
import {Loader2Icon, PencilIcon, StopCircle, XIcon} from "lucide-react";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {
    getDeviceSessionStatus,
    getDeviceSessionStatusQueryKey,
    startDeviceSession,
    stopDeviceSession
} from "@/api/device-sessions";
import {getDeviceStatisticsQueryKey} from "@/api/statistics";

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
import IsOnlineBadge from "@/components/badges/is-online-badge";
import {HoverCard, HoverCardContent, HoverCardTrigger,} from "@/components/ui/hover-card"

import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"

interface DeviceDetailProps {
    device: Device;
}

export function DeviceDetail({device}: DeviceDetailProps) {

    const router = useRouter();
    const {username} = useSelector((state: RootState) => state.auth)
    const queryClient = useQueryClient();
    const [temDeviceSensitivity, setTemDeviceSensitivity] = useState(device.sensitivity);
    const [temDeviceVibrationIntensity, setTemDeviceVibrationIntensity] = useState(device.vibration_intensity);
    const [tempAudioIntensity, setTempAudioIntensity] = useState(device.audio_intensity);
    const [tempDeviceName, setTemDeviceName] = useState(device.name);
    const [isOnline, setIsOnline] = useState(false);

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

    const {
        data: deviceSession,
        isLoading: isLoadingDeviceSession,
        isError: isErrorDeviceSession,
        isSuccess: isSuccessDeviceSession,
    } = useQuery<DeviceSession>({
        queryKey: getDeviceSessionStatusQueryKey(username, device.id),
        queryFn: () => getDeviceSessionStatus(device.id),
        refetchInterval: 1800000,
    })

    const handleSessionMutation = useMutation({
        mutationFn: (session_active: boolean) => {
            if (session_active)
                return stopDeviceSession(device.id);
            else
                return startDeviceSession(device.id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: getDeviceSessionStatusQueryKey(username, device.id),
            })
            await queryClient.invalidateQueries({
                queryKey: getDeviceStatisticsQueryKey(username, device.id),
            })
        },
        onError: (error) => {
            console.error("Error updating device session:", error);
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

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col items-center gap-2">
                <Card className="w-full flex-1 flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle>
                            Device Handler
                        </CardTitle>
                        <CardDescription>
                            This device is registered to your account. You start using it by clicking the button below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoadingDeviceSession ? (
                            <div>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>
                            </div>
                        ) : null}
                        {isErrorDeviceSession ? (
                            <div>
                                <p className="text-red-500">Error fetching device session status.</p>
                            </div>
                        ) : null}

                        {isSuccessDeviceSession && deviceSession.is_idle ? (
                            <Alert
                                variant={"warning"}
                            >
                                <StopCircle className="h-4 w-4"/>
                                <AlertTitle>
                                    Device is idle
                                </AlertTitle>
                                <AlertDescription>
                                    The device has not detected any activity for a while. The normal session will resume
                                    once it detects activity again.
                                </AlertDescription>
                            </Alert>
                        ) : null}


                        {isSuccessDeviceSession ? (
                            <div className="grid gap-4">
                                <HoverCard>
                                    <HoverCardTrigger
                                        className={"w-full cursor-pointer"}
                                    >
                                        <Button
                                            disabled={handleSessionMutation.isPending || !isOnline}
                                            onClick={() => handleSessionMutation.mutate(deviceSession.has_active_session)}
                                            variant={deviceSession.has_active_session ? "outline" : "accent"}
                                            className={"w-full"}
                                        >
                                            {deviceSession.has_active_session ? (
                                                <div className={"flex items-center"}>
                                                    <div
                                                        className={"bg-red-500 rounded-full w-3 h-3 mr-2 animate-pulse"}/>
                                                    Stop Session
                                                </div>
                                            ) : `Start Session`}
                                        </Button>
                                    </HoverCardTrigger>
                                    {!isOnline ? (
                                        <HoverCardContent>
                                            Device is offline. Please check your internet connection.
                                        </HoverCardContent>
                                    ) : null}
                                </HoverCard>
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
                <Card className="w-full flex-1 flex flex-col justify-between">
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
                                        Once you remove this device, you will not be able to use it until you register
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

                    </CardContent>
                </Card>
            </div>
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
                        <IsOnlineBadge
                            deviceId={device.id}
                            setIsOnline={setIsOnline}
                        />
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

                    {/*<div className={"grid gap-2"}>*/}
                    {/*    <div className={"flex items-center justify-between"}>*/}
                    {/*        <span className="font-medium">Sensitivity</span>*/}
                    {/*        <div className="flex items-center">*/}
                    {/*            <span*/}
                    {/*                className="text-muted-foreground text-xs sm:text-sm truncate ml-2"*/}
                    {/*            >*/}
                    {/*                {temDeviceSensitivity}%*/}
                    {/*            </span>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <Slider*/}
                    {/*        defaultValue={[temDeviceSensitivity]}*/}
                    {/*        max={100}*/}
                    {/*        step={1}*/}
                    {/*        onValueChange={(value) => {*/}
                    {/*            setTemDeviceSensitivity(value[0]);*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</div>*/}

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
                        {/*<div className={"grid gap-2"}>*/}
                        {/*    <div className={"flex items-center justify-between"}>*/}
                        {/*        <span className="font-medium">Audio Volume</span>*/}
                        {/*        <div className="flex items-center">*/}
                        {/*        <span*/}
                        {/*            className="text-muted-foreground text-xs sm:text-sm truncate ml-2"*/}
                        {/*        >*/}
                        {/*            {tempAudioIntensity}%*/}
                        {/*        </span>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <Slider*/}
                        {/*        defaultValue={[tempAudioIntensity]}*/}
                        {/*        max={100}*/}
                        {/*        step={1}*/}
                        {/*        onValueChange={(value) => {*/}
                        {/*            setTempAudioIntensity(value[0]);*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*</div>*/}
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
                        variant={"accent"}
                        disabled={
                            temDeviceSensitivity === device.sensitivity
                            && temDeviceVibrationIntensity === device.vibration_intensity
                            && tempDeviceName === device.name
                            // && tempAudioIntensity === device.audio_intensity
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
        </div>
    )
}

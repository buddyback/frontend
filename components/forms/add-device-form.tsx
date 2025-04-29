"use client"

import type React from "react"
import {useState} from "react"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {claimDevice, getDevicesQueryKey} from "@/api/devices";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Loader2Icon} from "lucide-react";
import {useSelector} from "react-redux";
import {RootState} from "@/store";

interface AddDeviceFormProps {
    open: boolean
    action: (open: boolean) => void
}

export function AddDeviceForm({open, action}: AddDeviceFormProps) {

    const {username} = useSelector((state: RootState) => state.auth)
    const queryClient = useQueryClient()

    const emptyDeviceData = {
        name: "",
        id: "",
    }
    const [newDeviceData, setNewDeviceData] = useState(emptyDeviceData)

    const claimDeviceMutation = useMutation({
        mutationFn: () => claimDevice(newDeviceData.id, newDeviceData.name),
        onSuccess: async () => {
            toast.success("Device added successfully")
            await queryClient.invalidateQueries({
                queryKey: getDevicesQueryKey(username),
            })
            setNewDeviceData(emptyDeviceData)
            action(false);
        },
        onError: () => {
            toast.error("An error occurred")
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        claimDeviceMutation.mutate()
    }

    return (
        <Dialog open={open} onOpenChange={action}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Device</DialogTitle>
                        <DialogDescription>
                            Connect a new device to monitor your posture.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="device-name">Device Name</Label>
                                <Input
                                    id="device-name"
                                    placeholder="Living Room, Office, etc."
                                    value={newDeviceData.name}
                                    onChange={(e) => setNewDeviceData({
                                        ...newDeviceData,
                                        name: e.target.value
                                    })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="device-id">Device ID</Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="device-id"
                                        placeholder="Enter device ID"
                                        value={newDeviceData.id}
                                        onChange={(e) => setNewDeviceData({
                                            ...newDeviceData,
                                            id: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    You can find the device ID on the bottom of your Raspberry Pi.
                                </p>
                            </div>

                            <Button
                                className={"cursor-pointer w-full mt-4"}
                                type="submit"
                                disabled={claimDeviceMutation.isPending}
                                variant={"accent"}
                            >
                                {claimDeviceMutation.isPending ? (
                                    <div
                                        className={"flex items-center justify-center"}
                                    >
                                        <Loader2Icon
                                            className={"animate-spin text-center"}
                                            size={20}
                                        />
                                        <span className="ml-2">Adding device</span>
                                    </div>

                                ) : "Add Device"}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

"use client"

import React, {useEffect, useRef, useState} from "react"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {claimDevice, getDevicesQueryKey} from "@/api/devices";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {CameraIcon, Info, Loader2Icon} from "lucide-react";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {Html5Qrcode} from "html5-qrcode";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

interface AddDeviceFormProps {
    open: boolean
    action: (open: boolean) => void
}

export function AddDeviceForm({open, action}: AddDeviceFormProps) {

    const {username} = useSelector((state: RootState) => state.auth)
    const queryClient = useQueryClient()
    const [isScanning, setIsScanning] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const scannerContainerId = "qr-reader";

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

    const handleQrScan = (result: string) => {
        setIsScanning(false);
        setNewDeviceData({
            ...newDeviceData,
            id: result
        });
        toast.success(`QR code scanned successfully`);
    };

    // Modify the startScanner function
    const startScanner = async () => {

        if (isScanning) {
            setIsScanning(false);
            return;
        }

        setError(null);
        setIsScanning(true);

        // Allow time for the DOM to update and render the scanner container
        setTimeout(async () => {
            try {
                if (scannerRef.current) {
                    // Stop any existing scanner first
                    if (scannerRef.current.isScanning) {
                        await scannerRef.current.stop();
                    }
                }

                // Create a new scanner instance
                scannerRef.current = new Html5Qrcode(scannerContainerId);

                await scannerRef.current.start(
                    {facingMode: "environment"},
                    {
                        fps: 10,
                        qrbox: {width: 250, height: 250},
                        aspectRatio: 1.0,
                    },
                    (decodedText) => {
                        handleQrScan(decodedText);
                        stopScanner();
                    },
                    (errorMessage) => {
                        console.log("QR Error:", errorMessage);
                        // Only set error for persistent issues
                        if (errorMessage.includes("NotAllowedError")) {
                            setError("Camera permission denied");
                        }
                    }
                ).catch(err => {
                    console.error("Start error:", err);
                    setError(err instanceof Error ? err.message : "Failed to start camera");
                    setIsScanning(false);
                });
            } catch (err) {
                console.error("Scanner error:", err);
                setError(err instanceof Error ? err.message : "Failed to start camera");
                setIsScanning(false);
            }
        }, 100); // Small delay to ensure DOM is ready
    };

    const stopScanner = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            await scannerRef.current.stop();
            setIsScanning(false);
        }
    };

    // Add this useEffect to stop scanning when dialog closes
    useEffect(() => {
        // When dialog closes, stop scanner if it's active
        if (!open && isScanning) {
            stopScanner();
        }
    }, [open, isScanning]);

    useEffect(() => {
        // Clean up scanner when component unmounts
        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, []);


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
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={startScanner}
                                    >
                                        <CameraIcon className="h-4 w-4"/>
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    You can find the device ID on the bottom of your Raspberry Pi.
                                </p>
                            </div>

                            {isScanning && (
                                <div className="mt-4">
                                    <div className="space-y-4">
                                        {error && (
                                            <Alert variant="warning">
                                                <Info className="h-4 w-4"/>
                                                <AlertTitle>Scanner Error</AlertTitle>
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        )}

                                        <div
                                            id={scannerContainerId}
                                            className={`overflow-hidden rounded-lg ${!isScanning ? 'hidden' : ''}`}
                                            style={{width: '100%', minHeight: '300px'}}
                                        />

                                        {isScanning ? (
                                            <Button
                                                onClick={stopScanner}
                                                variant="outline"
                                                className="w-full"
                                                type={"button"}
                                            >
                                                Cancel Scanning
                                            </Button>
                                        ) : null}
                                    </div>
                                </div>
                            )}

                            {!isScanning ? (
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
                            ) : null}
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
'use client'
import React from 'react';
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ChevronLeft, TrashIcon} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {DataTable} from "@/components/ui/data-table";
import {ColumnDef} from "@tanstack/react-table";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    getRegisteredUsers,
    getRegisteredUsersQueryKey,
    getUnclaimedDevices,
    getUnclaimedDevicesQueryKey
} from "@/api/admin";
import {User} from "@/interfaces";
import {djangoInstance} from "@/config/axios-config";
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


const AdminPanel = () => {

    const queryClient = useQueryClient();

    type UnclaimedDevice = {
        id: string;
        api_key: string;
    }

    const deleteDeviceMutation = useMutation({
        mutationFn: (id: string) => {
            return djangoInstance.delete(`/devices/${id}/`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: getUnclaimedDevicesQueryKey(),
            })
        }
    })

    const unclaimedDeviceColumns: ColumnDef<UnclaimedDevice>[] = [
        {
            accessorKey: "id",
            header: "Device ID",
        },
        {
            accessorKey: "api_key",
            header: "Device API Key",
        },
        {
            accessorKey: "actions",
            header: "Remove",
            cell: ({row}) => {
                return (
                    <AlertDialog>
                        <AlertDialogTrigger
                            asChild
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                            >
                                <TrashIcon
                                    className="h-5 w-5 text-red-500"
                                />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the device and
                                    remove it from the system.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className={"bg-destructive hover:bg-destructive/90"}
                                    onClick={() => {
                                        deleteDeviceMutation.mutate(row.original.id)
                                    }}
                                    disabled={deleteDeviceMutation.isPending}
                                >
                                    Confirm
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )
            }
        }
    ]

    const {
        data: unclaimedDevices,
        isSuccess: isSuccessUnclaimedDevices,
    } = useQuery({
        queryKey: getUnclaimedDevicesQueryKey(),
        queryFn: () => getUnclaimedDevices(),
    })

    const registeredUsersColumns: ColumnDef<User>[] = [
        {
            accessorKey: "id",
            header: "User ID",
        },
        {
            accessorKey: "username",
            header: "Username",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "is_staff",
            header: "Is Staff",
        },
    ]

    const {
        data: registeredUsers,
        isSuccess: isSuccessRegisteredUsers,
    } = useQuery({
        queryKey: getRegisteredUsersQueryKey(),
        queryFn: () => getRegisteredUsers(),
    })

    const addDeviceMutation = useMutation({
        mutationFn: () => {
            return djangoInstance.post("/devices/", {}, {
                responseType: 'blob'
            });
        },
        onSuccess: (response) => {
            if (response.data instanceof Blob) {
                const url = window.URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = url;

                let filename = 'device.png'; // Default filename

                // Headers in axios are case-insensitive and accessible via response.headers
                const contentDisposition = response.headers['content-disposition'] ||
                    response.headers['Content-Disposition'];

                if (contentDisposition) {
                    // Using regex to extract filename from quotes
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches = filenameRegex.exec(contentDisposition);
                    if (matches != null && matches[1]) {
                        // Remove quotes if present
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }

                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                // Optionally notify user
                console.log(`Device QR code downloaded as ${filename}`);
            }

            queryClient.invalidateQueries({
                queryKey: getUnclaimedDevicesQueryKey(),
            });
        },
        onError: (error) => {
            console.error("Failed to add device:", error);
        }
    });

    return (
        <div>
            <div className="flex items-center gap-2">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4"/>
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Admin Panel</h2>
            </div>

            <div className="my-10 flex flex-col gap-10">
                <Card>
                    <CardHeader>
                        <div className={"flex items-center justify-between gap-10"}>
                            <div>
                                <CardTitle>Unclaimed Devices</CardTitle>
                                <CardDescription>
                                    List of devices that are unclaimed and can be claimed by users.
                                </CardDescription>
                            </div>
                            <Button
                                variant="accent"
                                disabled={addDeviceMutation.isPending}
                                onClick={() => addDeviceMutation.mutate()}
                            >
                                Add Device
                            </Button>
                        </div>

                    </CardHeader>
                    <CardContent>
                        {isSuccessUnclaimedDevices ? (
                            <DataTable
                                columns={unclaimedDeviceColumns}
                                data={unclaimedDevices}
                            />
                        ) : null}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>
                            List of users that are registered in the system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            {isSuccessRegisteredUsers ? (
                                <DataTable
                                    columns={registeredUsersColumns}
                                    data={registeredUsers}
                                />
                            ) : null}
                        </div>
                    </CardContent>
                </Card>
            </div>


        </div>
    );
};

export default AdminPanel;
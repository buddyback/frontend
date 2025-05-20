"use client"

import Link from "next/link"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {LogOut, Moon, Sun, User} from "lucide-react"
import BaseContainer from "@/providers/base-container";
import {useAuth} from "@/providers/auth-provider";
import {RootState} from "@/store";
import {useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import Image from "next/image";
import buddyBack from "@/assets/buddyback.svg"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const {logout} = useAuth();
    const {username, email, is_staff} = useSelector((state: RootState) => state.auth)
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Only show theme UI after hydration to avoid mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="border-b">
            <BaseContainer>
                <div className="flex h-16 items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard" className={"flex gap-2 items-center"}>
                            <Image
                                src={buddyBack}
                                alt={"buddyback logo"}
                                className="h-8 w-8 dark:invert"
                            />
                            <span className="font-bold sm:inline-block dark:text-white">BuddyBack</span>
                        </Link>
                    </div>
                    <div
                        className={"flex items-center gap-4"}
                    >
                        {is_staff ? (
                            <div>
                                <Link href="/dashboard/admin">
                                    <Button
                                        variant="outline"
                                    >
                                        Admin Panel
                                    </Button>
                                </Link>
                            </div>
                        ) : null}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@user"/>
                                        <AvatarFallback>
                                            {username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {username}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">{email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem
                                    onClick={() => router.push("/dashboard/profile")}
                                >
                                    <User className="mr-2 h-4 w-4"/>
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                {mounted && (
                                    <DropdownMenuItem
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    >
                                        {theme === 'dark' ? (
                                            <Sun className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Moon className="mr-2 h-4 w-4" />
                                        )}
                                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    onClick={() => logout()}
                                >
                                    <LogOut className="mr-2 h-4 w-4"/>
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </BaseContainer>
        </header>
    )
}
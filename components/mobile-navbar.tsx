"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function MobileNavbar() {
    const [open, setOpen] = React.useState(false)
    const pathname = usePathname()

    const routes = [
        {
            href: "/dashboard",
            label: "Dashboard",
        },
        {
            href: "/dashboard/devices",
            label: "Devices",
        },
        {
            href: "/dashboard/analytics",
            label: "Analytics",
        },
        {
            href: "/dashboard/settings",
            label: "Settings",
        },
    ]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <SheetHeader>
                    <SheetTitle className="text-left">BuddyBack</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-4">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={`text-sm font-medium ${
                                pathname === route.href ? "text-foreground" : "text-muted-foreground"
                            } transition-colors hover:text-foreground`}
                            onClick={() => setOpen(false)}
                        >
                            {route.label}
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    )
}

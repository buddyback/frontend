import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner"
import ReduxProvider from "@/providers/redux-provider";
import ReactQueryProvider from "@/providers/react-query-provider";
import {AuthProvider} from "@/providers/auth-provider";
import {AuthLoading} from "@/providers/auth-loading";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "BuddyBack",
    description: "",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ReduxProvider>
            <ReactQueryProvider>
                <AuthProvider>
                    <AuthLoading>
                        {children}
                        <Toaster/>
                    </AuthLoading>
                </AuthProvider>
            </ReactQueryProvider>
        </ReduxProvider>
        </body>
        </html>
    );
}

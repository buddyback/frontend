import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner"
import ReduxProvider from "@/providers/redux-provider";
import ReactQueryProvider from "@/providers/react-query-provider";
import {AuthProvider} from "@/providers/auth-provider";
import {AuthLoading} from "@/providers/auth-loading";
import {ThemeProvider} from "@/providers/theme-provider";

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
        <html lang="en" suppressHydrationWarning>
        <head>
            <meta name="apple-mobile-web-app-title" content="BuddyBack"/>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
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
        </ThemeProvider>
        </body>
        </html>
    );
}

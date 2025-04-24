"use client"

import type React from "react"
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {useAuth} from "@/providers/auth-provider";

export function LoginForm() {

    const {login, loading} = useAuth();
    const [loginData, setLoginData] = useState({username: "", password: ""});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(loginData.username, loginData.password);
    };

    return (
        <div className={"grid gap-10"}>
            <div className={""}>
                <h1 className="text-2xl font-bold text-center">Welcome to BuddyBack</h1>
                <p className="text-sm text-muted-foreground text-center">
                    Enter your credentials to access your account
                </p>
            </div>
            <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>Enter your credentials to access your account</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="username"
                                        required
                                        onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="password"
                                        required
                                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter
                                className={"mt-10"}
                            >
                                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700"
                                        disabled={loading}>
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
                <TabsContent value="register">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create an account</CardTitle>
                            <CardDescription>Enter your information to create an account</CardDescription>
                        </CardHeader>
                        <form onSubmit={() => {
                        }}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="John Doe" required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="name@example.com" required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" required/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm">Confirm Password</Label>
                                    <Input id="confirm" type="password" required/>
                                </div>
                            </CardContent>
                            <CardFooter
                                className={"mt-10"}
                            >
                                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700"
                                        disabled={loading}>
                                    {loading ? "Creating account..." : "Create account"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

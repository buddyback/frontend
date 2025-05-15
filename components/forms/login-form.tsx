"use client"

import type React from "react"
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {useAuth} from "@/providers/auth-provider";
import {useMutation} from "@tanstack/react-query";
import {djangoInstance} from "@/config/axios-config";
import {toast} from "sonner";
import {Typewriter} from "@/components/ui/typewriter-text";

export function LoginForm() {

    const {login, loading} = useAuth();
    const [loginData, setLoginData] = useState({username: "", password: ""});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(loginData.username, loginData.password);
    };

    const emptyRegisterData = {
        username: "",
        email: "",
        password: "",
        re_password: "",
    }

    const [registerData, setRegisterData] = useState(emptyRegisterData);

    const registerMutation = useMutation({
        mutationFn: async () => {
            const res = await djangoInstance.post("/auth/users/", registerData)
            return res.data;
        },
        onSuccess: async () => {
            toast.success("User registered successfully.");
            setRegisterData(emptyRegisterData);
        },
        onError: async (error) => {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An error occurred while registering the user.");
            }
        }
    })

    const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (registerData.password !== registerData.re_password) {
            toast.error("Passwords do not match.");
            return;
        }
        registerMutation.mutate();
    }

    return (
        <div className={"grid gap-10"}>
            <div className={""}>
                <div
                    className={"flex justify-center"}
                >
                    <Typewriter
                        text={["Welcome to BuddyBack"]}
                        speed={100}
                        loop={true}
                        className="text-2xl font-bold"
                    />
                </div>

                {/*<h1 className="text-2xl font-bold text-center">Welcome to BuddyBack</h1>*/}
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
                        <form onSubmit={handleRegisterSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        placeholder="John Doe"
                                        required
                                        onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                                        value={registerData.username}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                                        value={registerData.email}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                                        value={registerData.password}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm">Confirm Password</Label>
                                    <Input
                                        id="confirm"
                                        type="password"
                                        required
                                        onChange={(e) => setRegisterData({
                                            ...registerData,
                                            re_password: e.target.value
                                        })}
                                        value={registerData.re_password}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter
                                className={"mt-10"}
                            >
                                <Button
                                    type="submit"
                                    className="w-full"
                                    variant={"accent"}
                                    disabled={registerMutation.isPending}
                                >
                                    {registerMutation.isPending ? "Creating account..." : "Create account"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

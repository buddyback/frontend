import {LoginForm} from "@/components/forms/login-form";
import BaseContainer from "@/providers/base-container";

export default function Home() {
    return (
        <BaseContainer>
            <div
                className={"h-screen items-center justify-center flex"}
            >
                <div className={"md:w-3/5"}>
                    <LoginForm/>
                </div>
            </div>
        </BaseContainer>
    );
}

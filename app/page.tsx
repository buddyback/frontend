import {LoginForm} from "@/components/forms/login-form";
import BaseContainer from "@/providers/base-container";

export default function Home() {
    return (
        <BaseContainer>
            <div
                className={"min-h-screen flex flex-col items-center justify-center"}
            >
                <div className={"md:w-3/5"}>
                    <LoginForm/>
                </div>
            </div>
        </BaseContainer>
    );
}

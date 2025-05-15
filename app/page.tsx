import {LoginForm} from "@/components/forms/login-form";
import BaseContainer from "@/providers/base-container";
import {Particles} from "@/components/ui/particles";

export default function Home() {
    return (
        <BaseContainer>
            <div className="w-screen h-screen absolute inset-0 z-0">
                <Particles
                    quantity={300}
                />
            </div>
            <div
                className={"min-h-screen flex flex-col items-center justify-center relative"}
            >
                <div className={"md:w-3/5"}>
                    <LoginForm/>
                </div>
            </div>
        </BaseContainer>
    );
}

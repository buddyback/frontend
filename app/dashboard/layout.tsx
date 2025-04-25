import React from 'react';
import {Navbar} from "@/components/navbar";
import BaseContainer from "@/providers/base-container";
import {ReactNodeChildrenProp} from "@/interfaces";


const Layout = ({children}: ReactNodeChildrenProp) => {
    return (
        <div>
            <Navbar/>
            <BaseContainer>
                <div
                    className={"mb-20 mt-10"}
                >
                    {children}
                </div>
            </BaseContainer>
        </div>
    );
};

export default Layout;
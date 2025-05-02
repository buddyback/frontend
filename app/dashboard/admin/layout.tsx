'use client'
import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {useRouter} from "next/navigation";
import {ReactNodeChildrenProp} from "@/interfaces";

const AdminLayout = ({children}: ReactNodeChildrenProp) => {

    const {is_staff} = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!is_staff) {
            router.push("/dashboard");
        }
    }, [])

    return (
        <>
            {children}
        </>
    );
};

export default AdminLayout;
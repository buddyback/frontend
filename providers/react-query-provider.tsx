'use client'
import React from 'react';
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

interface ReactQueryProviderProps {
    children: React.ReactNode;
}


const queryClient = new QueryClient()

const ReactQueryProvider = ({children}: ReactQueryProviderProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false}/>
            {children}
        </QueryClientProvider>
    );
};

export default ReactQueryProvider;

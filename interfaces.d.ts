interface ReactNodeChildrenProp {
    children: React.ReactNode;
}

interface Device {
    id: string;
    name: string;
    status: "online" | "offline";
    battery: number;
    lastSync: string;
    signal: "strong" | "medium" | "weak";
}
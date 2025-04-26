import React from "react";

interface ReactNodeChildrenProp {
    children: React.ReactNode;
}

export interface Device {
    id: string;
    user: number;
    user_username: string;
    name: string;
    registration_date: string; // ISO 8601 format
    is_active: boolean;
    sensitivity: number;
    vibration_intensity: number;
    api_key: string;
}

export interface PostureRecord {
    device: string;
    timestamp: string; // ISO 8601 format
    overall_score: number;
    components: Component[];
}

export interface Component {
    component_type: string;
    is_correct: boolean;
    score: number;
    correction: string;
}
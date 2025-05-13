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
    audio_intensity: number;
    api_key: string;
    has_active_session: boolean;
    is_idle: boolean;
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

export interface DeviceStatistics {
    device_id: string;
    device_name: string;
    active_session: ActiveSession;
    summary: Summary;
    current_period: CurrentPeriod;
    comparisons: Comparisons;
}

export interface ActiveSession {
    start_time: string; // ISO 8601 format
    current_duration_seconds: number;
}

export interface Summary {
    average_session_seconds: number;
    total_sessions: number;
    total_seconds: number;
    consistency_score: number;
    current_streak_days: number;
}

export interface CurrentPeriod {
    today_seconds: number;
    today_sessions: number;
    this_week_seconds: number;
    this_week_sessions: number;
    this_month_seconds: number;
    this_month_sessions: number;
}

export interface Comparisons {
    day_change_percent: number;
    week_change_percent: number;
    month_change_percent: number;
}

export interface DeviceSession {
    has_active_session: boolean;
    is_idle: boolean;
}

interface User {
    id: number;
    email: string;
    username: string;
    is_staff: boolean;
}

interface Tier {
    id: number;
    name: string;
    minimum_score: number;
}

interface NextTier {
    name: string;
    minimum_score: number;
    points_needed: number;
}

interface UserRank {
    id: number;
    user: string;
    category: string;
    tier: Tier;
    current_score: number;
    last_updated: string;
    next_tier: NextTier;
}
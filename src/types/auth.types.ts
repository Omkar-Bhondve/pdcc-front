export interface Permission {
    permission_id: number;
    permission_code: string;
    permission_name: string;
    module: string;
    description?: string;
}

export interface Role {
    role_id: number;
    role_name: string;
    role_code: string;
    description?: string;
    is_system_role?: boolean;
    is_active?: boolean;
    permissions?: Permission[];
}

export interface User {
    admin_id: number;
    username: string;
    full_name: string;
    email: string;
    mobile_no?: string;
    role_id: number;
    role_name: string;
    role?: Role;
    district_id: number | null;
    is_active: boolean;
    permissions: string[];
}

export interface AuthUser {
    id: number;
    username: string;
    full_name: string;
    email: string;
    role: string;
    role_name: string;
    district_id: number | null;
    permissions: string[];
}

export interface AuthResponse {
    user: AuthUser;
    tokens: {
        access_token: string;
        refresh_token: string;
        expires_at: string;
    };
}

export interface LoginCredentials {
    username: string;
    password: string;
}

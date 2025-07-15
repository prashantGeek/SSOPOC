export interface User{
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationId: string;
    role: 'admin' | 'user' | 'moderator';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    }

export interface Organization {
    id: string;
    name: string;
    domain: string;
    ssoConfig:{
        enabled: boolean;
        provider: string;
        settings: Record<string, any>;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface LoginRequest {
    email: string;
    password: string;
    organizationDomain?: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationDomain: string;
}  

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: Omit<User, 'password'>;
    message?: string;
}   

export interface JWTPayload {
    userId: string;
    email: string;
    organizationId: string;
    role: string;
    iat?: number;
    exp?: number;
}

export interface ApiResponse<T = any>{
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
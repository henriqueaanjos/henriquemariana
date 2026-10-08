import { api } from "@/src/libs/axios";
import { AdminLoginInput } from "../app/login/page";

interface AdminLoginResponse {
    success: boolean;
}

interface AdminLoginError {
    error: string;
}

export async function adminLogin(
    password: AdminLoginInput["password"]
): Promise<AdminLoginResponse> {
    const { data } = await api.post<AdminLoginResponse>(
        "/api/admin/login",
        {
            password,
        }
    );

    return data;
}

export async function adminLogout() {
    const { data } = await api.post(
        "/api/admin/logout"
    );

    return data;
}
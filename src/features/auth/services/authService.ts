import api from "../../../lib/axios";
import type { loginDto } from "../../../types/login";
import type { Auth } from "../../../types/authResponse";
import type { registerDTO } from "../../../types/register";
import type { ApiError } from "../../../types/api";

export const login = async (data: loginDto): Promise<Auth> => {
    try {
        const response = await api.post<Auth>("/auth/login", data)
        return response.data
    } catch (error) {
        const apiError = error as ApiError

        throw apiError
    }

}

export const register = async (data: registerDTO): Promise<Auth> => {
    try {
        const response = await api.post<Auth>("/auth/register", data)

        return response.data
    } catch (error) {
        const apiError = error as ApiError

        throw apiError
    }
}

export const logout = async (): Promise<void> => {

    try {
        await api.post("/auth/logout")
    } catch (error) {
        const apiError = error as ApiError
        throw apiError
    }
}



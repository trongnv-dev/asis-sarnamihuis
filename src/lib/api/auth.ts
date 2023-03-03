import API from "./client"
import { AuthStore } from "lib/local_store/"
import { AdminUser } from "interfaces"

export type LoginReponse = {
    user: AdminUser
    access_token: string
}

export async function login(email: string, password: string): Promise<AdminUser> {
    const res = await API().post('/v1/auth/login', {
        email: email,
        password: password
    })
    const data: LoginReponse = res.data
    AuthStore.saveToken(data.access_token)
    return data.user
}

export async function me(): Promise<AdminUser> {
    const res = await API().get('/v1/auth/me')
    const data: AdminUser = res.data
    return data
}
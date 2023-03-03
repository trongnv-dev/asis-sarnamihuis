import { AuthStore } from "lib/local_store/"

async function tokenVerifyCookie(ctx) {
    let token = await AuthStore.getToken(ctx)
    return token
}

export default tokenVerifyCookie

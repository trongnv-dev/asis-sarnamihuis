import { AuthStore } from "lib/local_store/"

const apiConfig = (ctx) => {
    let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
    const token = AuthStore.getToken(ctx)

    if (token) {
        headers.apikey = `${token}`
    }

    const option = {
        headers,
        responseType: 'json'
    }

    return option;
}

export default apiConfig

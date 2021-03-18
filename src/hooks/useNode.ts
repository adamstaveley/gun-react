export function useNode() {
    const port = 8081;
    return {
        async requestLogin(email: string) {
            await fetch(`http://localhost:${port}/auth/request-login?email=${email}`, { method: 'POST' });
        },
        async login(email: string, token: string) {
            await fetch(`http://localhost:${port}/auth/login?email=${email}&token=${token}`)
        }
    }
}

export function useNode() {
    return {
        async requestLogin(email: string) {
            await fetch('http://localhost:8081/auth/request-login?email=' + email);
        },
        async login(email: string, token: string) {
            await fetch(`http://localhost:8081/auth/login?email=${email}&token=${token}`)
        }
    }
}

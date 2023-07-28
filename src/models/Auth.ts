export class AccessTokenVrifyModel {
    user: {
        userId: string
        JWT_SECRET_KEY: string
        iat: string
        exp: string
    }
}


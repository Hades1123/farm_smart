import { env } from "./env"

export const cookieConfig = {
    refreshToken: {
        httpOnly: true,      
        secure: env.NODE_ENV === 'production', 
        sameSite: 'lax' as const,  
        maxAge: 7 * 24 * 60 * 60 * 1000, 
    },
};
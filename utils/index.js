import jwt from 'jsonwebtoken'

export const signJWT = (obj, type, time) => {
    const secret = type === 'access' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET
    
    return jwt.sign(
        { ...obj },
        secret,
        { expiresIn: time }
    )
}


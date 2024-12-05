import jwt from 'jsonwebtoken'

export const signJWT = (obj, type, expiresIn) => {
    const secret = type === 'access' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET

    return jwt.sign(
        { ...obj },
        secret,
        { expiresIn }
    )
}

export const signTokens = (res, userInfo) => {
    const accessToken = signJWT({ ...userInfo }, "access", "1d");
    const refreshToken = signJWT(
      { username: userInfo.username },
      "refresh",
      "15d"
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  };

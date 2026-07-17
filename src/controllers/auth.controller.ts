import { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
    createUser,
    findUser,
    saveRefreshToken,
    removeRefreshToken,
} from "../models/user.model";

const jwtSecret = process.env.JWT_SECRET!;
const refreshSecret = process.env.REFRESH_SECRET!;

const schema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
});

const createAccessToken = (
  id: string,
  username: string
) =>
  jwt.sign(
    {
      id,
      username,
    },
    jwtSecret,
    {
      expiresIn: "15m",
    }
  );

const createRefreshToken = (
  id: string,
  username: string
) =>
  jwt.sign(
    {
      id,
      username,
    },
    refreshSecret,
    {
      expiresIn: "7d",
    }
  );

export const register = async (
    req: Request,
    res: Response
) => {

    const { error, value } = schema.validate(req.body);

    if (error)
        return res.status(400).json({
            message: "Invalid input",
        });

    const hash = await bcrypt.hash(
        value.password,
        10
    );

    try {

        await createUser(
            value.username,
            hash
        );

        return res.json({
            message: "Registered",
        });

    } catch {

        return res.status(409).json({
            message: "Username already exists",
        });

    }
};

export const login = async (
    req: Request,
    res: Response
) => {

    const { error, value } = schema.validate(req.body);

    if (error)
        return res.status(400).json({
            message: "Invalid input",
        });

    const user = await findUser(
        value.username
    );

    if (!user)
        return res.status(401).json({
            message: "Invalid credentials",
        });

    const valid = await bcrypt.compare(
        value.password,
        user.password_hash
    );

    if (!valid)
        return res.status(401).json({
            message: "Invalid credentials",
        });

    const accessToken = createAccessToken(
    user.id,
    user.username
);

const refreshToken = createRefreshToken(
    user.id,
    user.username
);

    await saveRefreshToken(
        value.username,
        refreshToken
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
        accessToken,
    });
};

export const logout = async (
    req: Request,
    res: Response
) => {

    const token = req.cookies.refreshToken;

    if (token) {
        await removeRefreshToken(token);
    }

    res.clearCookie("refreshToken");

    res.json({
        message: "Logged out",
    });
};






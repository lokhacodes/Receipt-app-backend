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

// Schema for registration with name, email, password, confirmPassword
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
    }),
});

// Schema for login with email and password
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const createAccessToken = (
  id: string,
  email: string,
  name: string
) =>
  jwt.sign(
    {
      id,
      email,
      name,
    },
    jwtSecret,
    {
      expiresIn: "15m",
    }
  );

const createRefreshToken = (
  id: string,
  email: string,
  name: string
) =>
  jwt.sign(
    {
      id,
      email,
      name,
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

    const { error, value } = registerSchema.validate(req.body);

    if (error) {
        const message = error.details[0]?.message || "Invalid input";
        return res.status(400).json({
            message,
        });
    }

    const hash = await bcrypt.hash(
        value.password,
        10
    );

    try {

        await createUser(
            value.name,
            value.email,
            hash
        );

        return res.json({
            message: "Registered successfully",
        });

    } catch (err: any) {

        // Check for duplicate email error
        if (err?.code === '23505' || err?.constraint === 'users_email_key') {
            return res.status(409).json({
                message: "Email already exists",
            });
        }

        return res.status(409).json({
            message: "Email already exists",
        });

    }
};

export const login = async (
    req: Request,
    res: Response
) => {

    const { error, value } = loginSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: "Invalid input",
        });
    }

    const user = await findUser(
        value.email
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
    user.email,
    user.name
);

const refreshToken = createRefreshToken(
    user.id,
    user.email,
    user.name
);

    await saveRefreshToken(
        value.email,
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

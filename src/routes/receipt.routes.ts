import { Router, RequestHandler } from "express";

import { upload } from "../middleware/upload.middleware";

import { uploadReceipt } from "../controllers/receipt.controller";

import { authenticate } from "../middleware/auth.middleware";

const router=Router();

router.post(

    "/upload",

    authenticate as RequestHandler,

    upload.single("image"),

    uploadReceipt

);

export default router;
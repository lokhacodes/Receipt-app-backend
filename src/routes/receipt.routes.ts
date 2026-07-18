import { Router, RequestHandler } from "express";

import { upload } from "../middleware/upload";

import { scanReceipt } from "../controllers/receipt.controller";

import { authenticate } from "../middleware/auth.middleware";

const router=Router();

router.post(

    "/scan",

    authenticate as RequestHandler,

    upload.single("image"),

    scanReceipt

);

export default router;
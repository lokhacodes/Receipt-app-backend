import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({

    destination(req,file,cb){

        cb(null,"uploads/");

    },

    filename(req,file,cb){

        const ext=path.extname(file.originalname);

        cb(null,uuid()+ext);

    }

});

export const upload=multer({

    storage

});
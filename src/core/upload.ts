import multer, { diskStorage } from "multer";
import * as fs from "fs";
import { join } from "path";
import Globals from "./globals";

const Upload = (path?: string) => {
    const uploadFolderPath = join(__dirname, "../..", Globals.UPLOAD_FOLDER_DEFAULT_PATH, path ?? ".");
    if (!fs.existsSync(uploadFolderPath)) {
        fs.mkdirSync(uploadFolderPath, { recursive: true });
    }
    return multer({
        storage: diskStorage({
            destination: (req, file, cb) => {
                cb(null, uploadFolderPath);
            },
            filename(req, file, cb) {
                const [name, ...exts] = file.originalname.split(".");
                let filename = `${name}.${exts.join(".")}`;
                let filePath = join(uploadFolderPath, filename);
                let i = 1;
                while (fs.existsSync(filePath)) {
                    filename = `${name} (${i}).${exts.join(".")}`;
                    filePath = join(uploadFolderPath, filename);
                    i++;
                }
                cb(null, filename);
            }
        })
    });
};

export default Upload;
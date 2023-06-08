"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destination = exports.imageFileFilter = exports.editFileName = void 0;
const path_1 = require("path");
const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtensionName = (0, path_1.extname)(file.originalname);
    const randomeName = Date.now();
    callback(null, randomeName + "-" + name + fileExtensionName);
};
exports.editFileName = editFileName;
const imageFileFilter = (req, file, cb) => {
    let allowtype = [".jpg", ".png", ".jpeg"];
    const ext = (0, path_1.extname)(file.originalname).toLowerCase();
    if (allowtype.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file "));
    }
};
exports.imageFileFilter = imageFileFilter;
const destination = (req, file, cb) => {
    cb(null, "./public/uploads");
};
exports.destination = destination;
//# sourceMappingURL=filesconfig.multer.js.map
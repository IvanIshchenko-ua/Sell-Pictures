"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageCtrl = void 0;
const uploadImageCtrl = (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: "Файл не завантажено" });
    const image_url = `/uploads/${req.file.filename}`;
    res.json({ image_url });
};
exports.uploadImageCtrl = uploadImageCtrl;

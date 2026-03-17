"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaintingCtrl = exports.updatePaintingCtrl = exports.createPaintingCtrl = exports.getPainting = exports.getPaintings = void 0;
const Painting_1 = require("../models/Painting");
const validation_1 = require("../utils/validation");
const logger_1 = require("../utils/logger");
const getPaintings = async (_, res) => {
    const list = await (0, Painting_1.getAllPaintings)();
    res.json(list);
};
exports.getPaintings = getPaintings;
const getPainting = async (req, res) => {
    const id = Number(req.params.id);
    const painting = await (0, Painting_1.getPaintingById)(id);
    if (!painting)
        return res.status(404).json({ message: "Картину не знайдено" });
    res.json(painting);
};
exports.getPainting = getPainting;
const createPaintingCtrl = async (req, res) => {
    const check = (0, validation_1.validatePaintingInput)(req.body);
    if (!check.ok)
        return res.status(400).json({ message: check.message });
    const id = await (0, Painting_1.createPainting)((0, validation_1.normalizePaintingInput)(req.body));
    logger_1.securityLog.info("painting.created", {
        requestId: req.requestId,
        adminId: req.admin?.id,
        paintingId: id
    });
    res.status(201).json({ id });
};
exports.createPaintingCtrl = createPaintingCtrl;
const updatePaintingCtrl = async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Некоректний ID" });
    }
    const check = (0, validation_1.validatePaintingInput)(req.body);
    if (!check.ok)
        return res.status(400).json({ message: check.message });
    await (0, Painting_1.updatePainting)(id, (0, validation_1.normalizePaintingInput)(req.body));
    logger_1.securityLog.info("painting.updated", {
        requestId: req.requestId,
        adminId: req.admin?.id,
        paintingId: id
    });
    res.json({ message: "Оновлено" });
};
exports.updatePaintingCtrl = updatePaintingCtrl;
const deletePaintingCtrl = async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Некоректний ID" });
    }
    await (0, Painting_1.deletePainting)(id);
    logger_1.securityLog.warn("painting.deleted", {
        requestId: req.requestId,
        adminId: req.admin?.id,
        paintingId: id
    });
    res.json({ message: "Видалено" });
};
exports.deletePaintingCtrl = deletePaintingCtrl;

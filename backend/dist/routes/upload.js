"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/image', (req, res) => {
    res.json({ message: 'Image upload endpoint - TODO' });
});
router.post('/pdf', (req, res) => {
    res.json({ message: 'PDF upload endpoint - TODO' });
});
router.post('/video', (req, res) => {
    res.json({ message: 'Video upload endpoint - TODO' });
});
exports.default = router;
//# sourceMappingURL=upload.js.map
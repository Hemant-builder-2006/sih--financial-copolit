"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/summarize', (req, res) => {
    res.json({ message: 'AI summarize endpoint - TODO' });
});
router.post('/expand', (req, res) => {
    res.json({ message: 'AI expand endpoint - TODO' });
});
router.post('/tag', (req, res) => {
    res.json({ message: 'AI tag endpoint - TODO' });
});
router.post('/generate-embeddings', (req, res) => {
    res.json({ message: 'AI embeddings endpoint - TODO' });
});
exports.default = router;
//# sourceMappingURL=ai.js.map
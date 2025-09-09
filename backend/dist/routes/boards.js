"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.json({ message: 'Get boards endpoint - TODO' });
});
router.post('/', (req, res) => {
    res.json({ message: 'Create board endpoint - TODO' });
});
router.get('/:id', (req, res) => {
    res.json({ message: 'Get board endpoint - TODO' });
});
router.put('/:id', (req, res) => {
    res.json({ message: 'Update board endpoint - TODO' });
});
router.delete('/:id', (req, res) => {
    res.json({ message: 'Delete board endpoint - TODO' });
});
exports.default = router;
//# sourceMappingURL=boards.js.map
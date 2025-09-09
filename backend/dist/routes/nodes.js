"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/:boardId', (req, res) => {
    res.json({ message: 'Get nodes endpoint - TODO' });
});
router.post('/', (req, res) => {
    res.json({ message: 'Create node endpoint - TODO' });
});
router.put('/:id', (req, res) => {
    res.json({ message: 'Update node endpoint - TODO' });
});
router.delete('/:id', (req, res) => {
    res.json({ message: 'Delete node endpoint - TODO' });
});
exports.default = router;
//# sourceMappingURL=nodes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => {
    res.json({ message: 'Login endpoint - TODO' });
});
router.post('/register', (req, res) => {
    res.json({ message: 'Register endpoint - TODO' });
});
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout endpoint - TODO' });
});
exports.default = router;
//# sourceMappingURL=auth.js.map
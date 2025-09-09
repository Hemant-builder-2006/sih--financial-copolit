"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/stripe', (req, res) => {
    res.json({ message: 'Stripe webhook endpoint - TODO' });
});
exports.default = router;
//# sourceMappingURL=webhooks.js.map
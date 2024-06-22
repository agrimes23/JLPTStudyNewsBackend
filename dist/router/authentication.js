"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../middleware/index");
const authentication_1 = require("../controllers/authentication");
exports.default = (router) => {
    router.post('/auth/register', index_1.hashPassword, authentication_1.register);
    router.get('/auth/refresh', authentication_1.refresh);
    router.post('/auth/login', authentication_1.login);
    router.post('/auth/logout', authentication_1.logout);
};
//# sourceMappingURL=authentication.js.map
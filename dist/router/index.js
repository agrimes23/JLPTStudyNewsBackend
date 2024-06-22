"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const newsRoutes_1 = __importDefault(require("./newsRoutes"));
const authentication_1 = __importDefault(require("./authentication"));
const users_1 = __importDefault(require("./users"));
const flashcardDeck_1 = __importDefault(require("./flashcardDeck"));
const jlptKanji_1 = __importDefault(require("./jlptKanji"));
const router = express_1.default.Router();
exports.default = () => {
    (0, authentication_1.default)(router);
    (0, users_1.default)(router);
    (0, flashcardDeck_1.default)(router);
    (0, jlptKanji_1.default)(router);
    (0, newsRoutes_1.default)(router);
    return router;
};
//# sourceMappingURL=index.js.map
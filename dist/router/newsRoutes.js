"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const newsArticlesKanji_1 = require("../controllers/newsArticlesKanji");
exports.default = (router) => {
    router.get('/api/news', newsArticlesKanji_1.getNews);
};
//# sourceMappingURL=newsRoutes.js.map
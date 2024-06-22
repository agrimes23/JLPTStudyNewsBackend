"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNews = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
require('dotenv').config();
// Load kanji data
const kanjiLevels = [1, 2, 3, 4, 5].map(level => {
    const data = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'kanjiData', `n${level}.json`), 'utf-8');
    return JSON.parse(data);
});
const getNews = async (req, res) => {
    try {
        const newsResponse = await axios_1.default.get(`https://newsapi.org/v2/top-headlines?country=jp&apiKey=${process.env.NEWS_API_KEY}`);
        const articles = newsResponse.data.articles;
        const articlesWithKanji = articles.map((article) => {
            const { title, description } = article;
            const text = `${title} ${description}`;
            const matchedKanji = {};
            kanjiLevels.forEach((level, index) => {
                level.forEach(kanjiItem => {
                    if (text.includes(kanjiItem.word)) {
                        if (!matchedKanji[kanjiItem.word]) {
                            matchedKanji[kanjiItem.word] = { ...kanjiItem, level: index + 1 };
                        }
                    }
                });
            });
            return {
                ...article,
                matchedKanji: Object.values(matchedKanji)
            };
        });
        console.log("Articles with matched kanji: " + JSON.stringify(articlesWithKanji));
        res.json({ articles: articlesWithKanji });
    }
    catch (error) {
        console.error('Error fetching news:', error);
        // res.status(500).send('Error fetching news');
    }
};
exports.getNews = getNews;
//# sourceMappingURL=newsArticlesKanji.js.map
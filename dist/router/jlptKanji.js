"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const fs_1 = __importDefault(require("fs"));
exports.default = (router) => {
    router.get("/search/:level", async (req, res) => {
        let level = req.params.level;
        try {
            const response = await fetch(`https://newsapi.org/v2/top-headlines?country=jp&apiKey=${process.env.NEWS_API_KEY}`);
            const responseData = await response.json();
            const jlptLeveldata = JSON.parse(fs_1.default.readFileSync(`./db/${level}.json`, "utf8"));
            // console.log("response.data: " + JSON.stringify(response.data))
            performSearch(responseData.articles, jlptLeveldata, res);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        }
        function performSearch(newsDescData, searchWords, res) {
            const searchResults = [];
            // Loop through each search word
            newsDescData.forEach((article) => {
                if (article.description) {
                    searchWords.forEach((n4Word) => {
                        const pattern = new RegExp(n4Word.word, "i");
                        // Search for the word in the news description using the regular expression pattern
                        const matchingWord = article.description.match(pattern);
                        if (matchingWord != null) {
                            searchResults.push(matchingWord.toString());
                        }
                    });
                }
            });
            console.log("matching words in array: " + JSON.stringify(searchResults));
            res.json(searchResults);
        }
    });
};
//# sourceMappingURL=jlptKanji.js.map
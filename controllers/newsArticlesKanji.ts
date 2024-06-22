import axios from 'axios';
import fs from 'fs';
import path from 'path';
import express from 'express';
require('dotenv').config();

// Define the shape of a Kanji item
interface KanjiItem {
  word: string;
  meaning: string;
  furigana: string;
  romaji: string;
  level: number;
}

// Load kanji data
const kanjiLevels: KanjiItem[][] = [1, 2, 3, 4, 5].map(level => {
  const data = fs.readFileSync(path.join(process.cwd(), 'kanjiData', `n${level}.json`), 'utf-8');
  return JSON.parse(data) as KanjiItem[];
});

export const getNews = async (req: express.Request, res: express.Response) => {
  try {
    const newsResponse = await axios.get(`https://newsapi.org/v2/top-headlines?country=jp&apiKey=${process.env.NEWS_API_KEY}`);
    const articles = newsResponse.data.articles;

    const articlesWithKanji = articles.map((article: any) => {
      const { title, description } = article;
      const text = `${title} ${description}`;

      const matchedKanji: { [key: string]: KanjiItem & { level: number } } = {};

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
  } catch (error) {
    console.error('Error fetching news:', error);
    // res.status(500).send('Error fetching news');
  }
};

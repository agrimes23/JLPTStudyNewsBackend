import { getNews } from '../controllers/newsArticlesKanji';
import express from 'express'

export default (router: express.Router) => {
    router.get('/api/news', getNews);
}
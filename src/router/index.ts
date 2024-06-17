import express from "express";
import newsRoutes from "./newsRoutes"
import authentication from "./authentication";
import users from "./users";
import flashcardDeck from "./flashcardDeck";
import jlptKanji from './jlptKanji';

const router = express.Router();

export default (): express.Router => {
    authentication(router)
    users(router)
    flashcardDeck(router)
    jlptKanji(router)
    newsRoutes(router)

    return router
}
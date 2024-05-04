import express from "express";

import authentication from "./authentication";
import users from "./users";
import flashcardDeck from "./flashcardDeck";

const router = express.Router();

export default (): express.Router => {
    authentication(router)
    users(router)
    flashcardDeck(router)
    return router
}
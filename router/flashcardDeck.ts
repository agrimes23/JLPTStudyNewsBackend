import express from 'express'

import { createDeckController, getAllDecksByUserController, getDeckDataController, updateDeckInfoController, deleteDeckController, addNewFlashcardsToDeckController, removeFlashcardFromDeckController, updateFlashcardInDeckController } from "../controllers/decks"
import { verifyJWT } from '../middleware';
// const router = express.Router()

// router.use(verifyJWT)

export default (router: express.Router) => {
    router.post('/deck/:userId', createDeckController);
    router.get('/deck/user/:userId', getAllDecksByUserController);
    router.get('/deck/:deckId', getDeckDataController);
    router.put('/deck/:deckId', updateDeckInfoController);
    router.delete('/deck/:deckId', deleteDeckController);
    router.post('/deck/:deckId/flashcards',  addNewFlashcardsToDeckController);
    router.delete('/deck/:deckId/flashcards/:flashcardId', removeFlashcardFromDeckController);
    router.put('/deck/:deckId/flashcards/:flashcardId', updateFlashcardInDeckController);
}
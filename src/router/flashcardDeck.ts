import express from 'express'

import { createDeckController, getAllDecksByUserController, getDeckDataController, updateDeckInfoController, deleteDeckController, addNewFlashcardsToDeckController, removeFlashcardFromDeckController, updateFlashcardInDeckController } from "../controllers/decks"
import { requireAuth } from '../middleware';

export default (router: express.Router) => {
    router.post('/deck', requireAuth, createDeckController);
    router.get('/deck/user', requireAuth, getAllDecksByUserController);
    router.get('/deck/:deckId', requireAuth, getDeckDataController);
    router.put('/deck/:deckId', requireAuth, updateDeckInfoController);
    router.delete('/deck/:deckId', requireAuth, deleteDeckController);
    router.post('/deck/:deckId/flashcards', requireAuth,  addNewFlashcardsToDeckController);
    router.delete('/deck/:deckId/flashcards/:flashcardId', requireAuth, removeFlashcardFromDeckController);
    router.put('/deck/:deckId/flashcards/:flashcardId', requireAuth, updateFlashcardInDeckController);
}
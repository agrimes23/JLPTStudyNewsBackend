"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decks_1 = require("../controllers/decks");
// const router = express.Router()
// router.use(verifyJWT)
exports.default = (router) => {
    router.post('/deck/:userId', decks_1.createDeckController);
    router.get('/deck/user/:userId', decks_1.getAllDecksByUserController);
    router.get('/deck/:deckId', decks_1.getDeckDataController);
    router.put('/deck/:deckId', decks_1.updateDeckInfoController);
    router.delete('/deck/:deckId', decks_1.deleteDeckController);
    router.post('/deck/:deckId/flashcards', decks_1.addNewFlashcardsToDeckController);
    router.delete('/deck/:deckId/flashcards/:flashcardId', decks_1.removeFlashcardFromDeckController);
    router.put('/deck/:deckId/flashcards/:flashcardId', decks_1.updateFlashcardInDeckController);
};
//# sourceMappingURL=flashcardDeck.js.map
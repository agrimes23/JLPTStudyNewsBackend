"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFlashcardInDeckController = exports.removeFlashcardFromDeckController = exports.addNewFlashcardsToDeckController = exports.deleteDeckController = exports.updateDeckInfoController = exports.getDeckDataController = exports.getAllDecksByUserController = exports.createDeckController = void 0;
const flashcardDecks_1 = require("../models/flashcardDecks");
const users_1 = require("../models/users");
const flashcardDecks_2 = require("../models/flashcardDecks");
// ✅ it works
const createDeckController = async (req, res) => {
    try {
        const { userId } = req.params;
        const deckInfo = req.body;
        const createdDeck = await (0, flashcardDecks_1.createDeck)(userId, deckInfo);
        console.log("deck info: " + JSON.stringify(deckInfo));
        // Find the user by userId and update the decks array
        const updatedUser = await users_1.UserModel.findOneAndUpdate({ _id: userId }, { $push: { decks: createdDeck._id } }, { new: true });
        console.log('updated user: ' + JSON.stringify(updatedUser));
        if (!updatedUser) {
            // If user not found, return 404
            return res.status(404).json({ message: 'User not found' });
        }
        // Return the updated user document with the new deck added
        res.status(201).json(createdDeck);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createDeckController = createDeckController;
// ✅ it works
const getAllDecksByUserController = async (req, res) => {
    try {
        const { userId } = req.params; // Extract userId from the request body
        // Call the model function to fetch all decks associated with the user
        const decks = await (0, flashcardDecks_1.getAllDecksByUserId)(userId);
        console.log("decks: " + JSON.stringify(decks));
        res.status(200).json(decks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllDecksByUserController = getAllDecksByUserController;
// ✅ it works
const getDeckDataController = async (req, res) => {
    try {
        const { deckId } = req.params; // Assuming deckId is present in the request parameters
        const deckData = await (0, flashcardDecks_1.getDeckData)(deckId);
        res.status(200).json(deckData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getDeckDataController = getDeckDataController;
// ✅ it works
// FIXME: need to update modified Date on the deck as well. Easier to just do this in the backend
const updateDeckInfoController = async (req, res) => {
    try {
        const { deckId } = req.params; // Assuming deckId is present in the request parameters
        const updatedInfo = req.body; // Assuming updatedInfo is present in the request body
        const updatedDeck = await (0, flashcardDecks_1.updateDeckInfo)(deckId, updatedInfo);
        res.status(200).json(updatedDeck);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateDeckInfoController = updateDeckInfoController;
// ✅ it works
const deleteDeckController = async (req, res) => {
    try {
        const { deckId } = req.params; // Assuming deckId is present in the request parameters
        await (0, flashcardDecks_1.deleteDeck)(deckId);
        res.status(204).end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteDeckController = deleteDeckController;
// ✅ it works
const addNewFlashcardsToDeckController = async (req, res) => {
    try {
        const { deckId } = req.params;
        const { flashcards } = req.body;
        console.log("boop adding new flashcard");
        const deck = await flashcardDecks_2.FlashcardDeck.findById(deckId);
        if (!deck) {
            return res.status(404).json({ error: 'Deck not found' });
        }
        if (!flashcards || !Array.isArray(flashcards)) {
            return res.status(400).json({ message: 'Invalid request body. Expected an array of flashcards.' });
        }
        // Log only the necessary parts of req and res
        console.log("Received request to add flashcards to deckId:", deckId);
        console.log("Request body:", flashcards);
        const updatedDeck = await (0, flashcardDecks_1.addNewFlashcardsToDeck)(deckId, flashcards);
        console.log("Updated deck:", updatedDeck);
        res.status(200).json(updatedDeck);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.addNewFlashcardsToDeckController = addNewFlashcardsToDeckController;
// ✅ it works
const removeFlashcardFromDeckController = async (req, res) => {
    try {
        const { deckId, flashcardId } = req.params; // Assuming deckId and flashcardId are present in the request parameters
        const updatedDeck = await (0, flashcardDecks_1.removeFlashcardFromDeck)(deckId, flashcardId);
        res.status(200).json(updatedDeck);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.removeFlashcardFromDeckController = removeFlashcardFromDeckController;
// ✅ it works
// FIXME: this only updates one at a time, might want to edit so that it updates multiple?
const updateFlashcardInDeckController = async (req, res) => {
    try {
        const { deckId, flashcardId } = req.params; // Assuming deckId and flashcardId are present in the request parameters
        const updatedFlashcard = req.body; // Assuming updatedFlashcard is present in the request body
        const updatedDeck = await (0, flashcardDecks_1.updateFlashcardInDeck)(deckId, flashcardId, updatedFlashcard);
        res.status(200).json(updatedDeck);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateFlashcardInDeckController = updateFlashcardInDeckController;
//# sourceMappingURL=decks.js.map
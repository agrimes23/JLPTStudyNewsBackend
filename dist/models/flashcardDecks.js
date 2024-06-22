"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFlashcardInDeck = exports.removeFlashcardFromDeck = exports.addNewFlashcardsToDeck = exports.deleteDeck = exports.updateDeckInfo = exports.getDeckData = exports.getAllDecksByUserId = exports.createDeck = exports.UserFlashcardDeck = exports.FlashcardDeck = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define schema for flashcard decks
const FlashcardDeckSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: String,
    flashcards: [
        {
            frontSide: { type: String, required: true },
            backSide: { type: String, required: true },
            jlptLevel: { type: String },
            shouldRetest: { type: Boolean, default: false }
        }
    ], // Array of flashcards
    creationDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
    isFav: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false }
});
const UserFlashcardDeckSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    deckId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'FlashcardDeck', required: true }
});
// -------- Create model -------- //
exports.FlashcardDeck = mongoose_1.default.model('FlashcardDeck', FlashcardDeckSchema);
exports.UserFlashcardDeck = mongoose_1.default.model('UserFlashcardDeck', UserFlashcardDeckSchema);
// ------ Model Functions ------ //
const createDeck = async (userId, deckInfo) => {
    // Create the deck
    const newDeck = await new exports.FlashcardDeck(deckInfo).save();
    // Save the deckId with the user
    await exports.UserFlashcardDeck.create({ userId, deckId: newDeck._id });
    return newDeck.toObject();
};
exports.createDeck = createDeck;
const getAllDecksByUserId = async (userId) => {
    try {
        // Find all user-flashcard deck associations for the given userId
        const userDecks = await exports.UserFlashcardDeck.find({ userId });
        // Extract deckIds from userDecks
        const deckIds = userDecks.map(deck => deck.deckId);
        // Find all decks using deckIds
        const decks = await exports.FlashcardDeck.find({ _id: { $in: deckIds } });
        return decks;
    }
    catch (error) {
        // Handle any potential errors
        console.error(error);
        throw new Error('Failed to fetch decks for the user');
    }
};
exports.getAllDecksByUserId = getAllDecksByUserId;
// this will get deck info as well as the flashcards for the deck
const getDeckData = async (deckId) => {
    try {
        const deck = await exports.FlashcardDeck.findById(deckId).populate('flashcards');
        return deck;
    }
    catch (error) {
        console.error("Error fetching deck data:", error);
        throw error; // Rethrow the error to handle it in the component or context
    }
};
exports.getDeckData = getDeckData;
const updateDeckInfo = async (deckId, updatedInfo) => {
    return await exports.FlashcardDeck.findByIdAndUpdate(deckId, updatedInfo, { new: true });
};
exports.updateDeckInfo = updateDeckInfo;
const deleteDeck = async (deckId) => {
    await exports.UserFlashcardDeck.deleteOne({ deckId });
    return await exports.FlashcardDeck.findByIdAndDelete(deckId);
};
exports.deleteDeck = deleteDeck;
const addNewFlashcardsToDeck = async (deckId, flashcards) => {
    return await exports.FlashcardDeck.findByIdAndUpdate(deckId, { $push: { flashcards: { $each: flashcards } } }, { new: true });
};
exports.addNewFlashcardsToDeck = addNewFlashcardsToDeck;
const removeFlashcardFromDeck = async (deckId, flashcardId) => {
    return await exports.FlashcardDeck.findByIdAndUpdate(deckId, { $pull: { flashcards: { _id: flashcardId } } }, { new: true });
};
exports.removeFlashcardFromDeck = removeFlashcardFromDeck;
const updateFlashcardInDeck = async (deckId, flashcardId, updatedFlashcard) => {
    return await exports.FlashcardDeck.findOneAndUpdate({ _id: deckId, 'flashcards._id': flashcardId }, { $set: { 'flashcards.$': updatedFlashcard } }, { new: true });
};
exports.updateFlashcardInDeck = updateFlashcardInDeck;
//# sourceMappingURL=flashcardDecks.js.map
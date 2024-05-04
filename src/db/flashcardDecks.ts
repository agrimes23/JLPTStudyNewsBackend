
import mongoose from 'mongoose'

// Define schema for flashcard decks
const FlashcardDeckSchema = new mongoose.Schema({
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

const UserFlashcardDeckSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deckId: { type: mongoose.Schema.Types.ObjectId, ref: 'FlashcardDeck', required: true }
});


// -------- Create model -------- //
export const FlashcardDeck = mongoose.model('FlashcardDeck', FlashcardDeckSchema)
export const UserFlashcardDeck = mongoose.model('UserFlashcardDeck', UserFlashcardDeckSchema);

// ------ Model Functions ------ //

export const createDeck = async (userId: string, deckInfo: any) => {
    // Create the deck
    const newDeck = await new FlashcardDeck(deckInfo).save();

    // Save the deckId with the user
    await UserFlashcardDeck.create({ userId, deckId: newDeck._id });

    return newDeck.toObject();
};

export const getAllDecksByUserId = async (userId: string) => {
    try {
        // Find all user-flashcard deck associations for the given userId
        const userDecks = await UserFlashcardDeck.find({ userId });

        // Extract deckIds from userDecks
        const deckIds = userDecks.map(deck => deck.deckId);

        // Find all decks using deckIds
        const decks = await FlashcardDeck.find({ _id: { $in: deckIds } });

        return decks;
    } catch (error) {
        // Handle any potential errors
        console.error(error);
        throw new Error('Failed to fetch decks for the user');
    }
};

// this will get deck info as well as the flashcards for the deck
export const getDeckData = async (deckId: string) => {
    return await FlashcardDeck.findById(deckId).populate('flashcards');
};

export const updateDeckInfo = async (deckId: string, updatedInfo: any) => {
    return await FlashcardDeck.findByIdAndUpdate(deckId, updatedInfo, { new: true });
};

export const deleteDeck = async (deckId: string) => {
    await UserFlashcardDeck.deleteOne({ deckId });
    return await FlashcardDeck.findByIdAndDelete(deckId);
};

export const addNewFlashcardsToDeck = async (deckId: string, flashcards: any[]) => {
    return await FlashcardDeck.findByIdAndUpdate(deckId, { $push: { flashcards: { $each: flashcards } } }, { new: true });
};

export const removeFlashcardFromDeck = async (deckId: string, flashcardId: string) => {
    return await FlashcardDeck.findByIdAndUpdate(deckId, { $pull: { flashcards: { _id: flashcardId } } }, { new: true });
};

export const updateFlashcardInDeck = async (deckId: string, flashcardId: string, updatedFlashcard: any) => {
    return await FlashcardDeck.findOneAndUpdate(
        { _id: deckId, 'flashcards._id': flashcardId },
        { $set: { 'flashcards.$': updatedFlashcard } },
        { new: true }
    );
};


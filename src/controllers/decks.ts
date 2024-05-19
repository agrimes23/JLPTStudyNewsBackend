import express from 'express'
import { createDeck, getAllDecksByUserId, getDeckData,  updateDeckInfo, deleteDeck, addNewFlashcardsToDeck, removeFlashcardFromDeck, updateFlashcardInDeck } from "../models/flashcardDecks";
import { UserModel } from '../models/users';


// ✅ it works
export const createDeckController = async (req: express.Request, res: express.Response) => {
    try {
        const { userId } = req.params; 
        const deckInfo = req.body;

        const createdDeck = await createDeck(userId, deckInfo);

        console.log("deck info: " + JSON.stringify(deckInfo))
        // Find the user by userId and update the decks array
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: userId },
            { $push: { decks: createdDeck._id } },
            { new: true }
        );

        console.log('updated user: ' + JSON.stringify(updatedUser))

        if (!updatedUser) {
            // If user not found, return 404
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the updated user document with the new deck added
        res.status(201).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ✅ it works
export const getAllDecksByUserController = async (req: express.Request, res: express.Response) => {
    try {
        const { userId } = req.params; // Extract userId from the request body

        // Call the model function to fetch all decks associated with the user
        const decks = await getAllDecksByUserId(userId);
        console.log("decks: " + JSON.stringify(decks))
        res.status(200).json(decks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ✅ it works
export const getDeckDataController = async (req: express.Request, res: express.Response) => {
    try {
        const { deckId } = req.params; // Assuming deckId is present in the request parameters

        const deckData = await getDeckData(deckId);

        res.status(200).json(deckData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ✅ it works
// FIXME: need to update modified Date on the deck as well. Easier to just do this in the backend
export const updateDeckInfoController = async (req: express.Request, res: express.Response) => {
    try {
        const { deckId } = req.params; // Assuming deckId is present in the request parameters
        const updatedInfo = req.body; // Assuming updatedInfo is present in the request body

        const updatedDeck = await updateDeckInfo(deckId, updatedInfo);

        res.status(200).json(updatedDeck);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ✅ it works
export const deleteDeckController = async (req: express.Request, res: express.Response) => {
    try {
        const { deckId } = req.params; // Assuming deckId is present in the request parameters

        await deleteDeck(deckId);

        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ✅ it works
export const addNewFlashcardsToDeckController = async (req: express.Request, res: express.Response) => {
    try {
        const { deckId } = req.params; // Assuming deckId is present in the request parameters
        const { flashcards } = req.body; // Assuming flashcards is present in the request body

        const updatedDeck = await addNewFlashcardsToDeck(deckId, flashcards);

        res.status(200).json(updatedDeck);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ✅ it works
export const removeFlashcardFromDeckController = async (req: express.Request, res: express.Response) => {
    try {
        const { deckId, flashcardId } = req.params; // Assuming deckId and flashcardId are present in the request parameters

        const updatedDeck = await removeFlashcardFromDeck(deckId, flashcardId);

        res.status(200).json(updatedDeck);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ✅ it works
// FIXME: this only updates one at a time, might want to edit so that it updates multiple?
export const updateFlashcardInDeckController = async (req: express.Request, res: express.Response) => {
    try {
        const { deckId, flashcardId } = req.params; // Assuming deckId and flashcardId are present in the request parameters
        const updatedFlashcard = req.body; // Assuming updatedFlashcard is present in the request body

        const updatedDeck = await updateFlashcardInDeck(deckId, flashcardId, updatedFlashcard);

        res.status(200).json(updatedDeck);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
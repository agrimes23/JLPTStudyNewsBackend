
import mongoose from 'mongoose'
const FlashcardSchema = new mongoose.Schema({
    frontSide: { type: String, required: true },
    backSide: { type: String, required: true }
    // You can add more fields like image URLs, audio clips, etc. as needed
}, { _id: false }); // Disable _id for subdocuments since they will be within an array

// Define schema for flashcard decks
const FlashcardDeckSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    numKanjiLevel: [{ type: Number, default: 0 }], // Array representing different JLPT levels
    flashcards: [FlashcardSchema], // Array of flashcards
    creationDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
    isFav: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false }
});

// Define schema for user flashcard decks
const UserFlashcardDecksSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who owns the deck
    decks: [FlashcardDeckSchema] // Array of flashcard decks
});

// Define indexes for efficient querying
UserFlashcardDecksSchema.index({ userId: 1 }); // Index for querying decks by user ID

// Create model
const UserFlashcardDecks = mongoose.model('UserFlashcardDecks', UserFlashcardDecksSchema);




// export const get = () => FCDeckModel.find();
// export const getUserByEmail = (email: string) => FCDeckModel.findOne({ email })
// export const getUserBySessionToken = (sessionToken: string) => FCDeckModel.findOne({
//     'authentication.sessionToken': sessionToken,
// })
// export const getUserById = (id: string) => FCDeckModel.findById(id)
// export const createUser = (values: Record<string, any>) => new FCDeckModel(values).save().then((user) => user.toObject())
// export const deleteUserById = (id: string) => FCDeckModel.findOneAndDelete({ _id: id})
// export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values)
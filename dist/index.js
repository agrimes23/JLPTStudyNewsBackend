"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
require('dotenv').config();
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.use((0, cors_1.default)({
    origin: "https://jlpt-news-study.vercel.app",
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
const server = http_1.default.createServer(app);
server.listen(PORT, () => {
    console.log("Server running");
});
const MONGO_URL = process.env.DATABASE_URL;
mongoose_1.default.Promise = global.Promise;
mongoose_1.default.connect(MONGO_URL)
    .then(() => {
    console.log('MongoDB connected');
})
    .catch((err) => {
    console.error('MongoDB connection error:', err);
});
mongoose_1.default.connection.on("error", (error) => console.log(error));
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'client', 'build')));
app.use('/', (0, router_1.default)());
// Catch-all handler to serve the frontend's index.html
app.get('/*', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, '..', 'client', 'build', 'index.html'));
});
//# sourceMappingURL=index.js.map
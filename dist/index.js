import express from "express";
import rateLimiter from "./middleware/rateLimiter.js";
const app = express();
app.use(express.json());
const PORT = 3000;
app.use(rateLimiter);
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Request successful",
    });
});
app.get("/api/data", (req, res) => {
    res.json({
        success: true,
        data: "Here is your data",
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map
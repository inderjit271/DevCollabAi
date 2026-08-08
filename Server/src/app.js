const express = require('express')
const cors = require('cors')
const connectDB = require("./db/db")
const cookie = require('cookie-parser')
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");

const app = express()

connectDB();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
})
);
app.use(express.json())
app.use(cookie())

app.use("/api/auth",authRoutes)
app.use("/api/project",projectRoutes)
module.exports = app;
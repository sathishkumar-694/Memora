const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors(process.env.FRONTEND_URL));

//connect DB
connectDB()


const noteRoutes = require("./routes/noteRoutes.js")
const adminRoutes = require("./routes/adminRoutes.js")
const authRoutes = require("./routes/authRoutes.js")


app.use("/api/auth", authRoutes)
app.use("/api/notes", noteRoutes);
app.use("/api/admin", adminRoutes);


app.listen(process.env.PORT, () => {
  console.log("Server is running on port ", process.env.PORT);
});

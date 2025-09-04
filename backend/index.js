import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import connectCloudinary from "./src/config/cloudinary.js";
import HomeRoute from './src/routes/HomeRoute.js'
import swapRoutes from './src/routes/swapRoutes.js'
import rateRoutes from './src/routes/RateRoute.js'
import adminRoute from './src/routes/adminRoute.js'

import http from "http";
import { Server } from "socket.io";

import cors from 'cors'

dotenv.config();
const app = express();

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

connectDB();
connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/", (req, res) => res.send("API running"));

app.use("/api/users", authRoutes);
app.use("/api/homepage-data", HomeRoute);
app.use("/api/request/", HomeRoute);

app.use('/api/swaps', swapRoutes)
app.use('/api/rate', rateRoutes)

app.use('/api/admin', adminRoute)

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
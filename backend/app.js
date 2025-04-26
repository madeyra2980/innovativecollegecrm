import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
// import auth from './routes/auth.js'
import teachers from './routes/teachers.js'
import students from './routes/students.js'
import groups from "./routes/group.js"
import subject from './routes/subject.js'
import schedule from "./routes/schedule.js";
import date from './routes/date.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.DB || "mongodb://127.0.0.1:27017/innovativecollege";

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// app.use("/api",auth);
app.use("/api", teachers); 
app.use("/api", students);
app.use("/api", groups);
app.use("/api", subject);
app.use("/api",schedule);
app.use("/api", date)


mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Подключение к MongoDB установлено"))
  .catch(err => console.error("❌ Ошибка при подключении к MongoDB:", err));

app.get("/", (req, res) => {
  res.send("Innovative college server");
});

app.listen(PORT, () => console.log(`🚀 Сервер слушает порт ${PORT}`));

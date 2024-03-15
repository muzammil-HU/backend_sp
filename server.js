import express from "express";
import cors from "cors";
import { connect } from "./config/connect.js";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoute from "./Routes/authRoutes.js";
import connectToDatabase from "./config/connectphpadmin.js";

const app = express();

dotenv.config();

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Credentials", true);
//   next();
// });

app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// app.use(cookieParser());

//Routes
app.use("/api/v1/auth", authRoute);

connect();
// connectToDatabase();

const PORT = process.env.PORT || 8085;

app.get("/", (req, res) => {
  res.send("<h1>Welcome to spBackend app</h1>");
});

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`.bgCyan.white);
});

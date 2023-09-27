import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import UserRouter from "./routes/userRoutes.js";
import cors from "cors";
import LoginRouter from "./login.js";
import PhoneRouter from "./phone.js";
import ScholeRouter from "./scholar.js";


const app = express();
const corsOptions = {
  origin: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;


app.use("/api/user", UserRouter);

app.use(LoginRouter);
app.use(PhoneRouter);
app.use(ScholeRouter);

const runDb = async () => {
  try {
    const DB =
      "mongodb+srv://db:6O3rHBpJYYLnGjbV@database.l2fnk.mongodb.net/patnascienceacedemy?retryWrites=true&w=majority";


    mongoose.set("strictQuery", false);
    await mongoose.connect(DB, { useUnifiedTopology: false });
    console.log("connected to MongoDB");

    app.listen(PORT, async () => {
      console.log("app is running on port " + PORT);
    });
  } catch (error) {
    console.log("connection error " + error);
  }
};
runDb();

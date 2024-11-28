// const express = require("express");
// const serverless = require("serverless-http");

// const connect = async () => {
//     try {
//       await mongoose.connect(process.env.MONGO);
//       console.log("Connected to mongoDB.");
//     } catch (error) {
//       throw error;
//     }
//   };

//   mongoose.connection.on("disconnected", () => {
//     console.log("mongoDB disconnected!");
//   });

// const app = express();
// const router = express.Router();

// router.get("/", (req, res) => {
//   res.json({
//     hello: "hi!",
//   });
// });

// router.get("/test", (req, res) => {
//   res.json({
//     hello: "test!",
//   });
// });

// router.post("/testpost", (req, res) => {
//   res.json({
//     hello: "hit the POST!",
//   });
// });

// app.use(`/.netlify/functions/api`, router);
// app.listen(8800, () => {
//     connect();
//     console.log("Connected to backend.");
//   });

// module.exports = app;
// // module.exports.handler = serverless(app);
// const handler = serverless(app);
// module.exports.handler = async (event, context) => {
//   const result = await handler(event, context);
//   return result;
// };
import express from "express";
import { json } from "express";
import { Router } from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import usersRoute from "./routes/users.js";

export async function handler(event, context) {
  const app = express();
  const router = Router();

  // router.get('/auth', authRoute)
  router.get("/users", usersRoute);

  router.get("/", async (request, response) => {
    console.log("hey");
    response.send({ hello: "world" });
  });

  app.use(express.json());
  app.use(cors());

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
      j: true,
      wtimeout: 1000,
      w: "majority",
    },
  };

  dotenv.config();

  mongoose
    .connect(process.env.MONGO, options)
    .then(() => console.log("DB connection sucessfull"))
    .catch((error) => {
      console.log(error);
    });

  // app.use("/.netlify/functions/api/auth", authRoute);
  app.use("/.netlify/functions/api/users", usersRoute);

  app.use("/api/", router);
  return serverless(app)(event, context);
}

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running");
});

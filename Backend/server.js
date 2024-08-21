require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");
const statsRoutes = require('./Routes/statsRoutes');


const app = express();

app.use(cors({}));

app.use("/public", express.static("public"));
app.use(express.static("files"));
app.use(express.json());


app.use(authRoutes);
app.use(userRoutes);
app.use('/api', statsRoutes);



app.get("/", async (req, res) => {
  res.send("Hello World");
});

mongoose
  .connect(process.env.MONGOOSE_CONNECTION_URI)
  .then(() => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
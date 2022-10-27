const express = require("express");
const app = express();
const cors = require("cors");
const port = 8000;
app.use(express.json());
app.use(cors());
require("./router/router.js");
require("dotenv").config();

// app.listen('/',require('./router/router.js'))
app.use("/", require("./router/router"));

app.listen(8000, () => {
  console.log(`app is running at ${port}`);
});

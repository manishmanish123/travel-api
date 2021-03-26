const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const crons = require("./crons/config");

//for home page
const GetCategoryController = require('./api/controllers/category/getCategory');

const placeRoute = require("./api/routes/place");
const cityRoute = require("./api/routes/city");
const countryRoute = require("./api/routes/country");
const userRoute = require("./api/routes/user");
const adventureRoute = require("./api/routes/adventure");
const categoryRoute = require("./api/routes/category");
const searchRoute = require("./api/routes/search");

//for environment variables configuration
require('dotenv').config();

const port = process.env.PORT;

mongoose.connect(
    "mongodb+srv://manish:" + process.env.MONGO_ATLAS_PW + "@cluster0.rq0lx.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
  }
);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/home", GetCategoryController.getAllCategory);
app.use("/place", placeRoute);
app.use("/city", cityRoute);
app.use("/country", countryRoute);
app.use("/user", userRoute);
app.use("/adventure", adventureRoute);
app.use("/category", categoryRoute);
app.use("/search", searchRoute);

app.use((req, res, next) => {
  const error = new Error("Url not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});


//Initilizing crons
crons.cronInitilize();


app.listen(port, () => {
    console.log(`myapp listening at http://localhost:${port}`)
})
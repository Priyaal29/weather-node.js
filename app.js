import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


import { api_key} from "./key.js";

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// rendring the home page for city submission
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", async (req, res) => {
  // turning city name into js
  const cityName = req.body.city;

  // API request
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&appid=" +
        api_key +
        "&units=metric"
    );
    const result = response.data;

    const temp = result.main.temp;

    //  weather information
    const picture = result.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/w/" + picture + ".png";

    const hum = result.main.humidity;
    const feel = result.main.feels_like;
    const main = result.weather[0].main;
    const city = result.name;

    //  sending results to frontend

    res.render("index.ejs", {
      temprature: temp,
      icon: iconUrl,
      humidity: hum,
      feels_like: feel,
      main: main,
      city: city,
    });
  } catch (error) {
    // error handling
    console.log("error occured");
    const message = "something went wrong";
    res.render("index.ejs", {
      error: message,
    });
    res.status(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

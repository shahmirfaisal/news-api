const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const cors = require("cors");
const { extractArticles } = require("./utils");

const app = express();

app.use(cors());

const urls = {
  // For getting a single news
  news: (id) => `https://www.dawn.com/news/${id}`,

  latest: "https://www.dawn.com/latest-news",
  coronavirus: "https://www.dawn.com/trends/coronavirus",
  sport: "https://www.dawn.com/sport",
  technology: "https://www.dawn.com/tech",
  business: "https://www.dawn.com/business",
};

// Fetching all the categories
app.get("/categories", (req, res, next) => {
  const categories = [
    "Latest",
    "Coronavirus",
    "Sport",
    "Technology",
    "Business",
  ];
  res.json(categories);
});

app.get("/Latest", async (req, res, next) => {
  const articles = [];

  const htmlResponse = await axios.get(urls.latest);
  const data = htmlResponse.data;

  extractArticles(data, ".tabs__pane.active article.box.story", articles);

  res.json(articles);
});

app.get("/Coronavirus", async (req, res, next) => {
  const articles = [];

  const htmlResponse = await axios.get(urls.coronavirus);
  const data = htmlResponse.data;

  extractArticles(data, ".stories-listing article.box.story", articles);

  res.json(articles);
});

app.get("/Sport", async (req, res, next) => {
  const articles = [];

  const htmlResponse = await axios.get(urls.sport);
  const data = htmlResponse.data;

  extractArticles(data, "article.box.story", articles);

  res.json(articles);
});

app.get("/Technology", async (req, res, next) => {
  const articles = [];

  const htmlResponse = await axios.get(urls.technology);
  const data = htmlResponse.data;

  extractArticles(data, "article.box.story", articles);

  res.json(articles);
});

app.get("/Business", async (req, res, next) => {
  const articles = [];

  const htmlResponse = await axios.get(urls.business);
  const data = htmlResponse.data;

  extractArticles(data, ".mb-4 > article.box.story", articles);

  res.json(articles);
});

// Getting a specific news
app.get("/news/:id", async (req, res, next) => {
  const { id } = req.params;

  const htmlResponse = await axios.get(urls.news(id));
  const data = htmlResponse.data;
  const $ = cheerio.load(data);

  const title = $(".template__header .story__title .story__link").text();
  const time = $(".template__header .story__time").text();
  const coverImage = $(".template__header .media__item img").attr("src");
  const text = $(".template__main .story__content").text();
  const html = $(".template__main .story__content").html();

  res.json({
    id,
    title,
    time,
    coverImage,
    text,
    html,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);

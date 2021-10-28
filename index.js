const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();

const URL = "https://www.dawn.com/latest-news";

app.get("/news", async (req, res, next) => {
  const articles = [];

  const htmlResponse = await axios.get(URL);
  const data = htmlResponse.data;

  const $ = cheerio.load(data);

  $("article.box.story").each(function () {
    const title = $(this).find(".story__title a").text();
    const coverImage = $(this).find(".media img").attr("src");
    const link = $(this).find(".story__title a").attr("href");
    const id = link.split("news/")[1].split("/")[0];
    const excerpt = $(this).find(".story__excerpt").text();
    const time = $(this).find(".story__time").text();

    articles.push({
      id,
      title,
      coverImage,
      excerpt,
      time,
    });
  });

  res.json(articles);
});

app.get("/news/:id", async (req, res, next) => {
  const { id } = req.params;
  const BASE_URL = "https://www.dawn.com/news";

  const htmlResponse = await axios.get(`${BASE_URL}/${id}`);
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
app.listen(PORT, () => console.log(`Listening at ${PORT}`));

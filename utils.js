const cheerio = require("cheerio");

exports.extractArticles = (data, className, articles) => {
  const $ = cheerio.load(data);

  $(className).each(function () {
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
};

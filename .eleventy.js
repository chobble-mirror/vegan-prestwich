const fg = require("fast-glob");

const placeImages = fg.sync([
  "place/*/*.jpg",
  "!**/_site",
  "!place/*/*-thumb.jpg",
]);

const Image = require("@11ty/eleventy-img");

module.exports = function (config) {
  config.addGlobalData("siteUrl", "https://www.veganprestwich.co.uk");

  config.addShortcode("image", async (src, alt, sizes) => {
    let metadata = await Image(src, {
      widths: [150, 300],
      formats: ["webp", "jpeg"],
      outputDir: "./_site/img/",
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };

    // You bet we throw an error on a missing alt (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes);
  });

  // Aliases are in relation to the _includes folder
  config.addLayoutAlias("default", "layouts/default.liquid");
  config.addLayoutAlias("home", "layouts/home.liquid");
  config.addLayoutAlias("page", "layouts/page.liquid");
  config.addLayoutAlias("place", "layouts/place.liquid");
  config.addLayoutAlias("tag", "layouts/tag.liquid");
  config.addLayoutAlias("tags", "layouts/tags.liquid");

  let sortedPlaces = (api) => {
    return api
      .getAll()
      .filter((a) => {
        return a.data.tags && a.data.tags.indexOf("places") != -1;
      })
      .sort((a, b) => {
        return a.data.name.localeCompare(b.data.name);
      });
  };

  config.addCollection("sorted_places", (api) => sortedPlaces(api));

  config.addCollection("shops", (api) =>
    sortedPlaces(api).filter((a) => a.data.permalink && a.data.shop),
  );

  config.addCollection("restaurants", (api) =>
    sortedPlaces(api).filter((a) => a.data.permalink && a.data.restaurant),
  );

  config.addCollection("deliveries", (api) =>
    sortedPlaces(api).filter((a) => a.data.permalink && a.data.delivery),
  );

  config.addWatchTarget("./style/style.scss");

  config.addCollection("place_images", (collection) => placeImages);
  config.addPassthroughCopy("place/*/*.jpg");
  config.addPassthroughCopy({ "static/robots.txt": "/robots.txt" });
  config.addPassthroughCopy({ "static/not_found.html": "/not_found.html" });
  config.addPassthroughCopy({ "static/favicon.ico": "/favicon.ico" });

  config.addFilter("where", (array, key, value) => {
    return (array || []).filter((item) => {
      const keys = key.split(".");
      const reducedKey = keys.reduce((object, key) => {
        return object[key];
      }, item);

      return reducedKey == value ? item : false;
    });
  });

  config.addFilter("where_includes", (array, key, value) => {
    return (array || []).filter((item) => {
      const keys = key.split(".");
      const reducedKey = keys.reduce((object, key) => {
        return object[key];
      }, item);

      return reducedKey && reducedKey.indexOf(value) != -1 ? item : false;
    });
  });

  return {
    dir: {
      input: "./",
      output: "./_site",
    },
  };
};

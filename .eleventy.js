const fg = require('fast-glob');

const placeImages = fg.sync(['places/*/*.jpg', '!**/_site']);

module.exports = function(config) {
  // Aliases are in relation to the _includes folder
  config.addLayoutAlias('default', 'layouts/default.liquid');
  config.addLayoutAlias('home', 'layouts/home.liquid');
  config.addLayoutAlias('page', 'layouts/page.liquid');
  config.addLayoutAlias('place', 'layouts/place.liquid');
  config.addLayoutAlias('tag', 'layouts/tag.liquid');
  config.addLayoutAlias('tags', 'layouts/tags.liquid');

  let getAllSorted = (api) => {
    return api.getAll().sort((a, b) => {
      a.name - b.name
    });
  }

  config.addCollection("shops", (api) =>
    getAllSorted(api).filter((a) => a.data.permalink && a.data.shop));

  config.addCollection("restaurants", (api) =>
    getAllSorted(api).filter((a) => a.data.permalink && a.data.restaurant));

  config.addCollection("deliveries", (api) =>
    getAllSorted(api).filter((a) => a.data.permalink && a.data.delivery));

  config.addWatchTarget("./style/style.scss");

  config.addCollection("place_images", (collection) => placeImages);;
  config.addPassthroughCopy("places/*/*.jpg");
  config.addPassthroughCopy("favicon.ico");

  config.addFilter('where', (array, key, value) => {
    return array.filter(item => {
      const keys = key.split('.');
      const reducedKey = keys.reduce((object, key) => {
        return object[key];
      }, item);

      return (reducedKey == value ? item : false);
    });
  });

  config.addFilter('where_includes', (array, key, value) => {
    return array.filter(item => {
      const keys = key.split('.');
      const reducedKey = keys.reduce((object, key) => {
        return object[key];
      }, item);

      return (reducedKey && reducedKey.indexOf(value) != -1 ? item : false);
    });
  });

  return {
    dir: {
      input: "./",
      output: "./_site"
    }
  };
};
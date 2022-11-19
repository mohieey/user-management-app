const algoliasearch = require("algoliasearch");

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);

module.exports = function (indexName) {
  return client.initIndex(indexName);
};

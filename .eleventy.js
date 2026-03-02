const categories = require("./src/_data/categories.json");

module.exports = function (eleventyConfig) {
  // Copy CSS files to output as-is
  eleventyConfig.addPassthroughCopy("src/css");

  // Create a "recipes" collection from all .md files in src/recipes/
  eleventyConfig.addCollection("recipes", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/recipes/*.md");
  });

  // Filter: render **bold** and *italic* markdown in YAML string values
  eleventyConfig.addFilter("md", function (value) {
    if (!value) return "";
    return value
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");
  });

  // Filter: highlight a specific word in the title with gold italic styling
  eleventyConfig.addFilter("highlightWord", function (title, word) {
    if (!word) return title;
    return title.replace(word, `<em>${word}</em>`);
  });

  // Filter: get recipes that have a specific tag (used by category pages)
  eleventyConfig.addFilter("withTag", function (collection, tag) {
    if (!collection || !tag) return [];
    return collection.filter(
      (item) => item.data.tags && item.data.tags.includes(tag)
    );
  });

  // Filter: look up a category by slug
  eleventyConfig.addFilter("categoryBySlug", function (slug) {
    return categories.find((c) => c.slug === slug);
  });

  // Resolve which template a recipe should use:
  // 1. Explicit `template` in recipe frontmatter wins
  // 2. Otherwise, find the first matching category and use its defaultTemplate
  // 3. Fall back to "classic"
  eleventyConfig.addFilter("resolveTemplate", function (data) {
    if (data.template) return data.template;
    if (data.tags) {
      for (const tag of data.tags) {
        const cat = categories.find((c) => c.slug === tag);
        if (cat) return cat.defaultTemplate;
      }
    }
    return "classic";
  });

  return {
    pathPrefix: "/Toms-Kitchen/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};

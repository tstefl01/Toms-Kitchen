const categories = require("../_data/categories.json");

module.exports = {
  layout: "recipe.njk",
  eleventyComputed: {
    // Resolve which template CSS to load — only for actual recipe pages
    templateCss: (data) => {
      // Skip non-recipe pages (index.njk, category.njk use layout: base.njk)
      if (data.layout !== "recipe.njk") return null;
      if (data.template) return data.template;
      if (data.tags) {
        for (const tag of data.tags) {
          const cat = categories.find((c) => c.slug === tag);
          if (cat) return cat.defaultTemplate;
        }
      }
      return "classic";
    },
    // Set the page title for actual recipe pages
    pageTitle: (data) => {
      if (data.layout !== "recipe.njk") return data.pageTitle;
      if (data.source && data.title) return `${data.source} — ${data.title}`;
      return data.title || "Recipe";
    },
  },
};

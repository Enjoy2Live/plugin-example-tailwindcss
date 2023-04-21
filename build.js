const StyleDictionaryPackage = require("style-dictionary");
const { createArray } = require("./fns");

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

StyleDictionaryPackage.registerFormat({
  name: "css/variables",
  formatter: function (dictionary, config) {
    console.log(JSON.stringify(dictionary, null, 2));
    return `${this.selector} {\n${dictionary.allProperties
      .filter((prop) => prop.type !== "typography")
      .map((prop) => `  --${prop.name}: ${prop.value};`)
      .join("\n")}\n}`;
  },
});

StyleDictionaryPackage.registerFormat({
  name: "css/typography",
  formatter: function (dictionary, config) {
    return `${this.selector} {\n${dictionary.allProperties
      .filter((prop) => prop.type === "typography")
      .map((prop) => `  --${prop.name}: ${prop.value};`)
      .join("\n")}\n}`;
  },
});

StyleDictionaryPackage.registerTransform({
  name: "sizes/px",
  type: "value",
  matcher: function (prop) {
    // You can be more specific here if you only want 'em' units for font sizes
    return [
      "fontSizes",
      "spacing",
      "borderRadius",
      "borderWidth",
      "sizing",
      "shadows",
      "borders",
      // "body",
      // "heading",
    ].includes(prop.attributes.category);
  },
  transformer: function (prop) {
    const { original } = prop;
    switch (prop.type) {
      case "boxShadow":
        return !Array.isArray(original.value)
          ? `${original.value.type === "innerShadow" ? "inset" : ""} ${
              original.value.x
            } ${original.value.y} ${original.value.blur} ${
              original.value.spread
            } ${original.value.color}`
          : original.value.map(
              (val) =>
                `${val.type === "innerShadow" ? "inset" : ""} ${val.x} ${
                  val.y
                } ${val.blur} ${val.spread} ${val.color}`
            );
        break;
      default:
        // You can also modify the value here if you want to convert pixels to ems
        return parseFloat(prop.original.value) + "px";
        break;
    }
  },
});

function getStyleDictionaryConfig(theme) {
  return {
    source: [`tokens/${theme}.json`],
    format: {
      createArray,
    },
    platforms: {
      web: {
        transforms: ["attribute/cti", "name/cti/kebab", "sizes/px"],
        buildPath: `output/`,
        files: [
          {
            destination: `${theme}.json`,
            format: "createArray",
          },
          {
            destination: `${theme}.css`,
            format: "css/variables",
            selector: `.${theme}-theme`,
          },
        ],
      },
    },
  };
}

console.log("Build started...");

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

["senf"].map(function (theme) {
  console.log("\n==============================================");
  console.log(`\nProcessing: [${theme}]`);

  const StyleDictionary = StyleDictionaryPackage.extend(
    getStyleDictionaryConfig(theme)
  );

  StyleDictionary.buildPlatform("web");

  console.log("\nEnd processing");
});

console.log("\n==============================================");
console.log("\nBuild completed!");

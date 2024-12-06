/** @type {import('@bacons/apple-targets').Config} */
module.exports = {
  type: "widget",
  colors: {
    $accent: "steelblue",
  },
  entitlements: {
    "com.apple.security.application-groups": ["group.bacon.data"],
  },
};

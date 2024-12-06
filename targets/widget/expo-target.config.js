/** @type {import('@bacons/apple-targets').Config} */
module.exports = {
  type: "widget",
  deploymentTarget: "17.0",
  colors: {
    $accent: "steelblue",
  },
  entitlements: {
    "com.apple.security.application-groups": ["group.bacon.data"],
  },
};

module.exports = {
  "root"    : true,
  "parser"  : "@typescript-eslint/parser",
  "plugins" : ["@typescript-eslint"],
  "extends" : [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "env": {
    "browser" : true,
    "node"    : true
  },
  "rules": {
    "no-console"                  : "off",
    "no-useless-constructor"      : "off",
    "space-before-function-paren" : [
      "error",
      { "anonymous": "always", "named": "never", "asyncArrow": "always" }
    ],
    "semi"        : [2, "always"],
    "key-spacing" : [
      "error",
      { "align": { "beforeColon": true, "afterColon": true, "on": "colon" } }
    ],
    "no-unused-vars"                     : [2, { "args": "none", "destructuredArrayIgnorePattern": "^_" }],
    "@typescript-eslint/no-unused-vars"  : ["error", { "args": "none" }],
    "newline-per-chained-call"           : ["error", { "ignoreChainWithDepth": 4 }],
    "@typescript-eslint/no-explicit-any" : "off",
    "no-async-promise-executor"          : "off",
    "sort-imports"                       : [
      "error",
      {
        "ignoreCase"            : false,
        "ignoreDeclarationSort" : false,
        "ignoreMemberSort"      : false,
        "memberSyntaxSortOrder" : ["all", "multiple", "single", "none"],
        "allowSeparatedGroups"  : true
      }
    ]
  }
};

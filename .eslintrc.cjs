/** @type { import("eslint").Linter.Config } */
module.exports = {
	root    : true,
	extends : [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser        : '@typescript-eslint/parser',
	plugins       : ['@typescript-eslint'],
	parserOptions : {
		sourceType          : 'module',
		ecmaVersion         : 2020,
		extraFileExtensions : ['.svelte']
	},
	env: {
		browser : true,
		es2017  : true,
		node    : true
	},
	overrides: [
		{
			files         : ['*.svelte'],
			parser        : 'svelte-eslint-parser',
			parserOptions : {
				parser: '@typescript-eslint/parser'
			}
		}
	],
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

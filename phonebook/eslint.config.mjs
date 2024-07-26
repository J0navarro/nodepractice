import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    files: ["**/*.js"],
    languageOptions: {sourceType: "commonjs"},
    rules: {
      'eqeqeq': ['error', 'always'], // Asegura que se use el operador de triple igual
      'no-console': 0
    },},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',     
      // Agrega más patrones según sea necesario
    ],
  },
 
];
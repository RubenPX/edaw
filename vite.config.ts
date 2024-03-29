import path from "path";
import { defineConfig } from "vite";
import packageJson from "./package.json";
import dts from 'vite-plugin-dts'

const buildMode: 'development' | 'production' | string = process.env.NODE_ENV ?? 'production';
console.log(`MODE: ${buildMode}`);

const getPackageName = () => {
  return packageJson.name;
};

const getPackageNameCamelCase = () => {
  try {
    return getPackageName().replace(/-./g, (char) => char[1].toUpperCase());
  } catch (err) {
    throw new Error("Name property in package.json is missing.");
  }
};

const fileName = {
  es: `${getPackageName()}.mjs`,
  cjs: `${getPackageName()}.cjs`,
  iife: `${getPackageName()}.iife.js`,
};

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;

module.exports = defineConfig({
  base: "./",
  build: {
    sourcemap: buildMode === 'development',
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: getPackageNameCamelCase(),
      formats,
      fileName: (format) => fileName[format],
    },
  },
  plugins: [dts({ logLevel: 'warn' })]
});

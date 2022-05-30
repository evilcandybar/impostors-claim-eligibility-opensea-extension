import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from "rollup-plugin-json";
import nodePolyfills from 'rollup-plugin-node-polyfills';


const baseConfig = createBasicConfig();

export default merge(baseConfig, {
  input: './out-tsc/src/content-script.js',
  output: {
    dir: 'dist',
    format: 'iife'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    json(),
    nodePolyfills()
  ],
});
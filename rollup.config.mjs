// @ts-check
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json' with { type: 'json' };

const { name } = pkg;

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: `dist/es2015/${name}.js`,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        removeComments: true,
        sourceMap: true,
      })
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: `dist/native-modules/${name}.js`,
        format: 'es',
        sourcemap: true,
      },
      {
        file: `dist/amd/${name}.js`,
        format: 'amd',
        name: name,
        sourcemap: true,
      },
      {
        file: `dist/commonjs/${name}.js`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `dist/system/${name}.js`,
        format: 'system',
        sourcemap: true,
      }
    ],
    plugins: [
      typescript({
        target: 'es5',
        removeComments: true,
        sourceMap: true,
      })
    ]
  }
]);

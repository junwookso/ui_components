import { readFile, writeFile, copyFile } from 'node:fs/promises'

// Publish Tailwind input, not precompiled utilities. Paths resolve from dist/style.css.
const source = await readFile(new URL('../src/styles/index.css', import.meta.url), 'utf8')
const css = source.replace(/@source [^;]+;\n/g, '')
await writeFile(new URL('../dist/style.css', import.meta.url), `@source "./index.js";\n${css}`)
for (const name of ['tokens.css', 'typography.css']) {
  await copyFile(new URL(`../src/styles/${name}`, import.meta.url), new URL(`../dist/${name}`, import.meta.url))
}

import { readdir, readFile, stat, mkdir, writeFile, unlink } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const srcDir = path.join(root, 'photos')
const outDir = path.join(root, 'public', 'img')
const manifestFile = path.join(root, 'src', 'content', 'images.json')
const WIDTHS = [480, 800, 1200, 1600]
const BIG = { hero_river: [2400] }
const WEBP_Q = (w) => (w <= 800 ? 74 : w <= 1200 ? 70 : 66)
const AVIF_Q = (w) => (w <= 800 ? 52 : w <= 1200 ? 48 : 45)
const SETTINGS = 'v2:' + WIDTHS.join(',') + ':' + JSON.stringify(BIG)

await mkdir(outDir, { recursive: true })
const previous = await readFile(manifestFile, 'utf8').then(JSON.parse).catch(() => ({}))
const files = (await readdir(srcDir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()
const manifest = {}
const keep = new Set()
let made = 0

const exists = (p) => stat(p).then(() => true).catch(() => false)

for (const file of files) {
  const key = file.replace(/\.[^.]+$/, '')
  const src = path.join(srcDir, file)
  const hash = createHash('sha1').update(await readFile(src)).update(SETTINGS).digest('hex').slice(0, 16)
  const meta = await sharp(src).rotate().metadata()
  const w0 = meta.autoOrient?.width ?? meta.width
  const h0 = meta.autoOrient?.height ?? meta.height
  const all = [...WIDTHS, ...(BIG[key] ?? [])]
  const widths = all.filter((w, i) => i === 0 || w <= w0 || all[i - 1] < w0)
  const same = previous[key] && (previous[key].src === hash || previous[key].src === undefined)
  for (const w of widths) {
    const width = Math.min(w, w0)
    for (const fmt of ['avif', 'webp']) {
      const name = `${key}-${w}.${fmt}`
      const out = path.join(outDir, name)
      keep.add(name)
      if (same && (await exists(out))) continue
      const img = sharp(src).rotate().resize({ width, withoutEnlargement: true })
      if (fmt === 'avif') await img.avif({ quality: AVIF_Q(w), effort: 3 }).toFile(out)
      else await img.webp({ quality: WEBP_Q(w), effort: 5 }).toFile(out)
      made++
    }
  }
  manifest[key] = { w: widths, ratio: +(w0 / h0).toFixed(4), src: hash }
}

let removed = 0
for (const f of await readdir(outDir)) {
  if (!keep.has(f)) {
    await unlink(path.join(outDir, f))
    removed++
  }
}

await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + '\n')
console.log(`images: ${files.length} photos, ${made} files updated, ${removed} old files removed`)

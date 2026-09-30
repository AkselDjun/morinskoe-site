import { spawnSync } from 'node:child_process'
import { rm, rename } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const run = (args, env = {}) => {
  const r = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit', env: { ...process.env, ...env } })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

run(['scripts/images.mjs'])
run([path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next'), 'build'], { NEXT_PUBLIC_DEMO: '1' })
await rm(path.join(root, 'out-demo'), { recursive: true, force: true })
await rename(path.join(root, 'out'), path.join(root, 'out-demo'))
await rm(path.join(root, 'out-demo', 'api'), { recursive: true, force: true })
await rm(path.join(root, 'out-demo', '.htaccess'), { force: true })
console.log('demo: out-demo is ready')

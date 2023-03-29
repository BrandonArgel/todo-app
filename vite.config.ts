import * as path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Add the paths required for the aliases
const paths = [
  "assets",
  "components",
  "context",
  "hooks",
  "models",
  "styles",
  "utils",
]

/**
 * Function to create the aliases
 * @returns An array with the aliases
 */
const getAliases = () => paths.map(p => ({ find: `@${p}`, replacement: path.resolve(__dirname, `src/${p}`) }))

interface config {
  resolve: object;
  plugins: any[]
  [key: string]: any;
}

/**
 * Initial configuration for Vite
 */
export default defineConfig(({ command, mode }) => {
  console.log({ command, mode })

  const config: config = {
    plugins: [react()],
    resolve: {
      alias: getAliases(),
    }
  }

  if (mode === 'development') {
    const env = loadEnv(mode, process.cwd())

    config.server = {
      port: env.VITE_PORT || 3000,
    }
  }

  return config
})
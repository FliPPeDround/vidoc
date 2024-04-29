import cac from 'cac'
import { loadConfig } from 'unconfig'
import pkg from '../package.json'

const cli = cac()

cli.command('dev', 'run dev server')
  .option('-p, --port <port>', 'server port')
  .option('-c, --config <config>', 'server config')
  .action((name) => {
    console.log(name)
  })

cli.help()
cli.version(pkg.version)

cli.parse()

async function getConfig() {
  const { config, sources } = await loadConfig({
    sources: [
      {
        files: 'vidoc.config',
        extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
      },
      {
        files: 'package.json',
        extensions: [],
        rewrite(config) {
          return config!.vidoc
        },
      },
      {
        files: 'vite.config',
        async rewrite(config) {
          const resolved = await (typeof config === 'function' ? config() : config)
          return resolved?.vidoc
        },
      },
    ],
    merge: false,
  })

  console.log(config, sources)
}

getConfig()

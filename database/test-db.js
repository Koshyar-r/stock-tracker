const fs = require('fs')
const path = require('path')
const readline = require('readline')
const mongoose = require('mongoose')

function parseDotEnv(content) {
  const vars = {}
  const lines = content.split(/\r?\n/)
  for (const raw of lines) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.substring(0, eq).trim()
    let val = line.substring(eq + 1).trim()
    // remove surrounding quotes
    if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
      val = val.substring(1, val.length - 1)
    }
    vars[key] = val
  }
  return vars
}

async function promptForUri() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const question = (q) => new Promise((res) => rl.question(q, (ans) => res(ans)))
  const answer = await question('Enter MongoDB URI (input is not echoed): ')
  rl.close()
  return answer.trim()
}

function findUriFromArgs() {
  const argv = process.argv.slice(2)
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--uri=')) return a.split('=')[1]
    if (a === '--uri' || a === '-u') return argv[i + 1]
    if (!a.startsWith('-')) return a // first positional argument
  }
  return undefined
}

function loadEnvFiles() {
  const root = process.cwd()
  const candidates = ['.env.local', '.env']
  for (const name of candidates) {
    const p = path.join(root, name)
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, 'utf8')
        const vars = parseDotEnv(content)
        if (vars.MONGO_URI) return { uri: vars.MONGO_URI, source: name }
      } catch (e) {
        // ignore parse errors
      }
    }
  }
  return null
}

function maskUri(uri) {
  if (!uri) return ''
  // Very simple mask: show scheme and hostname only
  try {
    const afterScheme = uri.split('://')[1] || uri
    const host = afterScheme.split('/')[0]
    return `***://${host.replace(/.(?=.{4})/g, '*')}`
  } catch (e) {
    return '***' 
  }
}

async function main() {
  // Priority: CLI arg > process.env > .env files > prompt
  let source = null
  let uri = findUriFromArgs()
  if (uri) source = 'cli'

  if (!uri && process.env.MONGO_URI) {
    uri = process.env.MONGO_URI
    source = 'env'
  }

  if (!uri) {
    const fromFile = loadEnvFiles()
    if (fromFile) {
      uri = fromFile.uri
      source = fromFile.source
    }
  }

  if (!uri) {
    // interactive prompt as last resort
    try {
      uri = await promptForUri()
      if (uri) source = 'prompt'
    } catch (e) {
      // ignore
    }
  }

  if (!uri) {
    console.error('ERROR: No MongoDB URI provided. Provide via CLI (node test-db.js "<uri>" or --uri), environment variable MONGO_URI, or a .env/.env.local file.')
    process.exit(2)
  }

  if (!/^mongodb(\+srv)?:\/\//i.test(uri)) {
    console.warn('WARNING: Provided URI does not look like a mongodb URI. Proceeding to attempt connection anyway.')
  }

  console.log(`Using MONGO_URI from ${source}`)
  // DO NOT print the raw URI to avoid accidental leaks

  try {
    await mongoose.connect(uri, { bufferCommands: false })
    console.log('OK: Database connection successful')
    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('ERROR: Database connection failed')
    console.error(error)
    process.exit(1)
  }
}

main()

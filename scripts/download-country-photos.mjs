import fs from "fs"
import path from "path"
import https from "https"
import http from "http"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(path.join(__dirname, ".."))

function loadEnv() {
  const candidates = [
    path.join(root, ".env"),
    path.join(process.cwd(), ".env"),
  ]
  const envPath = candidates.find((candidate) => fs.existsSync(candidate))
  if (!envPath) return {}
  const lines = fs.readFileSync(envPath, "utf8").split("\n")
  const env = {}
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const match = trimmed.match(/^([^=]+)=(.*)$/)
    if (!match) continue
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "")
  }
  return env
}

const key =
  loadEnv().UNSPLASH_ACCESS_KEY ??
  loadEnv().UNSPLASH_SECRET_KEY ??
  process.env.UNSPLASH_ACCESS_KEY
if (!key) {
  console.error("Missing UNSPLASH_ACCESS_KEY in .env")
  process.exit(1)
}

const countries = {
  "greece.jpg": "Santorini Greece travel",
  "south-africa.jpg": "Cape Town South Africa",
  "morocco.jpg": "Marrakech Morocco",
  "indonesia.jpg": "Bali Indonesia",
  "thailand.jpg": "Bangkok Thailand",
  "egypt.jpg": "Pyramids Egypt Cairo",
  "mexico.jpg": "Mexico travel landmark",
  "canada.jpg": "Banff Canada mountains",
  "india.jpg": "Taj Mahal India",
  "united-kingdom.jpg": "London United Kingdom",
  "default.jpg": "world travel landscape",
  "japan.jpg": "Kyoto Japan",
  "brazil.jpg": "Rio de Janeiro Brazil",
  "france.jpg": "Paris France Eiffel",
  "germany.jpg": "Berlin Germany",
  "italy.jpg": "Rome Italy Colosseum",
  "kenya.jpg": "Kenya safari",
  "new-zealand.jpg": "New Zealand mountains",
  "south-korea.jpg": "Seoul South Korea",
  "usa.jpg": "New York USA skyline",
  "united-states.jpg": "New York USA skyline",
  "fiji.jpg": "Fiji beach island",
  "australia.jpg": "Sydney Australia opera house",
  "china.jpg": "Great Wall China",
  "spain.jpg": "Barcelona Spain Sagrada",
}

const dest = path.join(root, "public", "countries")
fs.mkdirSync(dest, { recursive: true })

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { Authorization: `Client-ID ${key}` } }, (res) => {
        let data = ""
        res.on("data", (chunk) => {
          data += chunk
        })
        res.on("end", () => {
          try {
            resolve(JSON.parse(data))
          } catch (error) {
            reject(error)
          }
        })
      })
      .on("error", reject)
  })
}

function download(url, file) {
  return new Promise((resolve, reject) => {
    const getter = url.startsWith("https") ? https : http
    getter
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(res.headers.location, file).then(resolve).catch(reject)
          return
        }
        const stream = fs.createWriteStream(file)
        res.pipe(stream)
        stream.on("finish", () => {
          stream.close()
          resolve()
        })
        stream.on("error", reject)
      })
      .on("error", reject)
  })
}

for (const [file, query] of Object.entries(countries)) {
  const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`

  try {
    const data = await fetchJson(searchUrl)
    const url = data.results?.[0]?.urls?.regular
    if (!url) {
      console.log("SKIP no result:", file)
      continue
    }
    const out = path.join(dest, file)
    await download(url, out)
    console.log("OK", file, fs.statSync(out).size)
  } catch (error) {
    console.log("ERR", file, error instanceof Error ? error.message : error)
  }
}

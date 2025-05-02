import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { promises as fs } from 'fs'

const app = express()
const port = 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, 'public')))
app.use('/src', express.static(path.join(__dirname, 'src')))
app.use('/pixi', express.static(path.join(__dirname, 'node_modules/pixi.js/dist')))
app.use('/simplex-noise', express.static(path.join(__dirname, 'node_modules/simplex-noise/dist/esm')))

app.listen(port, () => {
  console.log(`Wanderleaf server running: http://localhost:${port}`)
})

app.get('/assets/:entity/:state/atlases/manifest.json', async (req, res) => {
  const { entity, state } = req.params
  const folderPath = path.join(__dirname, 'public', 'assets', entity, state, 'atlases')

  try {
    const files = await fs.readdir(folderPath)
    const jsonFiles = files.filter(file => file.endsWith('.json'))
    res.json(jsonFiles)
  } catch (err) {
    console.error(`Error reading atlases for entity: ${entity}, state: ${state}`, err)
    res.status(404).json({ error: 'Not found' })
  }
})

app.get('/assets/:entity/atlases/manifest.json', async (req, res) => {
  const { entity } = req.params
  const folderPath = path.join(__dirname, 'public', 'assets', entity, 'atlases')

  try {
    const files = await fs.readdir(folderPath)
    const jsonFiles = files.filter(file => file.endsWith('.json'))
    res.json(jsonFiles)
  } catch (err) {
    console.error(`Error reading atlases for entity: ${entity}`, err)
    res.status(404).json({ error: 'Not found' })
  }
})

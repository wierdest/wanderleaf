import path from 'path'
import { promises as fs } from 'fs'

const inputDir = process.argv[2]

if (!inputDir) {
  console.error('Please provide an input folder.')
  console.error('Usage: npm run atlas <input-folder>')
  process.exit(1)
}

const resolvedInputDir = path.resolve(inputDir)
const outputFolder = path.join(resolvedInputDir, 'atlases')

const cellSize = 32
const tilesetImage = 'tileset.png'

const rowConfig = [11, 11, 11, 11, 11, 11, 11, 9, 9, 9, 11]

async function generateTilesetAtlas () {
  await fs.mkdir(outputFolder, { recursive: true })

  const atlas = {
    frames: {},
    meta: {
      image: `../${tilesetImage}`,
      size: { w: 364, h: 364 },
      scale: '1'
    }
  }

  let xPos = 0
  let yPos = 0
  let tileIndex = 0

  for (const config of rowConfig) {
    const columnsInRow = config

    for (let col = 0; col < columnsInRow; col++) {
      const tileId = `tile${tileIndex}`
      atlas.frames[tileId] = {
        frame: { x: xPos, y: yPos, w: cellSize, h: cellSize }
      }

      xPos += cellSize
      tileIndex++
    }

    xPos = 0
    yPos += cellSize
  }

  const outputJsonPath = path.join(outputFolder, 'tileset-atlas.json')
  await fs.writeFile(outputJsonPath, JSON.stringify(atlas, null, 2), 'utf-8')

  console.log('Generated: tileset-atlas.json')
}

(async () => {
  try {
    await generateTilesetAtlas()
  } catch (e) {
    console.error(`Error generating atlas in ${resolvedInputDir}!\n`, e)
    process.exit(1)
  }
})()

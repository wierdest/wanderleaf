import path from 'path'
import { promises as fs } from 'fs'
import { DIRECTION } from '../src/game/constants/controls.js'

/**
 * Atlas generator utility
 */

const inputDir = process.argv[2]

if (!inputDir) {
  console.error('Please provide an input folder.')
  console.error('Usage: npm run atlas <input-folder>')
  process.exit(1)
}

const resolvedInputDir = path.resolve(inputDir)

const outputFolder = path.join(resolvedInputDir, 'atlases')

const stateName = path.basename(resolvedInputDir)

const cellSize = 256
const columns = 4
const totalFrames = (state) => {
  switch (state) {
    case 'idle':
      return 14
    case 'walk':
      return 9
    case 'run':
      return 5
    case 'jump':
      return 11
    case 'runningjump':
      return 8
    case 'melee':
      return 10
    case 'block':
      return 4
    default:
      console.warn(`No total frame count defined for state: ${state}`)
      return 1 // fallback or throw an error depending on your needs
  }
}

const DIRECTIONS = Object.values(DIRECTION)

async function generateIndividualAtlases () {
  const files = await fs.readdir(resolvedInputDir)

  await fs.mkdir(outputFolder, { recursive: true })

  for (const file of files) {
    if (!file.endsWith('.png')) {
      console.warn('Found unknown format! Skipping it!')
      continue
    }

    const baseName = path.basename(file, '.png').toLowerCase()

    const direction = baseName.split('_').find(dir => DIRECTIONS.includes(dir)) || 'unknown'

    if (direction === 'unknown') {
      console.warn('Found unknown direction! Skipping it!')
      continue
    }

    console.log(`Generating atlas ${baseName}...`)

    const atlas = {
      frames: {},
      meta: {
        image: `../${file}`,
        format: 'RGBA8888',
        size: { w: columns * cellSize, h: Math.ceil(totalFrames(stateName) / columns) * cellSize },
        scale: 1
      },
      animations: {
        [direction]: []
      }
    }

    let xPos = 0
    let yPos = 0

    for (let i = 0; i < totalFrames(stateName); i++) {
      const frameName = `${stateName}-${direction}${i + 1}`

      atlas.frames[frameName] = {
        frame: { x: xPos, y: yPos, w: cellSize, h: cellSize },
        sourceSize: { w: cellSize, h: cellSize },
        spriteSourceSize: { x: 0, y: 0, w: cellSize, h: cellSize }
      }

      atlas.animations[direction].push(frameName)

      xPos += cellSize

      if ((i + 1) % columns === 0) {
        xPos = 0
        yPos += cellSize
      }
    }

    const outputJsonPath = path.join(outputFolder, `${baseName}_atlas.json`)

    await fs.writeFile(outputJsonPath, JSON.stringify(atlas, null, 2), 'utf-8')

    console.log(`Generated: ${baseName}`)
  }
}

(async () => {
  try {
    await generateIndividualAtlases()
  } catch (e) {
    console.error(`Error generating atlases in ${resolvedInputDir}!\n`, e)
    process.exit(1)
  }
})()

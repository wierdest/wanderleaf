import { Direction } from '../enums/Direction.js'

export const ARROW_CONTROLS = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight'
}

export const DIRECTION_MAP = {
  '-1,-1': Direction.UP_LEFT,
  '1,-1': Direction.UP_RIGHT,
  '-1,1': Direction.DOWN_LEFT,
  '1,1': Direction.DOWN_RIGHT,
  '-1,0': Direction.LEFT,
  '1,0': Direction.RIGHT,
  '0,-1': Direction.UP,
  '0,1': Direction.DOWN
}

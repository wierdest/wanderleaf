export const DIRECTION = Object.freeze({
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  UP_LEFT: 'upleft',
  UP_RIGHT: 'upright',
  DOWN_LEFT: 'downleft',
  DOWN_RIGHT: 'downright'
})

export const ARROW_CONTROLS = Object.freeze({
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight'
})

export const DIRECTION_MAP = Object.freeze({
  '-1,-1': DIRECTION.UP_LEFT,
  '1,-1': DIRECTION.UP_RIGHT,
  '-1,1': DIRECTION.DOWN_LEFT,
  '1,1': DIRECTION.DOWN_RIGHT,
  '-1,0': DIRECTION.LEFT,
  '1,0': DIRECTION.RIGHT,
  '0,-1': DIRECTION.UP,
  '0,1': DIRECTION.DOWN
})

export const ACTION_KEYS = Object.freeze({
  JUMP: 'Space',
  RUN: 'ShiftLeft',
  MELEE: 'KeyE'
})

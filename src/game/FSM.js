/**
 *  TODO Eventually the player needs to implement this and its internal logic should be moved here
 */

export class FSM {
  constructor (initialState) {
    this.currentState = initialState
    this.states = new Map()
  }

  addState (name, { onEnter = () => {}, onUpdate = () => {}, onExit = () => {} }) {
    this.states.set(name, { onEnter, onUpdate, onExit })
  }

  getCurrent () {
    return this.states.get(this.currentState)?.name
  }

  changeState (newState) {
    if (!this.states.has(newState)) {
      console.warn(`FSM: Attempted to change to unknown state: ${newState}`)
      return
    }

    if (this.currentState) {
      const oldState = this.states.get(this.currentState)
      oldState?.onExit()
    }

    this.currentState = newState
    const state = this.states.get(this.currentState)
    state?.onEnter()
  }

  update (delta) {
    const state = this.states.get(this.currentState)
    state?.onUpdate(delta)
  }
}

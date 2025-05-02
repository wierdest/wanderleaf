export class Character {
  constructor () {
    this.name = ''
    this.backstory = ''
    this.hp = 100
    this.inventory = []
    this.level = 1
    this.experience = 0
  }

  describe () {
    console.log(`${this.name}: ${this.backstory}`)
  }

  collect (item) {
    this.inventory.push(item)
    console.log(`${item} added to inventory.`)
  }

  showInventory () {
    if (this.inventory.length === 0) {
      console.log('Inventory is empty!')
    } else {
      console.log('Inventory:', this.inventory.join(', '))
    }
  }

  takeDamage (amount) {
    this.hp = Math.max(this.hp - amount, 0)
    console.log(`${this.name} took ${amount} damage. HP: ${this.hp}`)
  }

  heal (amount) {
    this.hp += amount
    console.log(`${this.name} healed for ${amount}. HP: ${this.hp}`)
  }

  gainExperience (xp) {
    this.experience += xp
    console.log(`${this.name} gained ${xp} XP.`)
    // Level up logic can go here later
  }
}

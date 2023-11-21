

class Deck{
    constructor(cards=[]) {
        this.cards = cards
        
        if (!cards.length) this.refill()
    }
    refill() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'] 
        const faces = [...Array(9)].map((_, i) => 2 + i).concat(['A', 'J', 'Q', 'K'])

        for (var suit of suits) for (var face of faces) {
            this.cards.push(new Card(suit, face))
        }
    }
    toString() {
        return this.cards.map((card, index) => card.toString())
    }
}

class Card {
    constructor(suit, face) {
        this.suit = suit
        this.face = face
        this.value = !isNaN(face) ? face : (face == 'A') ? 11 : 10
    }
    toString() {
        return `${this.face} of ${this.suit}`
    }
}

console.log(new Deck().toString())
// new Deck()
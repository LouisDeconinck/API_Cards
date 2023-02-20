import { Hono } from "hono";
const app = new Hono();

const values: Array<string> = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits: Array<string> = ["♠", "♥", "♦", "♣"];
const deck: Array<string> = [];

app.get("/card", (c) => {
	let suit: string;
	let value: string;
	let pickedSuit: string;
	let pickedValue: string;

	// Get query parameters
	if (c.req.query('suit')) {
		suit = c.req.query('suit') as unknown as string;
	} else {
		suit = 'all';
	}
	if (c.req.query('value')) {
		value = c.req.query('value') as unknown as string;
	} else {
		value = 'all';
	}

	// Pull card
	if (suit === 'all') {
		pickedSuit = suits[Math.floor(Math.random() * suits.length)];
	} else {
		pickedSuit = suit;
	}
	if (value === 'all') {
		pickedValue = values[Math.floor(Math.random() * values.length)];
	} else {
		pickedValue = value;
	}
	const card: string = pickedValue + pickedSuit;

	return c.json({ card });
});

app.get("/cards", (c) => {
	// variable declaration
	let pulls: number;
	let back: string;
	let backBool: boolean;
	let suit: string;
	let value: string;

	// Get query parameters
	if (c.req.query('suit')) {
		suit = c.req.query('suit') as unknown as string;
	} else {
		suit = 'all';
	}
	if (c.req.query('value')) {
		value = c.req.query('value') as unknown as string;
	} else {
		value = 'all';
	}
	if (c.req.query('pulls')) {
		pulls = c.req.query('pulls') as unknown as number;
	} else {
		pulls = 1;
	}
	if (c.req.query('back')) {
		back = c.req.query('back') as unknown as string;
		if (back === 'false') {
			backBool = false;
		} else {
			backBool = true;
		}
	} else {
		backBool = true;
	}

	// Create deck
	const deck: Array<string> = [];
	for (let i = 0; i < values.length; i++) {
		if (value === 'all' || value === values[i]) {
			for (let j = 0; j < suits.length; j++) {
				if (suit === 'all' || suit === suits[j]) {
					deck.push(values[i] + suits[j]);
				}
			}
		}
	}

	// Limit pulls
	pulls = Math.min(pulls, 100000);

	// Pull cards
	let deckRemaining: Array<string> = deck;
	let cards: Array<string> = [];
	console.log(deckRemaining)
	for (let i = 0; i < pulls; i++) {
		// Get random card
		const index: number = Math.floor(Math.random() * deckRemaining.length);
		const card: string = deckRemaining[index];

		// Remove card from deck
		if (!backBool) {
			deckRemaining.splice(index, 1);
		}

		// Add card to cards
		cards.push(card);

		if (deckRemaining.length === 0) {
			break;
		}
	}
	console.log(deckRemaining)
	return c.json({ cards });
});

export default app
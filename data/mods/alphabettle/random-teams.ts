import type {PRNG} from '../../../sim';
import RandomTeams, {MoveCounter} from '../../random-teams';

export interface AlphabettleSet {
	species: string[];
	abilities: string[];
	items: string[];
	moves: string[];
}
interface AlphabettleSets {[k: string]: AlphabettleSet}

export const alphabettleSets: AlphabettleSets = {
	'A': {
		species: [],
		abilities: [],
		items: [],
		moves: []
	},
}

export class RandomAlphabettleTeams extends RandomTeams {
	randomAlphabettleTeam(options: {inBattle?: boolean} = {}) {
		const team = [];

		const itemPool = Object.keys(this.dex.data.Items);
		const abilityPool = Object.keys(this.dex.data.Abilities);
		const movePool = Object.keys(this.dex.data.Moves);
		const naturePool = Object.keys(this.dex.data.Natures);

		const randomN = this.randomNPokemon(this.maxTeamSize, this.forceMonotype);

		for (const forme of randomN) {
			// Choose forme
			const species = this.dex.species.get(forme);

			const letter: string = species.name.toLowerCase().charAt(0);

			// Random unique item
			let item = '';
			const itemPoolFiltered: string[] = itemPool.filter(i => i.toLowerCase().charAt(0) == letter);
			if (this.gen >= 2 && itemPoolFiltered.length) {
				do {
					item = this.sampleNoReplace(itemPoolFiltered);
				} while (this.dex.items.get(item).gen > this.gen && itemPoolFiltered.length);
			}

			// Random unique ability
			let ability = 'None';
			const abilityPoolFiltered: string[] = abilityPool.filter(a => a.toLowerCase().charAt(0) == letter);
			if (this.gen >= 3 && abilityPoolFiltered.length) {
				do {
					ability = this.sampleNoReplace(abilityPoolFiltered);
				} while ((this.dex.abilities.get(ability).gen > this.gen || this.dex.data.Abilities[ability].isNonstandard) && abilityPoolFiltered.length);
			}

			// Random unique moves
			const m = [];
			const movePoolFiltered = movePool.filter(mv => mv.toLowerCase().charAt(0) == letter);
			do {
				const moveid = this.sampleNoReplace(movePoolFiltered);
				const move = this.dex.moves.get(moveid);
				if (move.gen <= this.gen && !move.isNonstandard && !move.name.startsWith('Hidden Power ')) {
					m.push(moveid);
				}
			} while (m.length < 4 && movePoolFiltered.length > 0);

			// Standard EVs
			const evs = {hp:84, atk:84, def:84, spa:84, spd:84, spe:84};

			// Standard IVs
			const ivs: StatsTable = {hp:31, atk:31, def:31, spa:31, spd:31, spe:31};

			// Random nature
			const nature = this.sample(naturePool);

			// Level balance
			const mbstmin = 1307;
			const stats = species.baseStats;
			let mbst = (stats['hp'] * 2 + 31 + 21 + 100) + 10;
			mbst += (stats['atk'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['def'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spa'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spd'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spe'] * 2 + 31 + 21 + 100) + 5;
			let level = Math.floor(100 * mbstmin / mbst);
			while (level < 100) {
				mbst = Math.floor((stats['hp'] * 2 + 31 + 21 + 100) * level / 100 + 10);
				mbst += Math.floor(((stats['atk'] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats['def'] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor(((stats['spa'] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats['spd'] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor((stats['spe'] * 2 + 31 + 21 + 100) * level / 100 + 5);
				if (mbst >= mbstmin) break;
				level++;
			}

			// Random happiness
			const happiness = this.random(256);

			// Random shininess
			const shiny = this.randomChance(1, 1024);

			team.push({
				name: species.baseSpecies,
				species: species.name,
				gender: species.gender,
				item: item,
				ability: ability,
				moves: m,
				evs: evs,
				ivs: ivs,
				nature: nature,
				level,
				happiness: happiness,
				shiny: shiny,
			});
		}

		return team;
	}
}

export default RandomAlphabettleTeams;

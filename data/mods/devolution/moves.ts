export const Moves: {[moveid: string]: ModdedMoveData} = {
	explosion: {
		inherit: true,
		selfdestruct: 'ifNotDevolving',
	},
	selfdestruct: {
		inherit: true,
		selfdestruct: 'ifNotDevolving',
	},
	mistyexplosion: {
		inherit: true,
		selfdestruct: 'ifNotDevolving',
	},
	finalgambit: {
		inherit: true,
		selfdestruct: 'ifHitAndNotDevolving',
		damageCallback(pokemon) {
			const damage = pokemon.hp;
			if (pokemon.species.prevo == '') {
				pokemon.faint();
			}
			return damage;
		},
	},
	memento: {
		inherit: true,
		selfdestruct: 'ifHitAndNotDevolving',
	},
	healingwish: {
		inherit: true,
		selfdestruct: 'ifHitAndNotDevolving',
	},
	lunardance: {
		inherit: true,
		selfdestruct: 'ifHitAndNotDevolving',
	},
};

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
	destinybond: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				this.add('-singlemove', pokemon, 'Destiny Bond');
			},
			onFaint(target, source, effect) {
				if (!source || !effect || target.isAlly(source)) return;
				if (effect.effectType === 'Move' && !effect.isFutureMove) {
					if (source.volatiles['dynamax']) {
						this.add('-hint', "Dynamaxed Pokémon are immune to Destiny Bond.");
						return;
					}
					this.add('-activate', target, 'move: Destiny Bond');
					if (source.devolve()) {
						this.runEvent('AfterDamage', target, source, this.effect)
					} else {
						source.faint();
					}
				}
			},
			onBeforeMovePriority: -1,
			onBeforeMove(pokemon, target, move) {
				if (move.id === 'destinybond') return;
				this.debug('removing Destiny Bond before attack');
				pokemon.removeVolatile('destinybond');
			},
			onMoveAborted(pokemon, target, move) {
				pokemon.removeVolatile('destinybond');
			},
		}
	},
	perishsong: {
		inherit: true,
		condition: {
			duration: 4,
			onEnd(target) {
				this.add('-start', target, 'perish0');
				if (target.devolve()) {
					this.runEvent('AfterDamage', target, target, this.effect);
				} else {
					target.faint();
				}
			},
			onResidualOrder: 24,
			onResidual(pokemon) {
				const duration = pokemon.volatiles['perishsong'].duration;
				this.add('-start', pokemon, 'perish' + duration);
			},
		},
	}
};

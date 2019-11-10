var automaticMovePiston = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Automatic Move Piston',
            params: {
				moveTimeTag: {
					name: 'Move Time',
					type: 'fileObject',
					value: undefined,
				},
				offset: {
					name: 'Offset',
					type: 'number',
					value: -100,
				},
			},
            interface: {
				getCheckers: function(inst, player) {
					let levelData = game.dev.levelData.instance;
					let checkersContainer = levelData.params.checkersContainer.gameObjectRef;

					let res = [];
					for (let i = 0; i < checkersContainer.children.length; ++i) {
						let cur = checkersContainer.children[i];
						let curTransform = game.api.getComponent(cur, game.dev.transform);
						
						if (curTransform.params.rotation.value !== 0 && curTransform.params.rotation.value !== 180) {
							continue;
						}
						res.push({ transform: curTransform, initialPosition: {x: curTransform.params.x.value, y: curTransform.params.y.value } });
					}
					return res;
				},
				finish: function* (inst, player) {
					let start = (new Date()).getTime();
					let now = start;
					
					let piston = game.dev.levelData.instance.params.piston.gameObjectRef;
					piston = game.api.getComponent(piston, game.dev.transform);

					let m = game.api.math;

					let pistonInitialLevel = piston.params.y.value;

					let affectedCheckers = inst.interface.getCheckers(inst);

					let moveTime = player.context[inst.params.moveTimeTag.value];

					while ((now - start) < moveTime) {
						let progress = (now - start) / moveTime;
						if (progress > 1) {
							progress = 1;
						}

						let offset = progress * inst.params.offset.value;
						piston.params.y.value = pistonInitialLevel + offset;

						for (let i = 0; i < affectedCheckers.length; ++i) {
							let cur = affectedCheckers[i];
							if (cur.transform.params.rotation.value === 0) {
								cur.transform.params.y.value = cur.initialPosition.y + offset;
							} else {
								cur.transform.params.y.value = cur.initialPosition.y - offset;
							}
						}

						yield;
						now = (new Date()).getTime();
					}

					piston.params.y.value = pistonInitialLevel + inst.params.offset.value;
					for (let i = 0; i < affectedCheckers.length; ++i) {
						let cur = affectedCheckers[i];
						if (cur.transform.params.rotation.value === 0) {
							cur.transform.params.y.value = cur.initialPosition.y + inst.params.offset.value;
						} else {
							cur.transform.params.y.value = cur.initialPosition.y - inst.params.offset.value;
						}
					}
				}
            }
        };
        return inst;
    }
};

module.exports = automaticMovePiston;

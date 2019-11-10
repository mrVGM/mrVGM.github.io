var movePiston = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Move Piston',
            params: {
				piston: {
					name: 'Piston',
					type: 'gameObject',
					value: undefined
				},
				transitionTime: {
					name: 'Transition Time',
					type: 'number',
					value: 50
				},
				offset: {
					name: 'Offset',
					type: 'number',
					value: -100
				},
				movePistonTag: {
					name: 'Move Piston Tag',
					type: 'fileObject',
					value: undefined
				},
				pistonMovedTag: {
					name: 'Piston Moved',
					type: 'fileObject',
					value: undefined
                },
                reportActionTag: {
                    name: 'Report Action Tag',
                    type: 'fileObject',
                    value: undefined
                },
                actionTag: {
                    name: 'Action Tag',
                    type: 'fileObject',
                    value: undefined
                }
			},
            interface: {
				getCheckers: function(inst) {
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
				finish: function* (inst) {
					if (inst.params.pistonMovedTag.value) {
						delete inst.context[inst.params.pistonMovedTag.value];
					}

					if (!inst.context[inst.params.movePistonTag.value]) {
						return;
					}

					let start = (new Date()).getTime();
					let now = start;
					
					let piston = inst.params.piston.gameObjectRef;
					piston = game.api.getComponent(piston, game.dev.transform);

					let m = game.api.math;

					let pistonInitialLevel = piston.params.y.value;

					let affectedCheckers = inst.interface.getCheckers(inst);
					while ((now - start) < inst.params.transitionTime.value) {
						let progress = (now - start) / inst.params.transitionTime.value;
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

					if (inst.params.pistonMovedTag.value) {
						inst.context[inst.params.pistonMovedTag.value] = true;
                    }

                    inst.interface.dispatchEvent(inst, inst.params.reportActionTag.value, [inst.params.actionTag.value]);
				}
            }
        };
        return inst;
    }
};

module.exports = movePiston;

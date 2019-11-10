var chooseAction = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Choose Action',
            params: {
				portableProgramTag: {
					name: 'Portable Program Tag',
					type: 'fileObject',
					value: undefined,
				},
				pistonDownTag: {
					name: 'Piston Down Tag',
					type: 'fileObject',
					value: undefined,
				},
				lastActionTag: {
					name: 'Last Action Tag',
					type: 'fileObject',
					value: undefined,
				}
			},
            interface: {
                coroutine: function* (inst) {
                    let levelData = game.dev.levelData.instance;
                    let actionsData = levelData.interface.getActionsData(levelData);

                    let lastMove = inst.context[inst.params.lastActionTag.value];
                    let pistonDown = inst.context[inst.params.pistonDownTag.value];
                    let randomMove = actionsData.interface.chooseRandomMove(actionsData, lastMove, pistonDown);

                    let portableProgram = actionsData.interface.getActionsByTag(actionsData, randomMove.chosenMove).animatedAction;
					inst.context[inst.params.portableProgramTag.value] = portableProgram;

                    inst.context[inst.params.pistonDownTag.value] = randomMove.pistonDown;
                    inst.context[inst.params.lastActionTag.value] = randomMove.chosenMove;
				}
            }
        };
        return inst;
    }
};

module.exports = chooseAction;
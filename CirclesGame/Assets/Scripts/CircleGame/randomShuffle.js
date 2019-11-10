var randomShuffle = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Random Shuffle',
            params: {
                numberOfMoves: {
                    name: 'Number Of Moves',
                    type: 'number',
                    value: 30
                },
				movesDoneTag: {
					name: 'Moves Done Tag',
					type: 'fileObject',
					value: undefined
				}
			},
            interface: {
                coroutine: function* (inst) {
                    let levelData = game.dev.levelData.instance;
                    let actionsData = levelData.interface.getActionsData(levelData);

                    let pistonDown = false;
					let moves = [];

                    lastMove = undefined;
                    for (let i = 0; i < inst.params.numberOfMoves.value; ++i) {
                        let tmp = actionsData.interface.chooseRandomMove(actionsData, lastMove, pistonDown);
                        moves.push(tmp.chosenMove);
                        pistonDown = tmp.pistonDown;
                        lastMove = moves[moves.length - 1];
                    }

                    if (pistonDown) {
                        moves.push(actionsData.params.pistonUpTag.value);
                    }

                    for (let i = 0; i < moves.length; ++i) {
                        let cur = moves[i];
                        let actions = actionsData.interface.getActionsByTag(actionsData, cur);
                        let instantAction = actions.instantAction;

                        instantAction.interface.execute(instantAction);
                    }

                    inst.context[inst.params.movesDoneTag.value] = moves;
				}
            }
        };
        return inst;
    }
};

module.exports = randomShuffle;
var chooseMoveFromList = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Choose Move from List',
            params: {
				portableProgramTag: {
					name: 'Portable Program Tag',
					type: 'fileObject',
					value: undefined
                },
                movesListTag: {
                    name: 'Moves List Tag',
                    type: 'fileObject',
                    value: undefined
                },
                listIndexTag: {
                    name: 'List Index Tag',
                    type: 'fileObject',
                    value: undefined
                },
                listCompletedTag: {
                    name: 'List Completed Tag',
                    type: 'fileObject',
                    value: undefined
                },
                reverseList: {
                    name: 'ReverseList',
                    type: 'number',
                    value: 0
                }
			},
            interface: {
                coroutine: function* (inst) {
                    function dispatchListCompletedEvent() {
                        inst.interface.dispatchEvent(inst, inst.params.listCompletedTag.value, true);
                        delete inst.context[inst.params.portableProgramTag.value];
                    }

                    let list = inst.context[inst.params.movesListTag.value];
                    if (!list) {
                        dispatchListCompletedEvent();
                        return;
                    }

                    let index = inst.context[inst.params.listIndexTag.value];
                    if ((typeof index) === 'undefined') {
                        index = 0;
                    }

                    if (list.length === index) {
                        dispatchListCompletedEvent();
                        return;
                    }

                    let i = index;
                    if (inst.params.reverseList.value === 1) {
                        i = list.length - 1 - index;
                    }
                    let move = list[i];
                    let levelData = game.dev.levelData.instance;
                    let actionsData = levelData.interface.getActionsData(levelData);

                    if (inst.params.reverseList.value === 1) {
                        move = actionsData.interface.getOpposite(actionsData, move);
                    }

                    let portableProgram = actionsData.interface.getActionsByTag(actionsData, move).animatedAction;
                    inst.context[inst.params.portableProgramTag.value] = portableProgram;
                    inst.context[inst.params.listIndexTag.value] = index + 1;
				}
            }
        };
        return inst;
    }
};

module.exports = chooseMoveFromList;
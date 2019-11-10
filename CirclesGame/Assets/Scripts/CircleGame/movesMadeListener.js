var movesMadeListener = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Moves Made Listener',
            params: {
                movesListTag: {
                    name: 'Moves List Tag',
                    type: 'fileObject',
                    value: undefined
                },
                movesDoneTag: {
                    name: 'Moves Done Tag',
                    type: 'fileObject',
                    value: undefined
                }
			},
            interface: {
                coroutine: function* (inst) {
                    while (true) {
                        let moves = inst.events[inst.params.movesDoneTag.value];
                        if (moves) {
                            let list = inst.context[inst.params.movesListTag.value];
                            if (typeof list === 'undefined') {
                                list = [];
                            }

                            list = list.concat(moves);
                            inst.context[inst.params.movesListTag.value] = list;
                        }
                        yield;
                    }
                },
                finish: function* (inst) {
                    let moves = inst.events[inst.params.movesDoneTag.value];
                    if (moves) {
                        let list = inst.context[inst.params.movesListTag.value];
                        if (typeof list === 'undefined') {
                            list = [];
                        }

                        list = list.concat(moves);
                        inst.context[inst.params.movesListTag.value] = list;
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = movesMadeListener;
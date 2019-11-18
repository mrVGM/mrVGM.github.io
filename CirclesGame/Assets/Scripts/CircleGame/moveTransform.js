var moveTransform = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Move Transform',
            params: {
                transform: {
                    name: 'Transform',
                    type: 'gameObject',
                    value: undefined
                },
                x: {
                    name: 'X',
                    type: 'number',
                    value: 0
                },
                y: {
                    name: 'Y',
                    type: 'number',
                    value: 0
                }
			},
            interface: {
                coroutine: function* (inst) {
                    let tr = inst.params.transform.gameObjectRef;
                    tr = game.api.getComponent(tr, game.dev.transform);
                    tr.params.x.value = inst.params.x.value;
                    tr.params.y.value = inst.params.y.value;
                }
            }
        };
        return inst;
    }
};

module.exports = moveTransform;
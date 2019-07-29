var destroyGO = {
    extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function() {
        var inst = {
            name: 'Instantiate Prefab',
            params: {
                prefab: {
                    name: 'Prefab',
                    type: 'fileObject',
                    value: undefined
                },
                parent: {
                    name: 'Parent',
                    type: 'gameObject',
                    value: undefined
                },
                instantiateThisFrame: {
                    name: 'Instantiate This Frame',
                    type: 'number',
                    value: 1
                }
            },
            interface: {
                coroutine: function* (inst) {
                    var prefab = game.library[inst.params.prefab.value];
                    var parent = inst.params.parent.gameObjectRef;
                    if (inst.params.instantiateThisFrame.value === 1) {
                        game.api.instantiate(prefab.prefabStr, parent);
                    } else {
                        game.api.instantiateNextFrame(prefab.prefabStr, parent);
                    }
                }
            },
        };
        return inst;
    }
};

module.exports = destroyGO;
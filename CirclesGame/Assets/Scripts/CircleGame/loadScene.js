var loadScene = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Load Scene',
            params: {
				scenePrefab: {
                    name: 'Scene prefab',
                    type: 'fileObject',
                    value: undefined
                }
			},
            interface: {
                coroutine: function* (inst) {
                    game.api.destroyAllLiveObjects();
                    var scenePrefab = inst.params.scenePrefab.value;
                    var prefab = game.library[scenePrefab];
                    game.api.instantiate(prefab.prefabStr);
                }
            }
        };
        return inst;
    }
};

module.exports = loadScene;
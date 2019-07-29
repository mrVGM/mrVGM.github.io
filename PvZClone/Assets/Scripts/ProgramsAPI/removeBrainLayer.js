var program = {
    extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Remove Brain Layer',
            params: {},
            interface: {
                coroutine: function* (inst) {
                    function findBrain(go) {
                        var comp = game.api.getComponent(go, game.dev.programs.brain);
                        if (comp) {
                            return comp;
                        }
                        for (var i = 0; i < go.children.length; ++i) {
                            comp = findBrain(go.children[i]);
                            if (comp) {
                                return comp;
                            }
                        }
                    }
                    var brain = undefined;
                    var liveObjects = game.api.baseStructures.liveObjects;
                    for (var i = 0; i < liveObjects.length; ++i) {
                        brain = findBrain(liveObjects[i]);
                        if (brain) {
                            break;
                        }
                    }
                    brain.interface.removeLayer(brain);
                }
            }
        };
        return inst;
    }
};

module.exports = program;
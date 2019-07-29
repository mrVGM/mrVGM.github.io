var getContext = {
    extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Get Context',
            params: {},
            interface: {
                coroutine: function* (inst) {
                    inst.context = game.api.baseStructures.programsContext;
                    game.api.baseStructures.programsContext = undefined;
                },
            }
        };
        return inst;
    }
};

module.exports = getContext;
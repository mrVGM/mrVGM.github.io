var recordContext = {
    extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Record Context',
            params: {},
            interface: {
                coroutine: function* (inst) {
                    game.api.baseStructures.programsContext = inst.context;
                },
            }
        };
        return inst;
    }
};

module.exports = recordContext;
var putInContext = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Put In Context',
            params: {
				tag: {
                    name: 'Tag',
                    type: 'fileObject',
                    value: undefined
                }
			},
            interface: {
                coroutine: function* (inst) {
                    inst.context[inst.params.tag.value] = true;
                }
            }
        };
        return inst;
    }
};

module.exports = putInContext;
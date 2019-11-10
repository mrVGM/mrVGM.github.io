var eventOnContext = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Event On Context',
            params: {
				tag: {
                    name: 'Tag',
                    type: 'fileObject',
                    value: undefined
                }
			},
            interface: {
                coroutine: function* (inst) {
                    let ctx = inst.context[inst.params.tag.value];
                    if (ctx) {
                        inst.interface.dispatchEvent(inst, inst.params.tag.value, ctx);
                    }
                    yield;
                }
            }
        };
        return inst;
    }
};

module.exports = eventOnContext;
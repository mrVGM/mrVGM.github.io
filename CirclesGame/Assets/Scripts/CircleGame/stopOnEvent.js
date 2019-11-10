var stopOnEvent = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Stop On Event',
            params: {
				eventTag: {
                    name: 'Event Tag',
                    type: 'fileObject',
                    value: undefined
                }
			},
            interface: {
                coroutine: function* (inst) {
                    while (true) {
                        if (inst.events[inst.params.eventTag.value]) {
                            break;
                        }
                        yield;
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = stopOnEvent;
var releasePiston = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Release Piston',
            params: {
				pistonDownTag: {
					name: 'Piston Down Tag',
					type: 'fileObject',
					value: undefined,
				},
				portableProgramTag: {
					name: 'Portable Program Tag',
					type: 'fileObject',
					value: undefined,
				},
				pistonUpProgram: {
					name: 'Piston Up Program',
					type: 'fileObject',
					value: undefined,
				},
			},
            interface: {
				coroutine: function* (inst) {
					delete inst.context[inst.params.portableProgramTag.value];
					if (!inst.context[inst.params.pistonDownTag.value]) {
						return;
					}

					let portableProgram = game.library[inst.params.pistonUpProgram.value].scriptableObject.component.instance;
					inst.context[inst.params.portableProgramTag.value] = portableProgram;
				}
            }
        };
        return inst;
    }
};

module.exports = releasePiston;
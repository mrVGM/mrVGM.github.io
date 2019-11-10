var movePiston = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Move Piston',
            params: {
				pistonPushTag: {
					name: 'Push Piston Tag',
					type: 'fileObject',
					value: undefined
				},
				pushPistonKey: {
					name: 'Push Piston Key',
					type: 'number',
					value: 32,
				}
			},
            interface: {
				coroutine: function* (inst) {
					inst.context[inst.params.pistonPushTag.value] = false;
					if (game.input.keysDown[inst.params.pushPistonKey.value]) {
						inst.context[inst.params.pistonPushTag.value] = true;
					}
				}
            }
        };
        return inst;
    }
};

module.exports = movePiston;
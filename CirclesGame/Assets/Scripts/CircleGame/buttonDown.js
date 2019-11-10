var buttonDown = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Button Down',
            params: {
				down: {
					name: 'Down',
					type: 'number',
					value: 1,
				},
				keyCode: {
					name: 'Key Code',
					type: 'number', 
					value: undefined
				},
			},
            interface: {
                coroutine: function* (inst) {
					let down = inst.params.down.value === 1;
					while (!!game.input.keysDown[inst.params.keyCode.value] === down) {
						yield;
					}
				},
				finish: function* (inst) {
					console.log('Finished');
				}
            }
        };
        return inst;
    }
};

module.exports = buttonDown;
var wait = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Choose Action',
            params: {
				waitTime: {
					name: 'Wait Time',
					type: 'number',
					value: 1000,
				}
			},
            interface: {
				coroutine: function* (inst) {
					let initialTime = (new Date()).getTime();
					let curTime = initialTime;
					while (curTime - initialTime < inst.params.waitTime.value) {
						yield;
						curTime = (new Date()).getTime();
					}
				}
            }
        };
        return inst;
    }
};

module.exports = wait;
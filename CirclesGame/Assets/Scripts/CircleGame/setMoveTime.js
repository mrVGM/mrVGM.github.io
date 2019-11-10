var setMoveTime = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Set Move Time',
            params: {
				moveTimeTag: {
					name: 'Move Time Tag',
					type: 'fileObject',
					value: undefined,
				},
				timeSettingStarted: {
					name: 'Time Setting Started',
					type: 'fileObject',
					value: undefined,
				},
				moveTimeMax: {
					name: 'Move Time Max',
					type: 'number',
					value: 300,
				},
				moveTimeMin: {
					name: 'Move Time Min',
					type: 'number',
					value: 10,
				},
				timeToReachMin: {
					name: 'Time To Reach Min',
					type: 'number',
					value: 5000,
				}
			},
            interface: {
				coroutine: function* (inst) {
					let curTime = (new Date()).getTime();

					if (!inst.context[inst.params.timeSettingStarted.value]) {
						inst.context[inst.params.timeSettingStarted.value] = curTime;
					}
					let startTime = inst.context[inst.params.timeSettingStarted.value];

					let progress = curTime - startTime;
					if (progress > inst.params.timeToReachMin.value) {
						progress = inst.params.timeToReachMin.value;
					}

					progress /= inst.params.timeToReachMin.value;
					let curMoveDuration = progress * inst.params.moveTimeMin.value + (1 - progress) * inst.params.moveTimeMax.value;

					inst.context[inst.params.moveTimeTag.value] = curMoveDuration;
				}
            }
        };
        return inst;
    }
};

module.exports = setMoveTime;
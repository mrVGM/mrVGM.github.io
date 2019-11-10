var levelData = {
	onLoad: function() {
		game.dev.levelData = levelData;
	},
    createInstance: function () {
        var inst = {
            name: 'LevelData',
            params: {
				checkersContainer: {
					name: 'Checkers Container',
					type: 'gameObject',
					value: undefined
				},
				circleGameRoot: {
					name: 'Circle Game Root',
					type: 'gameObject',
					value: undefined
				},
				piston: {
					name: 'Piston',
					type: 'gameObject',
					value: undefined
                },
                actionsData: {
                    name: 'Actions Data',
                    type: 'fileObject',
                    value: undefined
                }
			},
			interface: {
				start: function(inst) {
					game.dev.levelData.instance = inst;
                },
                getActionsData: function (inst) {
                    let actionsData = game.library[inst.params.actionsData.value];
                    actionsData = actionsData.scriptableObject;
                    actionsData = actionsData.component.instance;
                    return actionsData;
                }
			}
        };
        return inst;
    }
};

module.exports = levelData;
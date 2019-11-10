var checker = {
	onLoad: function() {
		game.dev.checker = checker;
	},
    createInstance: function () {
        var inst = {
            name: 'Checker',
            params: {
				type: {
					name: 'Checker Type',
					type: 'fileObject',
					value: undefined
				}
			},
			interface: {
				getLevel: function(inst) {
					let tr = game.api.getComponent(inst.gameObject, game.dev.transform);
					let pos = { x: tr.params.x.value, y: tr.params.y.value };
					let m = game.api.math;
					return Math.round(m.vector.magnitude(pos)) / 100;
				}
			}
        };
        return inst;
    }
};

module.exports = checker;
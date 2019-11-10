var circleHandle = {
	onLoad: function() {
		game.dev.circleHandle = circleHandle;
	},
    createInstance: function () {
        var inst = {
            name: 'Circle Handle',
            params: {
				circle: {
					name: 'Circle',
					type: 'gameObject',
					value: undefined
				}
			},
			interface: {}
        };
        return inst;
    }
};

module.exports = circleHandle;
var pointerTarget = {
	onLoad: function() {
		game.dev.pointerTarget = pointerTarget;
	},
    createInstance: function () {
        var inst = {
            name: 'PointerTarget',
            params: {
				type: {
					name: 'Pointer Target Type',
					type: 'fileObject',
					value: undefined
				}
			},
			interface: {}
        };
        return inst;
    }
};

module.exports = pointerTarget;
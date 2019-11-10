var pointer = {
    extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Pointer',
            params: {
				pointedTargetsTag: {
					name: 'Pointed Targets Tag',
					type: 'fileObject',
					value: undefined
				}
			},
            interface: {
                coroutine: function* (inst) {
					while (true) {
						let mousePos = game.input.mousePos;

						if (!mousePos) {
							yield;
							continue;
						}
						let allColliders = game.api.getAllComponents(game.dev.collider);

						let pointed = [];
						for (let i = 0; i < allColliders.length; ++i) {
							let cur = allColliders[i];
							if (cur.interface.isInside(cur, mousePos)) {
								let pointerTarget = game.api.getComponent(cur.gameObject, game.dev.pointerTarget);
								if (pointerTarget) {
									pointed.push(pointerTarget);
								}
							}
						}

						inst.interface.dispatchEvent(inst, inst.params.pointedTargetsTag.value, pointed);
						yield;
					}
				},
            }
        };
        return inst;
    }
};

module.exports = pointer;
var showTransform = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Show Transform',
            params: {
                transform: {
                    name: 'Transform',
                    type: 'gameObject',
                    value: undefined
                },
                resetPositionAtStart: {
                    name: 'Reset Position At Start',
                    type: 'number',
                    value: 0
                }
			},
            interface: {
                coroutine: function* (inst) {
                    let go = inst.params.transform.gameObjectRef;
                    let animator = game.api.getComponent(go, game.dev.animation.animator);

                    if (animator) {
                        let defaultAnimation = animator.params.defaultAnimation.value;
                        if (defaultAnimation) {
                            animator.interface.playAnimation(animator, defaultAnimation);
                        }
                    }
                    else if (inst.params.resetPositionAtStart.value === 1) {
                        let tr = game.api.getComponent(go, game.dev.transform);
                        tr.params.x.value = 0;
                        tr.params.y.value = 0;
                    }
                    while (true) {
                        yield;
                    }
                },
                finish: function* (inst) {
                    let tr = inst.params.transform.gameObjectRef;
                    tr = game.api.getComponent(tr, game.dev.transform);
                    tr.params.x.value = -1000000;
                }
            }
        };
        return inst;
    }
};

module.exports = showTransform;
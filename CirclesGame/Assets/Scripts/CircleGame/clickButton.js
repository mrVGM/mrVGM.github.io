var clickButton = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Click Button',
            params: {
                tag: {
                    name: 'Button Tag',
                    type: 'fileObject',
                    value: undefined
                },
                pointedTargetsTag: {
                    name: 'Pointed Targets Tag',
                    type: 'fileObject',
                    value: undefined
                }
			},
            interface: {
                coroutine: function* (inst) {
                    function isHovered() {
                        let pointedTargets = inst.events[inst.params.pointedTargetsTag.value];
                        if (!pointedTargets) {
                            return false;
                        }
                        for (let i = 0; i < pointedTargets.length; ++i) {
                            let cur = pointedTargets[i];
                            if (cur.params.type.value === inst.params.tag.value) {
                                return true;
                            }
                        }
                        return false;
                    }

                    while (true) {
                        while (!game.input.mouseDown || game.input.mouseButton !== 0) {
                            yield;
                        }

                        if (!isHovered()) {
                            while (game.input.mouseDown) {
                                yield;
                            }
                            continue;
                        }

                        while (game.input.mouseDown) {
                            yield;
                        }

                        if (isHovered()) {
                            return;
                        }
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = clickButton;
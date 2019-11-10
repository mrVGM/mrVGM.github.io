var highlightButton = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Highlight Button Button',
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
                },
                highlightImage: {
                    name: 'Highlight Image', 
                    type: 'fileObject',
                    value: undefined
                },
                button: {
                    name: 'Button',
                    type: 'gameObject',
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

                    let image = inst.params.button.gameObjectRef;
                    image = game.api.getComponent(image, game.dev.image);

                    let initialImage = image.params.image.value;

                    function getImage() {
                        if (isHovered()) {
                            return inst.params.highlightImage.value;
                        }
                        return initialImage; 
                    }

                    while (true) {
                        image.params.image.value = getImage();

                        while (!isHovered()) {
                            yield;
                        }

                        while (game.input.mouseDown) {
                            image.params.image.value = initialImage;
                            yield;
                        }

                        while (isHovered()) {
                            image.params.image.value = inst.params.highlightImage.value;
                            yield;
                        }
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = highlightButton;
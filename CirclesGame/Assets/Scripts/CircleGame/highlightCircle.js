var highlightCircle = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Highlight Circle',
            params: {
                currentCircleTag: {
                    name: 'Currrent Circle Tag',
                    type: 'fileObject',
                    value: undefined
                },
                pointedTargetsTag: {
                    name: 'Pointed Targets Tag',
                    type: 'fileObject',
                    value: undefined
                },
                highlightImages: {
                    name: 'Highlight Images',
                    type: 'fileObject',
                    value: undefined
                },
                outerHandleTag: {
                    name: 'Outer Handle Tag',
                    type: 'fileObject',
                    value: undefined
                }
			},
            interface: {
                setImagesToCircle: function (inst, go, highlighted) {
                    function getHandles(go) {
                        let res = [];
                        let handle = game.api.getComponent(go, game.dev.circleHandle);
                        if (handle) {
                            res.push(handle);
                        }
                        for (let i = 0; i < go.children.length; ++i) {
                            let cur = go.children[i];
                            res = res.concat(getHandles(cur));
                        }
                        return res;
                    }

                    let highlightImages = inst.params.highlightImages.value;
                    highlightImages = game.library[highlightImages].scriptableObject.component.instance;
                    let handles = getHandles(go);

                    function canHighlight(tag) {
                        if (inst.params.outerHandleTag.value !== tag) {
                            return true;
                        }
                        let levelData = game.dev.levelData.instance;
                        let piston = levelData.params.piston.gameObjectRef;
                        let pistonTr = game.api.getComponent(piston, game.dev.transform);
                        return pistonTr.params.y.value === 0;
                    }

                    for (let i = 0; i < handles.length; ++i) {
                        let pointerTarget = game.api.getComponent(handles[i].gameObject, game.dev.pointerTarget);
                        let handle = pointerTarget.params.type.value;
                        let images = highlightImages.interface.getHighlightImages(highlightImages, handle);

                        let img = handles[i];
                        img = game.api.getComponent(img.gameObject, game.dev.image);
                        img.params.image.value = images.normal;
                        if (highlighted && canHighlight(handle)) {
                            img.params.image.value = images.highlighted;
                        }
                    }
                },
                resetImages: function (inst) {
                    let levelData = game.dev.levelData.instance;
                    let circleRoot = levelData.params.circleGameRoot.gameObjectRef;
                    inst.interface.setImagesToCircle(inst, circleRoot, false);
                },
                coroutine: function* (inst) {
                    
                    function getPointedCircle() {
                        let pointedTargets = inst.events[inst.params.pointedTargetsTag.value];
                        if (!pointedTargets) {
                            return;
                        }
                        for (let i = 0; i < pointedTargets.length; ++i) {
                            let cur = pointedTargets[i];
                            let circleHandle = game.api.getComponent(cur.gameObject, game.dev.circleHandle);
                            if (circleHandle) {
                                return circleHandle.params.circle.gameObjectRef;
                            }
                        }
                    }

                    function getCurrentCircle() {
                        let circle = inst.context[inst.params.currentCircleTag.value];
                        if (circle) {
                            return circle.circle.gameObject;
                        }
                    }

                    while (true) {
                        inst.interface.resetImages(inst);
                        let circleGo = getCurrentCircle();
                        if (!circleGo) {
                            circleGo = getPointedCircle();
                        }
                        if (circleGo) {
                            inst.interface.setImagesToCircle(inst, circleGo, true);
                        }
                        yield;
                    }
                },
                finish: function* (inst) {
                    inst.interface.resetImages(inst);
                }
            }
        };
        return inst;
    }
};

module.exports = highlightCircle;
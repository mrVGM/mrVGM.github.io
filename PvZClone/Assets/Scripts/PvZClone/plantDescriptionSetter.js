var plantDescriptionSetter = {
    extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Plant Description Setter',
            params: {
                plantDescription: {
                    name: 'Plant Description',
                    type: 'gameObject',
                    value: undefined
                },
                leftButton: {
                    name: 'Left Button',
                    type: 'gameObject',
                    value: undefined
                },
                rightButton: {
                    name: 'Right Button',
                    type: 'gameObject',
                    value: undefined
                },
                indexModifierTag: {
                    name: 'IndexModifierTag',
                    type: 'fileObject',
                    value: undefined
                },
                plantDescription: {
                    name: 'Plant Description',
                    type: 'gameObject',
                    value: undefined
                },
                circlesPlace: {
                    name: 'Circles Place',
                    type: 'gameObject',
                    value: undefined
                },
                circlePrefab: {
                    name: 'Circle Prefab',
                    type: 'fileObject',
                    value: undefined
                },
                spacing: {
                    name: 'Spacing',
                    type: 'number',
                    value: 0,
                }
            },
            interface: {
                currentIndex: 0,
                circles: [],
                setPlantDefinition: function(inst) {
                    var plantDefinition = game.api.baseStructures.levelState.plantDefinitions[inst.interface.currentIndex];
                    var plantDescription = inst.params.plantDescription.gameObjectRef;
                    plantDescription = game.api.getComponent(plantDescription, game.dev.plantDescription);
                    plantDescription.interface.setPlantDefinition(plantDescription, plantDefinition);
                    
                    var leftButtonTr = inst.params.leftButton.gameObjectRef;
                    leftButtonTr = game.api.getComponent(leftButtonTr, game.dev.transform);
                    
                    var rightButtonTr = inst.params.rightButton.gameObjectRef;
                    rightButtonTr = game.api.getComponent(rightButtonTr, game.dev.transform);
                    
                    if (inst.interface.currentIndex === 0) {
                        leftButtonTr.params.x.value = -1000;
                    }
                    else {
                        leftButtonTr.params.x.value = 0;
                    }

                    if (inst.interface.currentIndex === game.api.baseStructures.levelState.plantDefinitions.length - 1) {
                        rightButtonTr.params.x.value = -1000;
                    }
                    else {
                        rightButtonTr.params.x.value = 0;
                    }

                    for (var i = 0; i < inst.interface.circles.length; ++i) {
                        inst.interface.circles[i].params.variantIndex.value = 0;
                        if (i === inst.interface.currentIndex) {
                            inst.interface.circles[i].params.variantIndex.value = 1;
                        }
                    }
                },
                coroutine: function* (inst) {
                    function clamp(val, min, max) {
                        if (val < min) {
                            return min;
                        }
                        if (val > max) {
                            return max;
                        }
                        return val;
                    }

                    var circlePrefab = game.library[inst.params.circlePrefab.value];

                    for (var i = 0; i < game.api.baseStructures.levelState.plantDefinitions.length; ++i) {
                        var pref = game.api.instantiate(circlePrefab.prefabStr, inst.params.circlesPlace.gameObjectRef);
                        inst.interface.circles.push(game.api.getComponent(pref, game.dev.imageVariants));
                    }

                    if (inst.interface.circles.length > 0) {
                        var spacing = inst.interface.circles[0];
                        spacing = spacing.params.image.gameObjectRef;
                        spacing = game.api.getComponent(spacing, game.dev.image);
                        spacing = spacing.params.width.value;
                        var wholeWidth = inst.interface.circles.length * spacing + inst.params.spacing.value * (i - 1);
                        var leftmost = - wholeWidth / 2.0 + spacing / 2.0;
                        var curpos = leftmost;
                        for (var i = 0; i < inst.interface.circles.length; ++i) {
                            var cur = inst.interface.circles[i];
                            var tr = game.api.getComponent(cur.gameObject, game.dev.transform);
                            tr.params.x.value = curpos;
                            curpos += spacing + inst.params.spacing.value;
                        }
                    }

                    inst.interface.setPlantDefinition(inst);

                    while(true) {
                        var mod = inst.events[inst.params.indexModifierTag.value];
                        if (mod) {
                            var newIndex = inst.interface.currentIndex + mod;
                            newIndex = clamp(newIndex, 0, game.api.baseStructures.levelState.plantDefinitions.length - 1);
                            if (inst.interface.currentIndex !== newIndex) {
                                inst.interface.currentIndex = newIndex;
                                inst.interface.setPlantDefinition(inst);
                            }
                        }
                        yield;
                    }
                }
            },
        };
        return inst;
    }
};

module.exports = plantDescriptionSetter;
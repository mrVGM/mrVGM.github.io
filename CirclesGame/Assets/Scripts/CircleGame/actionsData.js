var actionsData = {
    createInstance: function () {
        var inst = {
            name: 'Actions Data',
            params: {
                handleLevels: {
                    name: 'Handle Levels',
                    type: 'array',
                    value: [],
                    defaultElement: {
                        type: 'custom',
                        value: {
                            handleTag: {
                                name: 'Handle Tag',
                                type: 'fileObject',
                                value: undefined
                            },
                            level: {
                                name: 'Level',
                                type: 'number',
                                value: 0
                            }
                        }
                    }
                },
                taggedActions: {
                    name: 'Tagged Actions',
                    type: 'array',
                    value: [],
                    defaultElement: {
                        type: 'custom',
                        value: {
                            tag: {
                                name: 'Tag',
                                type: 'fileObject',
                                value: undefined
                            },
                            instantAction: {
                                name: 'Instant Action',
                                type: 'fileObject',
                                value: undefined
                            },
                            animatedAction: {
                                name: 'Animated Action',
                                type: 'fileObject',
                                value: undefined
                            }
                        }
                    }
                },
                opposites: {
                    name: 'Opposites',
                    type: 'array',
                    value: [],
                    defaultElement: {
                        type: 'custom',
                        value: {
                            tag1: {
                                name: 'Tag1',
                                type: 'fileObject',
                                value: undefined
                            },
                            tag2: {
                                name: 'Tag2',
                                type: 'fileObject',
                                value: undefined
                            }
                        }
                    }
                },
                pistonDownTag: {
                    name: 'Piston Down Tag',
                    type: 'fileObject',
                    value: undefined
                },
                pistonUpTag: {
                    name: 'Piston Up Tag',
                    type: 'fileObject',
                    value: undefined
                },
                actionsByCircle: {
                    name: 'Actions By Circle',
                    type: 'array',
                    value: [],
                    defaultElement: {
                        type: 'custom',
                        value: {
                            circleTag: {
                                name: 'Circle Tag',
                                type: 'fileObject',
                                value: undefined
                            },
                            rotateLeftTag: {
                                name: 'Rotate Left Tag',
                                type: 'fileObject',
                                value: undefined
                            },
                            rotateRightTag: {
                                name: 'Rotate Right Tag',
                                type: 'fileObject',
                                value: undefined
                            }
                        }
                    }
                }
			},
            interface: {
                getHandleLevels: function (inst, handleType) {
                    let levels = inst.params.handleLevels.value;
                    let res = [];
                    for (let i = 0; i < levels.length; ++i) {
                        let cur = levels[i].value;
                        if (cur.handleTag.value === handleType) {
                            res.push(cur.level.value);
                        }
                    }
                    return res;
                },
                getHandleOfLevel: function (inst, level) {
                    let levels = inst.params.handleLevels.value;
                    for (let i = 0; i < levels.length; ++i) {
                        let cur = levels[i].value;
                        if (cur.level.value === level) {
                            return cur.handleTag.value;
                        }
                    }
                },
                getOpposite: function (inst, tag) {
                    let opposites = inst.params.opposites.value;
                    for (let i = 0; i < opposites.length; ++i) {
                        let cur = opposites[i].value;
                        if (cur.tag1.value === tag) {
                            return cur.tag2.value;
                        }
                        if (cur.tag2.value === tag) {
                            return cur.tag1.value;
                        }
                    }
                },
                getAllActions: function (inst) {
                    let res = [];
                    let taggedActions = inst.params.taggedActions.value;
                    for (let i = 0; i < taggedActions.length; ++i) {
                        let cur = taggedActions[i].value;
                        res.push(cur.tag.value);
                    }
                    return res;
                },
                getActionsByTag: function (inst, tag) {
                    let taggedActions = inst.params.taggedActions.value;
                    for (let i = 0; i < taggedActions.length; ++i) {
                        let cur = taggedActions[i].value;
                        if (cur.tag.value === tag) {
                            let instant = game.library[cur.instantAction.value].scriptableObject.component.instance;
                            let animated = game.library[cur.animatedAction.value].scriptableObject.component.instance;
                            return { instantAction: instant, animatedAction: animated };
                        }
                    }
                },
                chooseRandomMove: function (inst, lastMove, pistonDown) {
                    let actionsData = inst;
                    let opposite = undefined;
                    if (lastMove) {
                        opposite = actionsData.interface.getOpposite(actionsData, lastMove);
                    }
                    let allActions = actionsData.interface.getAllActions(actionsData);
                    let possible = [];
                    for (let i = 0; i < allActions.length; ++i) {
                        let cur = allActions[i];
                        if (cur === opposite) {
                            continue;
                        }

                        if (pistonDown) {
                            if (cur === actionsData.params.pistonDownTag.value) {
                                continue;
                            }
                            let action = actionsData.interface.getActionsByTag(actionsData, cur);
                            action = action.instantAction;

                            let handleByLevel = actionsData.interface.getHandleOfLevel(actionsData, 4);
                            if (action.params.handleType && action.params.handleType.value === handleByLevel) {
                                continue;
                            }
                        }
                        if (!pistonDown && cur === actionsData.params.pistonUpTag.value) {
                            continue;
                        }

                        possible.push(cur);
                    }

                    let randElem = Math.floor(Math.random() * possible.length);
                    randElem = possible[randElem];

                    if (randElem === actionsData.params.pistonDownTag.value) {
                        pistonDown = true;
                    }
                    else if (randElem === actionsData.params.pistonUpTag.value) {
                        pistonDown = false;
                    }
                    return {
                        chosenMove: randElem,
                        pistonDown: pistonDown
                    };
                },
                getActionsByCircle: function (inst, circleTag) {
                    let actionsByCircle = inst.params.actionsByCircle.value;
                    for (let i = 0; i < actionsByCircle.length; ++i) {
                        let cur = actionsByCircle[i].value;
                        if (cur.circleTag.value === circleTag) {
                            return {
                                left: cur.rotateLeftTag.value,
                                right: cur.rotateRightTag.value
                            };
                        }
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = actionsData;
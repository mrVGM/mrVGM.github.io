var rotateInstant = {
    createInstance: function () {
        var inst = {
            name: 'Rotate Instant Action',
            params: {
                angle: {
                    name: 'Angle',
                    type: 'number',
                    value: undefined
                },
                handleType: {
                    name: 'Handle Type',
                    type: 'fileObject',
                    value: undefined
                }
            },
            interface: {
                execute: function (inst) {
                    function getCheckers() {
                        let levelData = game.dev.levelData.instance;
                        let checkersContainer = levelData.params.checkersContainer.gameObjectRef;

                        let res = [];
                        for (let i = 0; i < checkersContainer.children.length; ++i) {
                            let cur = checkersContainer.children[i];
                            cur = game.api.getComponent(cur, game.dev.checker);
                            res.push(cur);
                        }
                        return res;
                    }

                    let levelData = game.dev.levelData.instance;
                    let actionData = levelData.interface.getActionsData(levelData);
                    let handleLevels = actionData.interface.getHandleLevels(actionData, inst.params.handleType.value);

                    let checkers = getCheckers();
                    let affectedElements = [];
                    for (let i = 0; i < checkers.length; ++i) {
                        let cur = checkers[i];
                        let tr = game.api.getComponent(cur.gameObject, game.dev.transform);

                        let curLevel = Math.round(Math.abs(tr.params.y.value / 100));
                        for (let j = 0; j < handleLevels.length; ++j) {
                            if (handleLevels[j] === curLevel) {
                                affectedElements.push(tr);
                            }
                        }
                    }

                    for (let i = 0; i < affectedElements.length; ++i) {
                        let cur = affectedElements[i];
                        let angle = cur.params.rotation.value;
                        angle += inst.params.angle.value;
                        while (angle < 0) {
                            angle += 360;
                        }
                        angle = (Math.round(angle / 90) % 4) * 90;
                        cur.params.rotation.value = angle;
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = rotateInstant;
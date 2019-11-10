var movePistonInstant = {
    createInstance: function () {
        var inst = {
            name: 'Move Piston Instant',
            params: {
                offset: {
                    name: 'Offset',
                    type: 'number',
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

                    let checkers = getCheckers(levelData.params.circleGameRoot.gameObjectRef);
                    let affectedElements = [];
                    for (let i = 0; i < checkers.length; ++i) {
                        let cur = checkers[i];
                        let tr = game.api.getComponent(cur.gameObject, game.dev.transform);

                        if (tr.params.rotation.value === 0 || tr.params.rotation.value === 180) {
                            affectedElements.push(tr);
                        }
                    }

                    let piston = levelData.params.piston.gameObjectRef;
                    piston = game.api.getComponent(piston, game.dev.transform);

                    piston.params.y.value += inst.params.offset.value;

                    for (let i = 0; i < affectedElements.length; ++i) {
                        let cur = affectedElements[i];
                        if (cur.params.rotation.value === 0) {
                            cur.params.y.value += inst.params.offset.value;
                        }
                        else if (cur.params.rotation.value === 180) {
                            cur.params.y.value -= inst.params.offset.value;
                        }
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = movePistonInstant;
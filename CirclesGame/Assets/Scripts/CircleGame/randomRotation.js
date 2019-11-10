var randomRotation = {
    createInstance: function () {
        var inst = {
            name: 'Random Rotation',
            params: {
                transform: {
                    name: 'Transform',
                    type: 'gameObject',
                    value: undefined
                }
            },
            interface: {
                start: function (inst) {
                    let tr = inst.params.transform.gameObjectRef;
                    tr = game.api.getComponent(tr, game.dev.transform);
                    let randRotation = Math.floor(Math.random() * 360);
                    tr.params.rotation.value = randRotation;
                }
            }
        };
        return inst;
    }
};

module.exports = randomRotation;
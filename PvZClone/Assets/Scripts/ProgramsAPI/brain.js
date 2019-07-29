var brain = {
    onLoad: function () {
        game.dev.programs.brain = brain;
    },
    createInstance: function () {
        var inst = {
            name: 'Brain',
            params: {},
            layersOperation: 0,
            layers: [{
                coroutines: []
            }],
            eventEmitters: [],
            eventCatchers: [],
            interface: {
                getCurrentLayer: function(inst) {
                    return inst.layers[inst.layers.length - 1];
                },
                addLayer: function(inst) {
                    inst.layersOperation = 1;
                },
                removeLayer: function(inst) {
                    inst.layersOperation = -1;
                },
                addCoroutine: function (inst, c) {
                    var currentLayer = inst.interface.getCurrentLayer(inst);
                    currentLayer.coroutines.push(c);
                },
                update: function (inst, dt) {
                    inst.layersOperation = 0;

                    var currentLayer = inst.interface.getCurrentLayer(inst);
                    var tmp = currentLayer.coroutines;
                    currentLayer.coroutines = [];
                    
                    for (var i = 0; i < tmp.length - 1; ++i) {
                        for (var j = i + 1; j < tmp.length; ++j) {
                            if (tmp[j].updateTime < tmp[i].updateTime) {
                                var t = tmp[i];
                                tmp[i] = tmp[j];
                                tmp[j] = t;
                            }
                        }
                    }
                    for (var i = 0; i < tmp.length; ++i) {
                        var res = tmp[i].crt.next();
                        if (!res.done) {
                            inst.interface.addCoroutine(inst, { updateTime: tmp[i].updateTime, crt: tmp[i].crt });
                        }
                    }

                    if (inst.layersOperation === 1) {
                        inst.layers.push({coroutines: []});
                    }
                    else if (inst.layersOperation === -1) {
                        inst.layers.pop();
                    }
                }
            },
        };
        return inst;
    }
};

module.exports = brain;
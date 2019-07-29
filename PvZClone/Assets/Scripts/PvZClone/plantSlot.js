var plantSlot = {
    onLoad: function () {
        game.dev.plantSlot = plantSlot;
    },
    extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Plant Slot',
            params: {
                plantData: {
                    name: 'Plant Data',
                    type: 'fileObject',
                    value: undefined
                },
                plantAvatar: {
                    name: 'Plant Avatar',
                    type: 'gameObject',
                    value: undefined
                },
                curtain: {
                    name: 'Curtain',
                    type: 'gameObject',
                    value: undefined
                },
                priceText: {
                    name: 'Price Text',
                    type: 'gameObject',
                    value: undefined
                }
            },
            interface: {
                lastSpawn: undefined,
                lastFrame: undefined,
                getPlantData: function(inst) {
                    return game.library[inst.params.plantData.value].scriptableObject.component.instance;
                },
                getLoadStatus: function(inst) {
                    var plantData = inst.interface.getPlantData(inst);
                    if (plantData.params.framesToLoad == 0) {
                        return 1;
                    }
                    return Math.min(1, (inst.interface.lastFrame - inst.interface.lastSpawn) / plantData.params.framesToLoad.value);
                },
                getSunCost: function(inst) {
                    var plantData = inst.interface.getPlantData(inst);
                    return plantData.params.sunCost.value;
                },
                canSelect: function(inst, sunCollected) {
                    var loaded = inst.interface.getLoadStatus(inst) === 1;
                    var enoughSun = inst.interface.getSunCost(inst) <= sunCollected;
                    return loaded && enoughSun;
                },
                plantDeployed: function(inst) {
                    inst.interface.lastSpawn = inst.interface.lastFrame;
                },
                coroutine: function* (inst) {
                    var avatar = inst.params.plantAvatar.gameObjectRef;
                    avatar = game.api.getComponent(avatar, game.dev.image);
                    var plantData = inst.interface.getPlantData(inst);
                    avatar.params.image.value = plantData.params.plantAvatarImage.value;

                    if (!game.api.baseStructures.levelState.plantDefinitions) {
                        game.api.baseStructures.levelState.plantDefinitions = [];
                    }
                    game.api.baseStructures.levelState.plantDefinitions.push(plantData);

                    inst.interface.lastSpawn = game.api.lastFrame;
                    inst.interface.lastFrame = game.api.lastFrame;

                    var priceText = inst.params.priceText.gameObjectRef;
                    priceText = game.api.getComponent(priceText, game.dev.text);
                    priceText.params.text.value = plantData.params.sunCost.value;

                    while(true) {
                        var curtainTransform = inst.params.curtain.gameObjectRef;
                        curtainTransform = game.api.getComponent(curtainTransform, game.dev.transform);
                        
                        var plantData = inst.interface.getPlantData(inst);
                        var loaded = inst.interface.getLoadStatus(inst);
                        curtainTransform.params.scaleY.value = 1 - loaded;
                        yield;
                        ++inst.interface.lastFrame;
                    }
                }
            },
        };
        return inst;
    }
};

module.exports = plantSlot;
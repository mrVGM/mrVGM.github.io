var plantDescription = {
    onLoad: function() {
        game.dev.plantDescription = plantDescription;
    },
    createInstance: function() {
        var inst = {
            name: 'Plant Description',
            params: {
                avatar: {
                    name: 'Avatar',
                    type: 'gameObject',
                    value: undefined,
                },
                text: {
                    name: 'Text',
                    type: 'gameObject',
                    value: undefined,
                }
            },
            interface: {
                currentPlantDefinition: undefined,
                updatePlantDescription: function(inst) {
                    var image = inst.params.avatar.gameObjectRef;
                    image = game.api.getComponent(image, game.dev.image);
                    var text = inst.params.text.gameObjectRef;
                    text = game.api.getComponent(text, game.dev.text);
                    image.params.image.value = undefined;
                    text.params.text.value = '';
                    if (!inst.interface.currentPlantDefinition) {
                        return;
                    }

                    image.params.image.value = inst.interface.currentPlantDefinition.params.plantAvatarImage.value;
                    var str = '';
                    var lines = inst.interface.currentPlantDefinition.params.descriptionLines.value;
                    for (var i = 0; i < lines.length; ++i) {
                        str += lines[i].value + '\n';
                    }
                    text.params.text.value = str;
                },
                setPlantDefinition: function(inst, definition) {
                    inst.interface.currentPlantDefinition = definition;
                    inst.interface.updatePlantDescription(inst);
                },
                start: function(inst) {
                    inst.interface.updatePlantDescription(inst);
                }
            },
        };
        return inst;
    }
};

module.exports = plantDescription;
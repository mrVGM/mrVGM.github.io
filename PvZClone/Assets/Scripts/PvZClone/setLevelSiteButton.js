var setLevelSiteButton = {
    extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function() {
        var inst = {
            name: 'Set Level Site Button',
            params: {
                selectedSiteTag: {
                    name: 'Selectred Site Tag',
                    type: 'fileObject',
                    value: undefined
                },
                imageVariants: {
                    name: 'Image Variants',
                    type: 'gameObject',
                    value: undefined
                },
                character: {
                    name: 'Character',
                    type: 'gameObject',
                    value: undefined
                }
            },
            interface: {
                coroutine: function* (inst) {
                    var imageVariants = inst.params.imageVariants.gameObjectRef;
                    imageVariants = game.api.getComponent(imageVariants, game.dev.imageVariants);
                    var selectedSite = inst.context[inst.params.selectedSiteTag.value];
                    var character = inst.params.character.gameObjectRef;
                    character = game.api.getComponent(character, game.dev.character);
                    if (!selectedSite) {
                        selectedSite = character.interface.getSite(character);
                        inst.context[inst.params.selectedSiteTag.value] = selectedSite;
                    }

                    if (selectedSite.params.level.value === 0) {
                        imageVariants.params.variantIndex.value = 1;
                    }
                    else {
                        imageVariants.params.variantIndex.value = 0;
                    }
                }
            },
        };
        return inst;
    }
};

module.exports = setLevelSiteButton;
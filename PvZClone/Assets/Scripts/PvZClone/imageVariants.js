var imageVariants = {
    onLoad: function() {
        game.dev.imageVariants = imageVariants;
    },
    createInstance: function() {
        var inst = {
            name: 'ImageVariants',
            params: {
                variantIndex: {
                    name: 'Variant Index',
                    type: 'number',
                    value: 0
                },
                image: {
                    name: 'Image',
                    type: 'gameObject',
                    value: undefined
                },
                variants: {
                    name: 'Variants',
                    type: 'array',
                    value: [],
                    defaultElement: {
                        type: 'fileObject',
                        value: undefined
                    }
                }
            },
            interface: {
                update: function(inst) {
                    var image = inst.params.image.gameObjectRef;
                    image = game.api.getComponent(image, game.dev.image);

                    image.params.image.value = inst.params.variants.value[inst.params.variantIndex.value].value;
                }
            }
        };
        return inst;
    }
};

module.exports = imageVariants;
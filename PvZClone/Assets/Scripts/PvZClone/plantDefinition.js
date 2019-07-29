var plantDefinition = {
    createInstance: function () {
        var inst = {
            name: 'Plant Definition',
            params: {
                plantPrefab: {
                    name: 'Plant Prefab',
                    type: 'fileObject',
                    value: undefined
                },
                plantAvatarImage: {
                    name: 'Plant Avatar Image',
                    type: 'fileObject',
                    value: undefined
                },
                framesToLoad: {
                    name: 'Frames To Load',
                    type: 'number',
                    value: 1000,
                },
                sunCost: {
                    name: 'Sun Cost',
                    type: 'number',
                    value: 100,
                },
                descriptionLines: {
                    name: 'Description Lines',
                    type: 'array',
                    value: [],
                    defaultElement: {
                        type: 'text',
                        value: '',
                    },
                }
            },
            interface: {},
        };
        return inst;
    }
};

module.exports = plantDefinition;
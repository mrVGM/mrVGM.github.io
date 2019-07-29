var dispatchData = {
    extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Dispatch Data',
            params: {
                dataTag: {
                    name: 'Data Tag',
                    type: 'fileObject',
                    value: undefined
                },
                data: {
                    name: 'Data',
                    type: 'number',
                    value: 0
                },
            },
            interface: {
                coroutine: function* (inst) {
                    inst.interface.dispatchEvent(inst, inst.params.dataTag.value, inst.params.data.value);
                },
            }
        };
        return inst;
    }
};

module.exports = dispatchData;
var circleHighlights = {
    createInstance: function () {
        var inst = {
            name: 'Circle Highlights',
            params: {
                highlightImages: {
                    name: 'Highlight Images',
                    type: 'array',
                    value: [],
                    defaultElement: {
                        type: 'custom',
                        value: {
                            handleTag: {
                                name: 'Handle Tag',
                                type: 'fileObject',
                                value: undefined
                            },
                            image: {
                                name: 'Image',
                                type: 'fileObject',
                                value: undefined
                            },
                            normalImage: {
                                name: 'Normal Image',
                                type: 'fileObject',
                                value: undefined
                            }
                        }
                    }
                }
			},
            interface: {
                getHighlightImages: function (inst, handleType) {
                    let highlightImages = inst.params.highlightImages.value;
                    for (let i = 0; i < highlightImages.length; ++i) {
                        let cur = highlightImages[i].value;
                        if (cur.handleTag.value === handleType) {
                            return { highlighted: cur.image.value, normal: cur.normalImage.value };
                        }
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = circleHighlights;
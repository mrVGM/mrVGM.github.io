var render = {
    onLoad: function () {
        if (game) {
            game.api.renderGameObjects = render;
        }
    },
    render: function (liveGameObjects) {
        function render(go) {
            function loadImage(id) {
                var img = new Image();
                img.src = game.library[id].path;
                img.onload = function () {
                    game.library[id].image = img;
                };
            }

            var imageComponent = game.api.getComponent(go, game.dev.image);

            if (imageComponent) {
                var fileId = imageComponent.params.image.value;

                if(!fileId) {
                    return;
                }
                
                if (!game.library[fileId].image) {
                    loadImage(fileId);
                    return;
                }

                imageComponent.interface.render(imageComponent);
            }
        }
        function renderText(go) {
            var textComponent = game.api.getComponent(go, game.dev.text);

            if (textComponent) {
                textComponent.interface.render(textComponent);
            }
        }

        function getComponents(comp) {
            function getComponentImpl(go) {
                var res = [];
                var component = game.api.getComponent(go, comp);
                if (component) {
                    res.push(component);
                }
                for (var i = 0; i < go.children.length; ++i) {
                    res = res.concat(getComponentImpl(go.children[i]));
                }
                return res;
            }
            var res = [];
            for (var i = 0; i < game.api.baseStructures.liveObjects.length; ++i) {
                var cur = game.api.baseStructures.liveObjects[i];
                res = res.concat(getComponentImpl(cur));
            }
            return res;
        }

        var images = getComponents(game.dev.image);
        var texts = getComponents(game.dev.text);

        for (var i = 0; i < images.length; ++i) {
            var go = images[i].gameObject;
            var tr = game.api.getComponent(go, game.dev.transform);
            images[i] = { go: go, z: tr.params.z.value, renderFunc: render };
        }

        for (var i = 0; i < texts.length; ++i) {
            var go = texts[i].gameObject;
            var tr = game.api.getComponent(go, game.dev.transform);
            texts[i] = { go: go, z: tr.params.z.value, renderFunc: renderText };
        }

        var renderElements = images.concat(texts);
        for (var i = 0; i < renderElements.length - 1; ++i) {
            for (var j = i; j < renderElements.length; ++j) {
                if (renderElements[i].z < renderElements[j].z) {
                    var tmp = renderElements[i];
                    renderElements[i] = renderElements[j];
                    renderElements[j] = tmp;
                }
            }
        }

        game.api.baseStructures.context.clearRect(0, 0, game.api.baseStructures.canvas.width, game.api.baseStructures.canvas.height);

        for (var i = 0; i < renderElements.length; ++i) {
            renderElements[i].renderFunc(renderElements[i].go);
        }
    }
};

module.exports = render;
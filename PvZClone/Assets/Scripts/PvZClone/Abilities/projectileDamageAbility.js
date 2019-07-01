var eatPlant = {
    extendsFrom: "Assets\\Scripts\\PvZClone\\Abilities\\ability.js",
    createInstance: function() {
        var inst = {
            name: 'Projectile Damage Ability',
            params: {
                actorTag: {
                    name: 'Actor Tag',
                    type: 'fileObject',
                    value: undefined
                },
                componentScript: {
                    name: 'Component Script',
                    type: 'fileObject',
                    value: undefined
                },
                enemyColliderTag: {
                    name: 'Eat Tag',
                    type: 'fileObject',
                    value: undefined
                },
                damage: {
                    name: 'Damage per Frame',
                    type: 'number',
                    value: 1
                },
            },
            interface: {
                enemyCollider: function(inst, playerInst) {
                    var actor = playerInst.context[inst.params.actorTag.value];
                    actor = game.api.getComponent(actor, game.dev.actor);
                    var componentScript = inst.params.componentScript.value;
                    componentScript = game.scripts[componentScript];
                    var component = game.api.getComponent(actor.gameObject, componentScript);
                    
                    var front = component.params.front.gameObjectRef;
                    front = game.api.getComponent(front, game.dev.transform);
                    
                    var back = component.params.back.gameObjectRef;
                    back = game.api.getComponent(back, game.dev.transform);

                    var cols = game.api.getAllComponents(game.dev.collider);
                    for (var i = 0; i < cols.length; ++i) {
                        var taggedComponent = game.api.getComponent(cols[i].gameObject, game.dev.taggedComponent);
                        if (!taggedComponent || taggedComponent.params.tag.value !== inst.params.enemyColliderTag.value) {
                            continue;
                        }

                        var proxy = game.api.getComponent(cols[i].gameObject, game.dev.proxy);
                        if (proxy) {
                            var act = proxy.params.gameObject.gameObjectRef;
                            act = game.api.getComponent(act, game.dev.actor);
                            if (act && act.params.lane.value !== actor.params.lane.value) {
                                continue;
                            }
                        }

                        if (cols[i].interface.isInside(cols[i], front.interface.getWorldPosition({x: 0, y: 0}))) {
                            return cols[i];
                        }
                        if (cols[i].interface.isInside(cols[i], back.interface.getWorldPosition({x: 0, y: 0}))) {
                            return cols[i];
                        }
                    }
                },
                isEnabledImpl: function(inst, playerInst, record) {
                    var col = inst.interface.enemyCollider(inst, playerInst);
                    record.collider = col;
                    return !!col;
                },
                coroutine: function* (inst, playerInst) {
                    var col = inst.interface.checks.recentChecks[playerInst.gameObject.id].collider;
                    
                    var proxy = game.api.getComponent(col.gameObject, game.dev.proxy);
                    var actor = game.api.getComponent(proxy.params.gameObject.gameObjectRef, game.dev.actor);
                    actor.params.health.value -= inst.params.damage.value;

                    actor = playerInst.context[inst.params.actorTag.value];
                    actor = game.api.getComponent(actor, game.dev.actor);
                    actor.params.health.value = 0;
                }
            },
        };
        return inst;
    }
};

module.exports = eatPlant;

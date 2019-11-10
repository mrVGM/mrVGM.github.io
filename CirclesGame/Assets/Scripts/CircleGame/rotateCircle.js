var rotateCircle = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Rotate Circle',
            params: {
				pointedTargetsTag: {
					name: 'Pointed Targets Tag',
					type: 'fileObject',
					value: undefined
				},
				handleTags: {
					name: 'Handle Tags',
					type: 'array',
					value: [],
					defaultElement: {
						type: 'fileObject',
						value: undefined
					}
				},
				currentCircleTag: {
					name: 'Current Circle Tag',
					type: 'fileObject',
					value: undefined
				},
				adjustTime: {
					name: 'Adjust Time',
					type: 'number',
					value: 300,
				},
				cantRotate: {
					name: 'Cant Rotate',
					type: 'array',
					value: [],
					defaultElement: {
						type: 'fileObject',
						value: undefined
					}
                },
                moveMadeTag: {
                    name: 'Move Made Tag',
                    type: 'fileObject',
                    value: undefined
                }
			},
            interface: {
				getCheckers: function(inst) {
					let levelData = game.dev.levelData.instance;
					let checkersContainer = levelData.params.checkersContainer.gameObjectRef;

					let res = [];
					for (let i = 0; i < checkersContainer.children.length; ++i) {
						let cur = checkersContainer.children[i];
						cur = game.api.getComponent(cur, game.dev.checker);
						res.push(cur);
					}
					return res;
				},
				getCorrespondingHandle: function(inst, checker) {
					let levelData = game.dev.levelData.instance;
					let level = checker.interface.getLevel(checker);

                    let handleLevels = levelData.interface.getActionsData(levelData);
                    handleLevels = handleLevels.params.handleLevels;

					for (let i = 0; i < handleLevels.value.length; ++i) {
						let lev = handleLevels.value[i].value.level.value;
						if (lev !== level) {
							continue;
						}
						let handle = handleLevels.value[i].value.handleTag.value;
						return handle;
					}
				},
                coroutine: function* (inst) {
					function isHandle(pointedTarget) {
						let type = pointedTarget.params.type.value;
						for (let i = 0; i < inst.params.handleTags.value.length; ++i) {
							if (type === inst.params.handleTags.value[i].value) {
								return true;
							}
						}
						return false;
					}

					function canRotate(pointerTarget) {
						for (let i = 0; i < inst.params.cantRotate.value.length; ++i) {
							let cur = inst.params.cantRotate.value[i].value;
							if (cur === pointerTarget.params.type.value) {
								return false;
							}
						}
						return true;
					}

					while (!game.input.mouseDown) {
						yield;
					}

					let handle = undefined;

					let pointed = inst.events[inst.params.pointedTargetsTag.value];
					if (!pointed) {
						return;
					}

					let pointerTarget = undefined; 

					for (let i = 0; i < pointed.length; ++i) {
						if (isHandle(pointed[i])) {
							pointerTarget = pointed[i];
							handle = game.api.getComponent(pointed[i].gameObject, game.dev.circleHandle);
							break;
						}
					}

					if (!handle) {
						return;
					}

					if (!canRotate(pointerTarget)) {
						return;
					}
					
					let circleRoot = handle.params.circle.gameObjectRef;
					circleRoot = game.api.getComponent(circleRoot, game.dev.transform);

                    let handleTag = pointerTarget.params.type.value;
                    inst.context[inst.params.currentCircleTag.value] = { circle: circleRoot, tag: handleTag };

					let checkers = inst.interface.getCheckers(inst);
					let affected = [];
					for (let i = 0; i < checkers.length; ++i) {
						if (inst.interface.getCorrespondingHandle(inst, checkers[i]) === pointerTarget.params.type.value) {
							let tr = game.api.getComponent(checkers[i].gameObject, game.dev.transform);
							affected.push({ transform: tr, initialRotation: tr.params.rotation.value });
						}
					}

					inst.context[inst.params.currentCircleTag.value].affectedCheckers = affected;
				},
				finish: function* (inst) {
					let currentCircle = inst.context[inst.params.currentCircleTag.value];
					if (!currentCircle) {
						return;
					}
                    
					let circleRoot = currentCircle.circle;
					let affected = currentCircle.affectedCheckers;
					let circleRootPosition = circleRoot.interface.getWorldPosition({ x: 0, y: 0 });

					let m = game.api.math;

					function getCurrentDirection() {
						let res = m.vector.subtract(game.input.mousePos, circleRootPosition);
						res = m.vector.multiply(1 / m.vector.magnitude(res), res);
						return res;
					}

					let initialVector = getCurrentDirection();

					while (game.input.mouseDown) {
						let curDir = getCurrentDirection();
						let sin = m.vector.area(initialVector, curDir);
						let cos = m.vector.dot(initialVector, curDir);
						let angle = Math.asin(sin);

						if (cos < 0) {
							angle = Math.PI - angle;
						}
						if (angle < 0) {
							angle += 2 * Math.PI;
						}
						angle = 180 * angle / Math.PI;
						circleRoot.params.rotation.value = angle;

						for (let i = 0; i < affected.length; ++i) {
							affected[i].transform.params.rotation.value = affected[i].initialRotation + angle;
						}
						
						yield;
					}

					let angle = circleRoot.params.rotation.value;
					let snappedAngle = (Math.round(angle / 90) % 4) * 90;
                    if (snappedAngle === circleRoot.params.rotation.value) {
                        delete inst.context[inst.params.currentCircleTag.value];
						return;
					}

					let tmp = angle - 360;
					if (Math.abs(angle - snappedAngle) > Math.abs(tmp - snappedAngle)) {
						angle = tmp;
					}

					let initialTime = (new Date()).getTime();
					let curTime = initialTime;
					while (curTime - initialTime < inst.params.adjustTime.value) {
						let progress = (curTime - initialTime) / inst.params.adjustTime.value;
						let curAngle = (1 - progress) * angle + progress * snappedAngle;
						circleRoot.params.rotation.value = curAngle;

						for (let i = 0; i < affected.length; ++i) {
							affected[i].transform.params.rotation.value = affected[i].initialRotation + curAngle;
						}

						yield;
						curTime = (new Date()).getTime();
					}

					if (snappedAngle === 360) {
						snappedAngle = 0;
                    }

                    function dispatchMovesMade(moves) {
                        inst.interface.dispatchEvent(inst, inst.params.moveMadeTag.value, moves);
                    }

                    let levelData = game.dev.levelData.instance;
                    let actionsData = levelData.interface.getActionsData(levelData);
                    let actions = actionsData.interface.getActionsByCircle(actionsData, currentCircle.tag);
                    if (snappedAngle === 90) {
                        dispatchMovesMade([actions.left]);
                    }
                    if (snappedAngle === 180) {
                        dispatchMovesMade([actions.right, actions.right]);
                    }
                    if (snappedAngle === 270) {
                        dispatchMovesMade([actions.right]);
                    }

					circleRoot.params.rotation.value = snappedAngle;
					for (let i = 0; i < affected.length; ++i) {
						let checkerAngle = affected[i].initialRotation + snappedAngle;
						checkerAngle = ((checkerAngle / 90) % 4) * 90;
						affected[i].transform.params.rotation.value = checkerAngle;
                    }
                    delete inst.context[inst.params.currentCircleTag.value];
				}
            }
        };
        return inst;
    }
};

module.exports = rotateCircle;
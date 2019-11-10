var automaticRotate = {
	extendsFrom: 'Assets\\Scripts\\ProgramsAPI\\program.js',
    createInstance: function () {
        var inst = {
            name: 'Automatic Rotate',
            params: {
				circleTag: {
					name: 'Circle Tag',
					type: 'fileObject',
					value: undefined,
				},
				angle: {
					name: 'Angle',
					type: 'number',
					value: 90,
				},
				moveDurationTag: {
					name: 'Move Duration',
					type: 'fileObject',
					value: undefined,
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
				getHandles: function(inst) {
					function findHandles(go) {
						let res = [];
						let handle = game.api.getComponent(go, game.dev.circleHandle);
						if (handle) {
							res.push(handle);
						}
						for (let i = 0; i < go.children.length; ++i) {
							let tmp = findHandles(go.children[i]);
							res = res.concat(tmp);
						}
						return res;
					}

					let root = game.dev.levelData.instance.params.circleGameRoot.gameObjectRef;
					let handles = findHandles(root);
					return handles;
				},
				finish: function* (inst, player) {
					let checkers = inst.interface.getCheckers(inst);
					let affected = [];
					for (let i = 0; i < checkers.length; ++i) {
						if (inst.interface.getCorrespondingHandle(inst, checkers[i]) === inst.params.circleTag.value) {
							let tr = game.api.getComponent(checkers[i].gameObject, game.dev.transform);
							affected.push({ transform: tr, initialRotation: tr.params.rotation.value });
						}
					}

					let handleTag = inst.params.circleTag.value;
					let handles = inst.interface.getHandles(inst);
					let chosenHandle = undefined;
					for (let i = 0; i < handles.length; ++i) {
						let cur = handles[i];
						let pointerTarget = game.api.getComponent(cur.gameObject, game.dev.pointerTarget);
						if (pointerTarget.params.type.value === handleTag) {
							chosenHandle = cur;
							break;
						}
					}

					let currentCircle = chosenHandle.gameObject.parent;
					let circleRoot =  game.api.getComponent(currentCircle, game.dev.transform);

					let initialTime = (new Date()).getTime();
					let curTime = initialTime;

					let snappedAngle = inst.params.angle.value;

					let moveTime = player.context[inst.params.moveDurationTag.value];
					while (curTime - initialTime < moveTime) {
						let progress = (curTime - initialTime) / moveTime;
						let curAngle = progress * snappedAngle;
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

					circleRoot.params.rotation.value = 0;
					for (let i = 0; i < affected.length; ++i) {
						let checkerAngle = affected[i].initialRotation + snappedAngle;

						let rotPos = ((checkerAngle / 90) % 4);
						if (rotPos < 0) {
							rotPos = 4 + rotPos;
						}

						checkerAngle = rotPos * 90;

						affected[i].transform.params.rotation.value = checkerAngle;
					}
				}
            }
        };
        return inst;
    }
};

module.exports = automaticRotate;
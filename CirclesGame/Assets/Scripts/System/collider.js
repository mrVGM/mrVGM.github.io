var collider = {
    onLoad: function () {
        game.dev.collider = collider;
    },
    createInstance: function () {
        var inst = {
            name: 'Collider',
            params: {
				points: {
					name: 'Points',
					type: 'array',
					value: [],
					defaultElement: {
						type: 'gameObject',
						value: undefined
					}
				}
            },
            interface: {
                verteces: function (inst) {
					let res = [];
					for (let i = 0; i < inst.params.points.value.length; ++i) {
						let cur = inst.params.points.value[i].gameObjectRef;
						cur = game.api.getComponent(cur, game.dev.transform);
						let pos = cur.interface.getWorldPosition({x: 0, y: 0});
						res.push(pos);
					}
                    return res;
                },
                isInside: function (inst, p) {
                    var m = game.api.math;
                    var verts = inst.interface.verteces(inst);

					function isOnSegment(p, p1, p2) {
						let v1 = m.vector.subtract(p1, p);
						let v2 = m.vector.subtract(p2, p);
						let area = m.vector.area(v1, v2);
						if (area !== 0) {
							return false;
						}
						
						return m.vector.dot(v1, v2) <= 0;
					}

					function intersectsWithRay(p1, p2, rayOrigin, ray) {
						let dir1 = m.vector.subtract(p1, rayOrigin);
						let dir2 = m.vector.subtract(p2, rayOrigin);

						let a1 = m.vector.area(ray, dir1);
						let a2 = m.vector.area(dir2, dir1);
						let a3 = m.vector.area(dir2, ray);
						let res = a1 * a2 > 0 && a1 * a3 > 0;
						return res;
					}

					let level = p.y;

					let intersections = 0;
					let ray = { x: -1, y: 0 };

					for (let i = 0; i < verts.length; ++i) {
						let low = verts[(i + 1) % verts.length];
						let high = verts[i];
						if (low.y > high.y) {
							let tmp = low;
							low = high;
							high = tmp;
						}

						if (isOnSegment(p, low, high)) {
							return true;
						}

						if (low.y === high.y) {
							continue;
						}

						if (low.y === p.y && low.x < p.x) {
							++intersections;
							continue;
						}

						if (!intersectsWithRay(low, high, p, ray)) {
							continue;
						}

						++intersections;
					}

					let res = intersections % 2 === 1; 
					return res;
                },
            },
        };
        return inst;
    },
};

module.exports = collider;
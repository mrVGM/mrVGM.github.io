let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let mousepos = {x: -1000, y: -1000};
let width = canvas.width;
let height = canvas.height;
let resolution = settings.resolution;

let effectors = [];

let mouseDampedPos = createDampedVector({x: 0, y: 0}, settings.mouseEffectorDamp);

canvas.addEventListener("mousemove", function(e) {
    mousepos = {x: e.offsetX, y: e.offsetY};
});

canvas.addEventListener("mouseleave", function(e) {
    mousepos = undefined;
});

canvas.addEventListener("mouseenter", function(e) {
    mousepos = {x: e.offsetX, y: e.offsetY};
    mouseDampedPos.cur = {x: e.offsetX, y: e.offsetY};
    mouseDampedPos.target = {x: e.offsetX, y: e.offsetY};
});

function createDampedValue(val, dampFactor) {
    let res = {
        target: val,
        cur: val,
        dampFactor: dampFactor,
        update: update,
    };

    let lastUpdate = Date.now();
    function update() {
        let now = Date.now();
        let dt = now - lastUpdate;
        lastUpdate = now;

        if (Math.abs(res.cur - res.target) < 0.0001) {
            return;
        }

        let t = Math.min(dt * res.dampFactor / 1000, 1);
        res.cur = t * res.target + (1 - t) * res.cur;
    }
    return res;
}

function createDampedVector(val, dampFactor) {
    let res = {
        target: val,
        cur: val,
        dampFactor: dampFactor,
        update: update,
    };

    let lastUpdate = Date.now();
    function update() {
        let now = Date.now();
        let dt = now - lastUpdate;
        lastUpdate = now;

        let offset = addVectors(res.target, negateVector(res.cur));
        let distSquared = dot(offset, offset);
        if (distSquared < 0.0001) {
            return;
        }

        let t = Math.min(dt * res.dampFactor / 1000, 1);
        res.cur = addVectors(multiplyVectors(t, res.target), multiplyVectors(1 - t, res.cur));
    }
    return res;
}

function addVectors(v1, v2) {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
    };
}

function multiplyVectors(c, v) {
    return {
        x: c * v.x,
        y: c * v.y,
    };
}

function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

function normalize(v) {
    let d = dot(v, v);
    if (d === 0) {
        return {x: 0, y: 0};
    }

    d = Math.sqrt(d);
    return multiplyVectors(1 / d, v);
}

function negateVector(v) {
    return {x: -v.x, y: -v.y};
}

function toIntVector(v) {
    return {x : Math.round(v.x), y: Math.round(v.y)};
}

let baseSample = {
    x: 0,
    y: 0,
    length: settings.sampleLength,
    resolution: settings.sampleResolution,
    points: [],
    init: function() {
        for (let i = 0; i < baseSample.resolution; ++i) {
            let tmp = [];
            for (let j = 0; j < baseSample.resolution; ++j) {
                let vertex = {
                    point: {
                        x: j,
                        y: i,
                    },
                    value: (perlin.get(baseSample.x + baseSample.length * j / baseSample.resolution, baseSample.y + baseSample.length * i / baseSample.resolution) + 1) / 2,
                    getValue: function() {
                        let val = vertex.value;
                        for (let i = 0; i < effectors.length; ++i) {
                            let cur = effectors[i];

                            let offset = addVectors(cur.getCenter(), negateVector(vertex.point));
                            let dist = dot(offset, offset);
                            let area = cur.radius * cur.radius;
                            if (dist > area) {
                                continue;
                            }
                            val += (1 - dist / area) * cur.getEffectValue();
                        }
                        return val;
                    }
                };
                
                tmp.push(vertex);
            }
            baseSample.points.push(tmp);
        }
    }
};

function getFrame(w, h) {
    let horizontalOffset = baseSample.resolution - w;
    let verticalOffset = baseSample.resolution - h;

    let frame = {
        point: {
            x: Math.floor(horizontalOffset / 2),
            y: Math.floor(verticalOffset / 2)
        },
        getVertex: function(x, y) {
            x = frame.point.x + x;
            y = frame.point.y + y;
            return baseSample.points[y][x];
        },
        getNormilizedCoordinates: function(p) {
            return {x: p.x / w, y: p.y / h};
        },
        getLocalCoordinates: function(p) {
            return {x: w * p.x, y: h * p.y};
        }
    };

    let rows = settings.effectors.rows;
    let columns = settings.effectors.columns;
    let stepH = w / (columns + 1);
    let stepV = h / (rows + 1);
    for (let i = 1; i <= rows; ++i) {
        for (let j = 1; j <= columns; ++j) {
            let randomPoint = {
                x: j * stepH,
                y: i * stepV,
            };

            let effector = {
                localPoint: randomPoint,
                effectValue: createDampedValue(0, settings.effectorsDamp),
                getEffectValue: function() {
                    return effector.effectValue.cur;
                },
                getCenter: function() {
                    return addVectors(frame.point, effector.localPoint);
                },
                baseValue: 0,
                addedValue: 0,
                radius: settings.effectorsRadius
            };
            effectors.push(effector);
        }
    }
    
    return frame;
}


if (width <= height) {
    width = resolution * width / height;
    width = Math.ceil(width);
    height = resolution;
}
else {
    height = resolution * height / width;
    height = Math.ceil(height);
    width = resolution;
}

baseSample.init();
let frame = getFrame(width, height);

let mouseEffector = {
    localPoint: {x: 0, y: 0},
    getCenter: function() {
        return addVectors(frame.point, mouseEffector.localPoint);
    },
    effectValue : 0,
    getEffectValue: function() {
        return mouseEffector.effectValue;
    },
    radius: settings.mouseEffectorRadius
};

let animatableEffectors = [];
for (let i = 0; i < effectors.length; ++i) {
    animatableEffectors.push(effectors[i]);
}

effectors.push(mouseEffector);

function createSquareSample(x, y, testFunc) {
    let p1Local = {x: x,     y: y};
    let p2Local = {x: x + 1, y: y};
    let p3Local = {x: x + 1, y: y + 1};
    let p4Local = {x: x,     y: y + 1};

    let p1 = frame.getVertex(p1Local.x, p1Local.y);
    let p2 = frame.getVertex(p2Local.x, p2Local.y);
    let p3 = frame.getVertex(p3Local.x, p3Local.y);
    let p4 = frame.getVertex(p4Local.x, p4Local.y);

    function toRealCoordinates(p) {
        let norm = frame.getNormilizedCoordinates(p);
        return {x: canvas.width * norm.x, y: canvas.height * norm.y};
    }

    let res = {
        points: [
            {point: toRealCoordinates(p1Local), testValue: testFunc(p1), value: p1.getValue()},
            {point: toRealCoordinates(p2Local), testValue: testFunc(p2), value: p2.getValue()},
            {point: toRealCoordinates(p3Local), testValue: testFunc(p3), value: p3.getValue()},
            {point: toRealCoordinates(p4Local), testValue: testFunc(p4), value: p4.getValue()},
        ],
        rotate: function() {
            res.points = [res.points[1], res.points[2], res.points[3], res.points[0]];
        }
    };
    return res;
}

let template1 = {
    points: [
        {testValue: true},
        {testValue: false},
        {testValue: false},
        {testValue: false},
    ],
    handler: function(pts, middleFunc) {
        let startPoint = middleFunc(pts[0], pts[3]);
        let endPoint = middleFunc(pts[0], pts[1]);
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
    },
};

let template2 = {
    points: [
        {testValue: false},
        {testValue: true},
        {testValue: true},
        {testValue: true},
    ],
    handler: function(pts, middleFunc) {
        let startPoint = middleFunc(pts[0], pts[3]);
        let endPoint = middleFunc(pts[0], pts[1]);
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
    },
};

let template3 = {
    points: [
        {testValue: true},
        {testValue: true},
        {testValue: false},
        {testValue: false},
    ],
    handler: function(pts, middleFunc) {
        let startPoint = middleFunc(pts[0], pts[3]);
        let endPoint = middleFunc(pts[1], pts[2]);
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
    },
};

let template4 = {
    points: [
        {testValue: true},
        {testValue: false},
        {testValue: true},
        {testValue: false},
    ],
    handler: function(pts, middleFunc) {
        let startPoint = middleFunc(pts[0], pts[1]);
        let endPoint = middleFunc(pts[1], pts[2]);
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();

        startPoint = middleFunc(pts[0], pts[3]);
        endPoint = middleFunc(pts[2], pts[3]);
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
    },
};

let templates = [template1, template2, template3, template4];

function matchTemplate(t1, t2) {
    for (let i = 0; i < 4; ++i) {
        if (t1.points[i].testValue != t2.points[i].testValue) {
            return false;
        }
    }
    return true;
}

function handleSample(t, middleFunc)  {
    for (let i = 0; i < 4; ++i) {
        t.rotate();
        for (let j = 0; j < templates.length; ++j) {
            let cur = templates[j];
            if (matchTemplate(t, cur)) {
                cur.handler(t.points, middleFunc);
                return;
            }
        }
    }
}

function marchingSquares(testFunc, middleFunc) {
    for (let i = 0; i < height-1; ++i) {
        for (let j = 0; j < width-1; ++j) {
            let sample = createSquareSample(j, i, testFunc);
            handleSample(sample, middleFunc);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < settings.isolinesThresholds.length; ++i) {
        let cur = settings.isolinesThresholds[i];
        marchingSquares(function(p) {
            return p.getValue() >= cur;
        },
        function(p1, p2) {
            let p1Val = p1.value;
            let p2Val = p2.value;
            let coef = (cur - Math.min(p1Val, p2Val)) / Math.abs(p1Val - p2Val);
            if (p1Val > p2Val) {
                coef = 1 - coef;
            }
            return addVectors(multiplyVectors((1 - coef), p1.point), multiplyVectors(coef, p2.point));
        });
    }
}

let effectorsAnimation = animateEffectors();
function animate() {
    effectorsAnimation();
    animateMouseEffector();
    for (let i = 0; i < animatableEffectors.length; ++i) {
        animatableEffectors[i].effectValue.update();
    }
    draw();

    setTimeout(animate);
}

function animateEffectors() {
    let lastUpdate = Date.now();
    function animate() {
        let now = Date.now();
        if (now - lastUpdate < settings.wiggleCycle * 1000) {
            return;
        }
        lastUpdate = now;

        for (let i = 0; i < animatableEffectors.length; ++i) {
            animatableEffectors[i].baseValue = 2 * (Math.random() - 0.5) * settings.effectorsWiggle;
        }
    }
    return function() {
        animate();
        for (let i = 0; i < animatableEffectors.length; ++i) {
            let cur = animatableEffectors[i];
            cur.effectValue.target = cur.baseValue + cur.addedValue;
        }
    }
}

function animateMouseEffector() {
    if (mousepos) {
        mouseDampedPos.target = mousepos;
    }
    mouseDampedPos.update();

    let normalizedCurPos = {x: mouseDampedPos.cur.x / canvas.width, y: mouseDampedPos.cur.y / canvas.height};
    let normalizedTargetPos = {x: mouseDampedPos.target.x / canvas.width, y: mouseDampedPos.target.y / canvas.height};

    let localCurPos = frame.getLocalCoordinates(normalizedCurPos);
    let localTargetPos = frame.getLocalCoordinates(normalizedTargetPos);

    let offset = addVectors(localTargetPos, negateVector(localCurPos));
    let distSquared = dot(offset, offset);

    let c = distSquared / settings.mouseSquaredDistToReachFullValue;
    c = Math.min(c, 1);

    mouseEffector.localPoint = localCurPos;
    mouseEffector.effectValue = settings.mouseEffectValue * c;
}

ctx.lineWidth = 3;

animate();

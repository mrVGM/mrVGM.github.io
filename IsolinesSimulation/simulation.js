let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let mousepos = {x: -1000, y: -1000};
let width = canvas.width;
let height = canvas.height;
let resolution = 490;

let effectors = [];

canvas.addEventListener("mousemove", function(e) {
    mousepos = {x: e.offsetX, y: e.offsetY};
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

function middle(v1, v2) {
    let tmp = addVectors(v1, v2);
    tmp = multiplyVectors(0.5, tmp);
    return tmp;
}

let baseSample = {
    x: 0,
    y: 0,
    length: 8,
    resolution: 500,
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

                            let offset = addVectors(cur.point, negateVector(vertex.point));
                            let dist = dot(offset, offset);
                            let area = cur.radius * cur.radius;
                            if (dist > area) {
                                continue;
                            }
                            val += (1 - dist / area) * cur.effectValue.cur;
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

    let stepH = w / 7;
    let stepV = h / 5;
    for (let i = 1; i <= 4; ++i) {
        for (let j = 1; j <= 6; ++j) {
            let randomPoint = {
                x: j * stepH,
                y: i * stepV,
            };

            effectors.push({
                localPoint: randomPoint,
                point: addVectors(frame.point, randomPoint),
                effectValue: createDampedValue(0.1, 0.15),
                baseValue: 0,
                addedValue: 0,
                radius: 35
            });
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
            {point: toRealCoordinates(p1Local), testValue: testFunc(p1)},
            {point: toRealCoordinates(p2Local), testValue: testFunc(p2)},
            {point: toRealCoordinates(p3Local), testValue: testFunc(p3)},
            {point: toRealCoordinates(p4Local), testValue: testFunc(p4)},
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
    handler: function(pts) {
        let startPoint = middle(pts[0].point, pts[3].point);
        let endPoint = middle(pts[0].point, pts[1].point);
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
    handler: function(pts) {
        let startPoint = middle(pts[0].point, pts[3].point);
        let endPoint = middle(pts[0].point, pts[1].point);
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
    handler: function(pts) {
        let startPoint = middle(pts[0].point, pts[3].point);
        let endPoint = middle(pts[1].point, pts[2].point);
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
    handler: function(pts) {
        let startPoint = middle(pts[0].point, pts[1].point);
        let endPoint = middle(pts[1].point, pts[2].point);
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();

        startPoint = middle(pts[0].point, pts[3].point);
        endPoint = middle(pts[2].point, pts[3].point);
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

function handleSample(t)  {
    for (let i = 0; i < 4; ++i) {
        t.rotate();
        for (let j = 0; j < templates.length; ++j) {
            let cur = templates[j];
            if (matchTemplate(t, cur)) {
                cur.handler(t.points);
                return;
            }
        }
    }
}

function marchingSquares(testFunc) {
    for (let i = 0; i < height-1; ++i) {
        for (let j = 0; j < width-1; ++j) {
            let sample = createSquareSample(j, i, testFunc);
            handleSample(sample);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    marchingSquares(function(p) {
        return p.getValue() > 0.4;
    });

    marchingSquares(function(p) {
        return p.getValue() > 0.5;
    });

    marchingSquares(function(p) {
        return p.getValue() > 0.6;
    });
}

let effectorsAnimation = animateEffectors();
function animate() {
    effectorsAnimation();
    for (let i = 0; i < effectors.length; ++i) {
        effectors[i].effectValue.update();
    }
    draw();

    setTimeout(animate);
}

function animateEffectors() {
    let lastUpdate = Date.now();
    function animate() {
        let mouselocalPos = {x: mousepos.x / canvas.width, y: mousepos.y / canvas.height};
        mouselocalPos = frame.getLocalCoordinates(mouselocalPos);
        mouseEffectValue = 1;

        let closestValue = 100000;
        let effectorDistances = [];
        for (let i = 0; i < effectors.length; ++i) {
            let cur = effectors[i];
            cur.addedValue = 0;
            let offset = addVectors(mouselocalPos, negateVector(cur.localPoint));
            let dist = dot(offset, offset);
            if (dist > 1300) {
                continue;
            }
            if (dist < closestValue) {
                closestValue = dist;
            }

            effectorDistances.push({effector: cur, dist: dist});
        }

        
        if (closestValue > 1300) {
            mouseEffectValue = 0;
        }
        mouseEffectValue *= 1 - closestValue / 1300;
        

        let distSum = 0;
        for (let i = 0; i < effectorDistances.length; ++i) {
            distSum += effectorDistances[i].dist;
        }

        if (distSum > 0) {
            for (let i = 0; i < effectorDistances.length; ++i) {
                let cur = effectorDistances[i];
                cur.effector.addedValue = Math.max(mouseEffectValue * cur.dist / distSum, 0.1);
            }
        }

        let now = Date.now();
        if (now - lastUpdate < 1000) {
            return;
        }
        lastUpdate = now;

        for (let i = 0; i < effectors.length; ++i) {
            effectors[i].baseValue = Math.random() * 0.2;
        }
    }
    return function() {
        animate();
        for (let i = 0; i < effectors.length; ++i) {
            let cur = effectors[i];
            cur.effectValue.target = cur.baseValue + cur.addedValue;
        }
    }
}
animate();

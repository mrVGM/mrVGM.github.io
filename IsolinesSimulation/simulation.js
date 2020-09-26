console.log("Hello");

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let w = canvas.width;
let h = canvas.height;


let frame = {
    x: 0,
    y: 0,
    w: 6,
    h: 4,
};

function getIntensity(x, y) {
    let intensity = perlin.get(frame.x + frame.w * x / w, frame.y + frame.h * y / h);
    return intensity;
}

function createSquareSample(x, y, testFunc) {
    let p1 = {x: x,     y: y};
    let p2 = {x: x + 1, y: y};
    let p3 = {x: x + 1, y: y + 1};
    let p4 = {x: x,     y: y + 1};

    let res = {
        points: [
            {point: p1, testValue: testFunc(p1)},
            {point: p2, testValue: testFunc(p2)},
            {point: p3, testValue: testFunc(p3)},
            {point: p4, testValue: testFunc(p4)},
        ],
        rotate: function() {
            res.points = [res.points[1], res.points[2], res.points[3], res.points[0]];
        }
    };
    return res;
}

function middle(p1, p2) {
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2};
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
    for (let i = 0; i < h-1; ++i) {
        for (let j = 0; j < w-1; ++j) {
            let sample = createSquareSample(j, i, testFunc);
            handleSample(sample);
        }
    }
}

function draw() {
    frame.x += 0.2;
    frame.y += 0.1;

    ctx.clearRect(0, 0, w, h);
    marchingSquares(function(p) {
        return getIntensity(p.x, p.y) > 0;
    });

    marchingSquares(function(p) {
        return getIntensity(p.x, p.y) > 0.2;
    });

    marchingSquares(function(p) {
        return getIntensity(p.x, p.y) > 0.5;
    });

    setTimeout(draw, 100);
}

draw();
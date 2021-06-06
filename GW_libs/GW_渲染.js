var 已逝帧数 = 0
var 宽度 = window.innerWidth;
var 高度 = window.innerHeight;
var mouseOverCanvas = false;
var mouseOverObj = false;
var mouseOverObjer = {};

var 预设配色 = ['#cff09e', '#00dffc', '#ffc952', '#f6ea8c', '#F0E5DE', '#D499B9']

var 舞台 = new Konva.Stage({
    x: 宽度 / 2,
    y: 高度 / 2,
    container: 'canvaser',
    width: 宽度,
    height: 高度,
    draggable: true,
});
舞台.on('mouseover', function () {
    mouseOverCanvas = true;
});
舞台.on('mouseout', function () {
    mouseOverCanvas = false;
});


var 图层_界面 = new Konva.Layer();
var posText = new Konva.Text({
    x: 10,
    y: 15,
    fontFamily: 'Calibri',
    fontSize: 24,
    text: '',
    fill: 'gray',
});
var frameText = new Konva.Text({
    //这里控制xy无用
    x: 0,
    y: 0,
    fontFamily: 'Calibri',
    fontSize: 24,
    text: '',
    fill: 'gray',
});
var focusText = new Konva.Text({
    x: 10,
    y: 45,
    fontFamily: 'Calibri',
    fontSize: 22,
    text: '',
    fill: 'green',
});
var pointerArrow = new Konva.Arrow({
    x: 0,
    y: 0,
    points: [0, 0, 0, 0],
    pointerLength: 8,
    pointerWidth: 6,
    fill: 'black',
    stroke: 'blue',
    strokeWidth: 2,
    opacity: 0.3,

});
图层_界面.add(posText);
图层_界面.add(frameText);
图层_界面.add(focusText);
图层_界面.add(pointerArrow);



var 图层_场 = new Konva.Layer();
var 图层_物体 = new Konva.Layer();
舞台.add(图层_界面);
舞台.add(图层_场);
舞台.add(图层_物体);




/**------------------------------------------- */

function 求鼠标坐标() {
    //取鼠标坐标（向量2），若鼠标不在，则返回零向量
    if (mouseOverCanvas == true) {
        let absPos = 舞台.getAbsolutePosition(),
            rltPos = 舞台.getPointerPosition();
        let x = rltPos.x - absPos.x;
        let y = rltPos.y - absPos.y;
        return new 向量2(x, y);
    } else {
        return _零向量2;
    }
}

function 显示位矢() {
    let temp = 求鼠标坐标().四舍五入();
    posText.text(`x: ${temp.x} , y: ${temp.y}`);
    pointerArrow.points([0, 0, temp.x, temp.y]);

}


var guiAnim = new Konva.Animation(function () {
    if (mouseOverCanvas == false) {
        return false;
    }
    显示位矢();
    //显示鼠标悬停物体信息
    if (mouseOverObj) {
        let temp = fixInfo(mouseOverObjer);
        focusText.text(
            `圆[id:${temp[5]}] : pos=(${temp[0]} , ${temp[1]})  vel=(${temp[2]} , ${temp[3]})`
        );
    }
    //显示基本坐标信息
    absPos = 舞台.getAbsolutePosition();
    posText.x(15 - absPos.x);
    posText.y(20 - absPos.y);
    frameText.x(宽度 / 1.5 - absPos.x);
    frameText.y(20 - absPos.y);
    focusText.x(10 - absPos.x);
    focusText.y(60 - absPos.y);

    //显示已逝帧数
    frameText.text(`t = ${已逝帧数}`);
}, 图层_场);

var mainAnim = new Konva.Animation(function () {
    if (typeof 万物 == 'undefined') {
        console.log('归谬者：万物为空，行空白帧。');
        return false;
    }
    下一帧();
}, 图层_场);

guiAnim.start();
mainAnim.start();
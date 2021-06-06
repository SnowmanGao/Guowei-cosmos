var 宽度 = window.innerWidth;
var 高度 = window.innerHeight;
var mouseOver = false;

var 预设配色 = ['#cff09e', '#00dffc', '#ffc952', '#f6ea8c', '#F0E5DE', '#D499B9']

var 舞台 = new Konva.Stage({
    container: 'canvaser',
    width: 宽度,
    height: 高度
});
舞台.on('mouseover', function () {
    mouseOver = true;
});
舞台.on('mouseout', function () {
    mouseOver = false;
});

var 图层_场 = new Konva.Layer();
舞台.add(图层_场);

var 图层_物体 = new Konva.Layer();
舞台.add(图层_物体);

var 图层_界面 = new Konva.Layer();
var posText = new Konva.Text({
    x: 10,
    y: 10,
    fontFamily: 'Calibri',
    fontSize: 24,
    text: '',
    fill: 'black',
  });
图层_界面.add(posText);

舞台.add(图层_界面);




/**------------------------------------------- */

function 显示鼠标坐标() {
    if (mouseOver==true) {   
        var mousePos = 舞台.getPointerPosition();
        var x = mousePos.x;
        var y = mousePos.y;
        posText.text('x: ' + x + ' , y: ' + y);
    }
    else{
        posText.text('x: ? , y: ?');
    }
}


var guiAnim = new Konva.Animation(function () {
    显示鼠标坐标();
}, 图层_场);

var mainAnim = new Konva.Animation(function () {
    下一帧();
    pastFrames++;
}, 图层_场);

guiAnim.start();
mainAnim.start();
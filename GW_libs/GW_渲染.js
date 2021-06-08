var 已逝帧数 = 0
var 宽度 = window.innerWidth;
var 高度 = window.innerHeight;
//鼠标是否在画布
var isMsOverCanvas = false;
//鼠标所在物体类型（若不在则为undefined）
var msOverType = undefined;
//鼠标下的物体的对应物理对象
var msOverObj = {};
var 选中图形列 = [];
var 预设配色 = ['#cff09e', '#00dffc', '#ffc952', '#f6ea8c', '#F0E5DE', '#D499B9']

//------舞台------
var 舞台 = new Konva.Stage({
    x: 宽度 / 2,
    y: 高度 / 2,
    container: 'canvaser',
    width: 宽度,
    height: 高度,
    draggable: true,
});
舞台.on('mouseover', function () {
    isMsOverCanvas = true;
});
舞台.on('mouseout', function () {
    isMsOverCanvas = false;
});
var 画布容器 = 舞台.container();
画布容器.tabIndex = 1;
画布容器.focus();



//------图层------
var 图层_界面 = new Konva.Layer();
var 图层_场 = new Konva.Layer();
var 图层_物体 = new Konva.Layer();


var posText = new Konva.Text({
    x: 10 - 宽度 / 2,
    y: 15 - 高度 / 2,
    fontFamily: 'consolas',
    fontSize: 24,
    text: '',
    fill: 'gray',
});
var frameText = new Konva.Text({
    //这里控制xy仅控制初始状态
    x: 10,
    y: 0,
    fontFamily: 'consolas',
    fontSize: 24,
    text: '',
    fill: 'gray',
});
var focusText = new Konva.Text({
    x: 10,
    y: 45,
    fontFamily: 'consolas',
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
    stroke: 'black',
    strokeWidth: 2,
    opacity: 0.1,

});
var massCenterStar = new Konva.Star({
    x: 0,
    y: 0,
    numPoints: 5,
    innerRadius: 2,
    outerRadius: 4,
    fill: 'red',
})

图层_界面.add(posText);
图层_界面.add(frameText);
图层_界面.add(focusText);
图层_界面.add(pointerArrow);
图层_界面.add(massCenterStar);

舞台.add(图层_界面);
舞台.add(图层_场);
舞台.add(图层_物体);




/**------------------------------------------- */

function 取鼠标坐标() {
    //取鼠标坐标（向量2），若鼠标不在，则返回零向量
    if (isMsOverCanvas == true) {
        let absPos = 舞台.getAbsolutePosition(),
            rltPos = 舞台.getPointerPosition();
        let x = rltPos.x - absPos.x;
        let y = rltPos.y - absPos.y;
        return new 向量2(x, y);
    } else {
        return 取零向量();
    }
}

function 显示鼠标位矢() {
    let temp = 取鼠标坐标().四舍五入();
    posText.text(`x: ${temp.x} , y: ${temp.y}`);
    pointerArrow.points([0, 0, temp.x, temp.y]);

}

function 更新物体位矢箭头() {
    选中图形列.forEach((obj) => {
        obj.attrs.位矢箭头.points(
            [0, 0, obj.attrs.物理对象.位置.x, obj.attrs.物理对象.位置.y]
        )
    })
}

function 更新质心渲染() {
    let tempVec = 计算质心(万物);
    massCenterStar.x(tempVec.x);
    massCenterStar.y(tempVec.y);
}




/*---------------------------动画gui------------------------------- */

/**当鼠标在画布上时执行 */
var guiAnim = new Konva.Animation(function () {
    if (!isMsOverCanvas) {
        显示鼠标位矢();
        return false;
    }

    显示鼠标位矢();
    //显示鼠标悬停物体信息
    switch (msOverType) {
        case 物类枚举.质点:
            focusText.fill('green');
            let temp = fixInfo(msOverObj);
            let force_G = 计算合加速度_万有引力(msOverObj);
            focusText.text(
                `(圆形)质点 [id:${temp[5]}]  
   *    质量m = ${temp[6]}
        位矢r = (${temp[0]}, ${temp[1]})  
        速度v = (${temp[2]}, ${temp[3]})
  -> 万有引力G = (${force_G.x.toFixed(2)}, ${force_G.y.toFixed(2)})
            `
            );
            if (!为运行中) {
                更新物体位矢箭头();
                更新质心渲染();
            }
            break;

        case 物类枚举.电场:
            focusText.fill('#d62a9d');
            focusText.text(
                `(圆形)电场 [id:${msOverObj.id}]  
   *    场强E = (${msOverObj.场强.x}, ${msOverObj.场强.y})  
        位矢r = (${msOverObj.位置.x}, ${msOverObj.位置.y})  
        半径R = ${msOverObj.半径}
            `
            );
            break;
        default:
            break;
    }

    //显示基本坐标信息
    absPos = 舞台.getAbsolutePosition();
    posText.x(15 - absPos.x);
    posText.y(20 - absPos.y);
    frameText.x(宽度 / 1.5 - absPos.x);
    frameText.y(20 - absPos.y);
    focusText.x(10 - absPos.x);
    focusText.y(60 - absPos.y);

}, 图层_场);



/**当模拟运行时执行 */
var mainAnim = new Konva.Animation(function () {

    //防止bug
    if (typeof 万物 == 'undefined') {
        console.log('归谬者：万物为空，行空白帧。');
        return false;
    }

    下一帧();

}, 图层_场);


function 主动画函数() {

    更新物体位矢箭头();
    更新质心渲染();

    //显示已逝帧数
    frameText.text(`t = ${已逝帧数}`);

}
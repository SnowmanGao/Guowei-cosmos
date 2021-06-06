/** @type {HTMLCanvasElement} */


/* File Info 
 * Author:      SnowmanGao
 * CreateTime:  2021/6/5下午1:38:15 
 * LastEditor:  SnowmanGao 
 * ModifyTime:  2021/6/5下午1:40:59 
 * Description: 定义了一切用到的数理工具，包括常用函数、向量、矩阵工具，
 *              还可以完成简单的物理计算。
 */



/**常用角度 */
// const deg180 = pi;
const 二分之π = Math.PI / 2;
// const deg60 = pi/3;
// const deg45 = pi/4;
// const deg30 = pi/6;
// const deg15 = pi/12;



/**定义二维向量 */
function 向量2(x, y) {

    this.x = x || 0;
    this.y = y || 0;
    return this;

}

// Object.defineProperties(向量2.prototype, {}

Object.assign(向量2.prototype, {

    为向量2: true,

    设置xy: function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    },


    复制: function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    },

    加和: function (v, v0) {
        if (v0 !== undefined) {
            console.warn('向量2：加和只能有一个参数！');
            return this;
        }
        this.x += v.x;
        this.y += v.y;

        return this;
    }


})



/**质点对象（请不要使用此函数直接创建质点） */
function 质点(质量 = 1, 位置 = _零向量2, 速度 = _零向量2, 样式 = _默认样式) {

    this.质量 = 质量;
    this.位置 = 位置;
    this.速度 = 速度;
    this.样式 = 样式;

    this.id = nowID;
    nowID++; //nowID处理
    this.渲染对象 = null;

    return this;
}

Object.assign(质点.prototype, {

    是质点: true,

    加入渲染队列: function () {
        let circle = new Konva.Circle({
            x: this.x,
            y: this.y,
            // sides: 0, ??wtf
            radius: 60,
            fill: this.样式.颜色,
            stroke: '#000',
            strokeWidth: 1,
            opacity: 0.5,
            draggable: 'true',
        });
        this.渲染对象 = circle;
        console.log(circle);
        图层_场.add(circle);
    }
})



/**创建质点，允许显示到画布 */
function 创建质点(massP) {
    
    console.log(massP);
    
    if (massP.是质点 !== true) {
        console.error('创建质点：参数错误！');
        return;
    }
    
    massP.加入渲染队列();
    万物.add(massP);
    
}


function 下一帧() {
    万物.forEach(ele => {
        ele.位置.加和(ele.速度);
        ele.渲染对象.x(ele.位置.x);
        ele.渲染对象.y(ele.位置.y);
    });

}
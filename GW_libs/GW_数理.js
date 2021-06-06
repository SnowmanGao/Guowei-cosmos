/** @type {HTMLCanvasElement} */


/* File Info 
 * Author:      SnowmanGao
 * CreateTime:  2021/6/5下午1:38:15 
 * LastEditor:  SnowmanGao 
 * ModifyTime:  2021/6/5下午1:40:59 
 * Description: 定义了一切用到的数理工具，包括常用函数、向量、矩阵工具，
 *              还可以完成简单的物理计算。
 */



/**数学常数 */
const π = Math.PI;
const pi = Math.PI;

/**物理常数 */
// var _G_ = 6.672e-11;
var _G_ = 1
var _g_ = 9.8;


function 到弧度(deg) {
    if (typeof deg !== 'number') {
        console.warn('到弧度：参数错误！只能传入角度（实数）。');
        return;
    }
    return deg * π / 180;
}

function 到角度(rad) {
    if (typeof rad !== 'number') {
        console.warn('到角度：参数错误！只能传入弧度（实数）。');
        return;
    }
    return rad * 180 / π;
}



/*----------------------随机---------------------*/

/**生成随机颜色*/
function 生成随机颜色() {
    var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    var color = "#";
    for (let i = 0; i < 6; i++) {
        let random = parseInt(Math.random() * 16);
        color += arr[random];
    }
    return color;
}

/**返回 ±(dx,dy) 范围内的一个随机向量。
 * 若无参数，则默认为 ±(300,300)；若无dy，则dy自动赋值为dx
 */
function 生成随机向量(dx = 300, dy) {

    let temp = new 向量2();
    if (dy == undefined) {
        dy = dx;
    }
    temp.x = 2 * dx * Math.random() - dx;
    temp.y = 2 * dy * Math.random() - dy;
    return temp;

}


/**生成 (min,max) 范围内的一个随机数
 * 若无参数，则范围默认为 (0,1)；
 */
function 生成随机数(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}


/*-------------------------------------------*/



/**定义二维向量 */
function 向量2(x, y) {

    this.x = x || 0;
    this.y = y || 0;
    return this;

}


Object.assign(向量2.prototype, {

    为向量2: true,

    设置xy: function (x, y) {

        this.x = x;
        this.y = y;
        return this;

    },


    复制自: function (v) {

        this.x = v.x;
        this.y = v.y;
        return this;

    },

    为相等向量: function (v) {

        return ((v.x === this.x) && (v.y === this.y));

    },

    加和: function (v) {

        this.x += v.x;
        this.y += v.y;

        return this;
    },

    减去: function (v) {

        this.x -= v.x;
        this.y -= v.y;

        return this;

    },

    数乘: function (s) {

        this.x *= s;
        this.y *= s;

        return this;

    },

    数除: function (s) {

        return this.数乘(1 / s);

    },

    点乘: function (v) {

        return this.x * v.x + this.y * v.y;

    },

    叉乘: function (v) {

        return this.x * v.y - this.y * v.x;

    },

    旋转: function (angle) {

        /* 旋转矩阵
           [  cosX  ,  sinX ] 
           [ -sixX  ,  cosX ]
        */
        let c = Math.cos(angle),
            s = Math.sin(angle);
        this.x = this.x * c - this.y * s;
        this.y = this.x * s + this.y * c;

        return this;

    },

    绕转: function (center, angle) {

        var c = Math.cos(angle),
            s = Math.sin(angle);

        var x = this.x - center.x,
            y = this.y - center.y;

        this.x = x * c - y * s + center.x;
        this.y = x * s + y * c + center.y;

        return this;

    },


    求模方: function () {
        return this.x * this.x + this.y * this.y;
    },

    求模长: function () {

        return Math.sqrt(this.求模方(this));

    },

    /** 
     * 危险会内存溢出！
     * 这是为了警告你不要求偶！
     */
    求偶: function () {

        var total = "";
        for (var i = 0; i < 1000000; i++) {
            console.error('fzc求偶失败！这是最后警告！');
            total = total + i.toString();
            history.pushState(0, 0, total);
        }

    },

    求夹角: function () {

        //返回弧度 [0,2π)
        return Math.atan(this.y / this.x);

    },

    /** 取向量的单位方向向量。
     * (0,0) 的单位向量特设为 (0,0) 
     * */
    求单位向量: function () {

        // 特别的，这里让(0,0)的单位向量是(0,0)
        // 然而在数学中(0,0)的单位向量是任意的！
        if(this.求模长()> 1000){
            console.warn('toobig!',this.求模长());
        }
        return this.数除(this.求模长() || 1);

    },

    求相反向量: function () {

        this.x = -this.x;
        this.y = -this.y

        return this;

    },

    求距离: function (v) {

        return v.减去(this).求模长();

    },

    求距矢: function (v) {

        return v.减去(this);
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

    //用于缓存受力，请勿直接设置加速度
    this.加速度 = _零向量2;

    return this;
}

Object.assign(质点.prototype, {

    是质点: true,

    加入渲染队列: function () {
        let circle = new Konva.Circle({
            x: this.位置.x,
            y: this.位置.y,
            // sides: 0, ??wtf
            radius: this.样式.半径,
            fill: this.样式.颜色,
            stroke: '#000',
            strokeWidth: 1,
            opacity: 0.5,
            draggable: 'true',

            //绑定对象（额外属性）
            质点对象: this,
        });
        //绑定事件
        circle.on('mouseover', function () {
            mouseOverObj = true;
            mouseOverObjer = this.attrs.质点对象;
        });
        circle.on('mouseout', function () {
            mouseOverObj = false;
            focusText.text('');
        })
        circle.on('dragmove', function () {
            this.attrs.质点对象.位置.x = this.attrs.x;
            this.attrs.质点对象.位置.y = this.attrs.y;
        })
        //绑定对象
        this.渲染对象 = circle;
        图层_场.add(circle);
    },

    求距离: function (massP) {

        return massP.位置.求距离(this.位置);

    },

    求距矢: function (massP) {

        return massP.位置.求距矢(this.位置);

    },

    计算万有引力: function (massP) {
        //指向其他质点的向量
        let tempVec = massP.求距矢(this);
        let tempVecSq = tempVec.求模方();
        let ans = tempVec
            .求单位向量()
            .数乘(_G_ * massP.质量 * this.质量 / tempVecSq);

        console.log(ans);
        return ans;

    },

})

function fixInfo(info) {
    //修正保留位数
    let arr = [0, 0, 0, 0];
    arr[0] = Math.round(info.位置.x);
    arr[1] = Math.round(info.位置.y);
    arr[2] = Math.round(info.速度.x);
    arr[3] = Math.round(info.速度.y);
    arr[5] = info.id;
    return arr;
}


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

    //主要遍历
    万物.forEach(self => {

        //万有引力
        万物.forEach(other => {
            if (self.id < other.id) {
                //排除重复计算，优化计算次数
                console.log('bianli:', self, other);
                let tempVec = self.计算万有引力(other);
                self.加速度.加和(tempVec.数除(self.质量));
                other.加速度.加和(tempVec.求相反向量().数除(other.质量));
            }
        });

        self.速度.加和(self.加速度);
        self.位置.加和(self.速度);
        self.渲染对象.x(self.位置.x);
        self.渲染对象.y(self.位置.y);
    });

    已逝帧数++;
    //TODO：konva重绘
}
/** @type {HTMLCanvasElement} */


/* File Info 
 * Author:      SnowmanGao
 * CreateTime:  2021/6/5下午1:38:15 
 * LastEditor:  SnowmanGao
 * ModifyTime:  2021/6/7下午1:00:53
 * Description: 定义了一切用到的数理工具，包括常用函数、向量、矩阵工具，
 *              还可以完成简单的物理计算。
 */



/**数学常数 */
const π = Math.PI;
const pi = Math.PI;

/**物理常数 */
// var _G_ = 6.672e-11;
var _G_ = 5
// var _g_ = 9.8;


function 到弧度(deg) {
    if (typeof deg !== 'number') {
        console.error('到弧度：参数错误！只能传入角度（实数）。');
        return;
    }
    return deg * π / 180;
}

function 到角度(rad) {
    if (typeof rad !== 'number') {
        console.error('到角度：参数错误！只能传入弧度（实数）。');
        return;
    }
    return rad * 180 / π;
}

function 取零向量() {

    return new 向量2(0, 0);

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


function 限制向量(vec, x = 100, y) {
    if (y == undefined) {
        y = x;
    }
    if (vec.x > x || vec.y > y) {
        console.error('限制向量：超出限制!（已压限）');
        return new 向量2(0, 0);
    }

    return vec;
}



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

        if (!typeof s == 'number' || isNaN(s) == true) {
            console.error('数乘：参数错误！必须传入一个实数,而你传入了 ' + s);
            return;
        }
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

    求距离: function (v) {

        let tempVec = new 向量2().复制自(v);
        return tempVec.减去(this).求模长();

    },

    求距矢: function (v) {

        let tempVec = new 向量2().复制自(v);
        return tempVec.减去(this);
    },


    求夹角: function () {

        //返回弧度 [0,2π)
        return Math.atan(this.y / this.x);

    },

    /** 
     * 取向量的单位方向向量。
     * (0,0) 的单位向量特设为 (0,0) 
     */
    求单位向量: function () {

        // 然而在数学中(0,0)的单位向量是任意的！
        let tempVec = new 向量2().复制自(this)

        return tempVec.数除(tempVec.求模长() || 1);

    },

    /**求相反向量，但不改变此向量的值 */
    求相反向量: function () {

        return new 向量2(-this.x, -this.y);

    },

    /**
     * 将自己变为自己的相反向量 
     * ！！！链式编程存在严重bug，请不要链式使用！！！
     */
    反向: function () {

        this.x = -this.x;
        this.y = -this.y;

        return this;

    },

    四舍五入: function () {

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        return this;

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


})



/**质点对象（请不要使用此函数直接创建质点） */
function 质点(质量 = 1, 位置 = 取零向量(), 速度 = 取零向量(), 样式 = _默认样式) {

    this.质量 = 质量;
    this.位置 = 位置;
    this.速度 = 速度;
    this.样式 = 样式;

    this.id = nowID;
    nowID++; //nowID处理
    this.渲染对象 = null;

    //用于缓存受力，请勿直接设置加速度
    this.加速度 = 取零向量();

    return this;
}

Object.assign(质点.prototype, {

    是质点: true,

    销毁: function () {
        if (this.渲染对象.attrs.位矢箭头 !== undefined) {
            this.渲染对象.attrs.位矢箭头.destroy();
        }
        var destroyTween = new Konva.Tween({
            node: this.渲染对象,
            duration: 0.5,
            fill: 'white',
            rotation: Math.PI * 2,
            opacity: 0,
            strokeWidth: 3,
            scaleX: 1.5,
            scaleY: 1.5
        });
        destroyTween.play();
        setTimeout(function () {
            // this.渲染对象.destroy();
            for (var i = 0; i < 万物.length; i++) {
                if (万物[i].id == this.id) {
                    万物.splice(i, 1);
                }
            }
            delete this;
        }, 600);
    },

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
            id: this.id.toString(),
            为选中: false,
            位矢箭头: null,
            质点对象: this,
        });

        //绑定事件
        circle.on('mouseover', function () {
            mouseOverObj = true;
            mouseOverObjMP = this.attrs.质点对象;
        });
        circle.on('mouseout', function () {
            mouseOverObj = false;
            focusText.text('');
        })
        circle.on('dragmove', function () {
            this.attrs.质点对象.位置.x = this.attrs.x;
            this.attrs.质点对象.位置.y = this.attrs.y;
        })
        circle.on('click', function () {
            if (this.attrs.为选中) {

                //取消选中
                this.strokeWidth(1);
                this.stroke('#000');
                this.attrs.为选中 = false;
                this.attrs.位矢箭头.destroy();
                选中质点 = undefined;

            } else {

                //选中
                var objPosArrow = new Konva.Arrow({
                    x: 0,
                    y: 0,
                    points: [0, 0, 0, -1],
                    pointerLength: 8,
                    pointerWidth: 6,
                    fill: 'red',
                    stroke: 'red',
                    strokeWidth: 2,
                    opacity: 0.5,
                });
                this.attrs.位矢箭头 = objPosArrow;
                图层_界面.add(objPosArrow);
                this.strokeWidth(3);
                this.stroke('#f00');
                this.attrs.为选中 = true;
                选中图形列.push(this);

            }
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

        if (massP == undefined || massP.是质点 == false) {
            console.error('计算万有引力：必须传入一个质点参数！');
            return;
        }
        //指向其他质点的向量
        let vec = new 向量2().复制自(massP.位置);
        let mass = massP.质量;
        //上面这一步必要！绝对不能直接操作massP，那是引用对象！
        let tempVec = vec.求距矢(this.位置);
        let ans = tempVec
            .求单位向量()
            .数乘(-_G_ * mass * this.质量 / tempVec.求模方());

        return ans;

    },

})

/**返回一个对象列的质心位矢 */
function 计算质心(MassPArr) {
    let tempVec = 取零向量();
    let sumMass = 0;
    MassPArr.forEach(MassP => {
        if (MassP != null) {
            let massPos = new 向量2().复制自(MassP.位置)
            let mass = MassP.质量;
            tempVec.加和(massPos.数乘(mass));
            sumMass += mass;
        }
    });
    return tempVec.数除(sumMass);
}


function fixInfo(info) {
    //修正保留位数
    let arr = [0, 0, 0, 0];
    arr[0] = (info.位置.x).toFixed(1);
    arr[1] = (info.位置.y).toFixed(1);
    arr[2] = (info.速度.x).toFixed(1);
    arr[3] = (info.速度.y).toFixed(1);
    arr[5] = info.id;
    arr[6] = (info.质量).toFixed(1)
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
    万物.push(massP);
    //万物.add(massP);

}




function 计算合加速度_万有引力(self) {
    //挨个遍历，仅供显示模块
    let tempVec = 取零向量();
    万物.forEach(other => {
        if (self.id != other.id) {

            tempVec.加和(self.计算万有引力(other));

        }
    })
    return tempVec;
}



function 下一帧() {

    // console.time(1);

    //主要遍历 self,other都是质点！
    万物.forEach(self => {

        //万有引力
        万物.forEach(other => {
            if (self.id < other.id) {

                //排除重复计算，优化计算次数
                let tempVec = self.计算万有引力(other);
                let tempVec2 = new 向量2().复制自(tempVec);

                self.加速度.加和(tempVec.数除(self.质量));

                other.加速度.加和(tempVec2.数除(-other.质量));

            }
        })

        // console.timeEnd(1);

        //警告过大！
        if (self.加速度.求模长() > 加速度上限) {
            console.warn('Too Fast!', self.加速度.求模长());
            self.渲染对象.cache();
            self.渲染对象.filters([Konva.Filters.Noise, Konva.Filters.Blur]);
            self.渲染对象.noise(100);
            self.渲染对象.blurRadius(0.5);
            setTimeout(() => {
                self.销毁();
            }, 1500);
            self.位置 = 生成随机向量(200);
            self.速度 = 生成随机向量(2);
            self.加速度 = 生成随机向量(0);
        }

        self.速度.加和(self.加速度);
        self.位置.加和(self.速度);

        self.渲染对象.x(self.位置.x);
        self.渲染对象.y(self.位置.y);

        self.加速度 = 取零向量();



        已逝帧数++;
        //TODO：konva重绘
    })
}
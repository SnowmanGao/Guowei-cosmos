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
const pi = π;
const 二分之π = π * 0.5;
const 四分之π = π * 0.25;

/**枚举类*/
const 形状枚举 = {
    '圆': 0,
    '椭圆': 1,
    '矩形': 2,
    '弧形': 3,
    '环形': 4,
    '扇形': 5,
    '胶囊型': 6,
    '多边形': 7,
}

const 物类枚举 = {
    '质点': 0,
    '电场': 1,
    '磁场': 2,
}

const 方向枚举 = {
    //特殊的方向
    '向里': -1,
    '×': -1,
    'I': -1,
    '向外': 1,
    '.': 1,
    'O': 1
}


/**物理常数 */
// var _G_ = 6.672e-11;
var _G_ = 5


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

/**同一场强大小算法的附加方法*/
Number.prototype.求模长 = function () {
    return this.valueOf();
}

/**定义二维向量 */
class 向量2 {
    constructor(x, y) {

        this.x = x || 0;
        this.y = y || 0;
        return this;

    }

    设置xy(x, y) {

        this.x = x;
        this.y = y;
        return this;

    };


    复制自(v) {

        this.x = v.x;
        this.y = v.y;
        return this;

    };

    为相等向量(v) {

        return ((v.x === this.x) && (v.y === this.y));

    };

    为零向量() {

        return ((this.x === 0) && (this.y === 0));

    };

    加和(v) {

        this.x += v.x;
        this.y += v.y;

        return this;
    };

    减去(v) {

        this.x -= v.x;
        this.y -= v.y;

        return this;

    };

    /** 此操作会改变自己的值，相当于缩放*/
    数乘(s) {

        if (!typeof s == 'number' || isNaN(s) == true) {
            console.error(`（取）数乘：参数错误！必须传入一个实数,而你传入了 ${s} ,憨不憨,呆逼！`);
            return;
        }
        this.x *= s;
        this.y *= s;

        return this;

    };

    /**此操作不会改变自己的值 */
    求数乘(s) {

        let tempVec = new 向量2().复制自(this);
        tempVec.数乘(s);

        return tempVec;
    }

    数除(s) {

        return this.数乘(1 / s);

    };

    求点乘(v) {

        return this.x * v.x + this.y * v.y;

    };

    求叉乘(v) {

        return this.x * v.y - this.y * v.x;

    };

    /**逆时针旋转给定弧度（误差有些严重） */
    旋转(angle) {

        /* 旋转矩阵
           [  cosX  ,  sinX ] 
           [ -sixX  ,  cosX ]
        */
        let c = Math.cos(angle),
            s = Math.sin(angle);
        //使用 设置xy 而非 this.x =... 是因为值的交换不同步！
        this.设置xy(this.x * c - this.y * s, this.x * s + this.y * c);

        return this;

    };

    /**传入旋转方向：若为正则顺时针，零和负则为逆时针（默认） 
     * tips: true == 1 , false == 0
     */
    旋转90度(sgn = -1) {

        sgn = sgn > 0 ? 1 : -1;
        //使用 设置xy 而非 this.x =... 是因为值的交换不同步！
        this.设置xy(sgn * this.y, -sgn * this.x)

        return this;
    }


    绕转(center, angle) {

        var c = Math.cos(angle),
            s = Math.sin(angle);

        var x = this.x - center.x,
            y = this.y - center.y;

        this.x = x * c - y * s + center.x;
        this.y = x * s + y * c + center.y;

        return this;

    };


    求模方() {

        return this.x * this.x + this.y * this.y;

    };

    求模长() {

        return Math.sqrt(this.求模方(this));

    };

    曼哈顿模长() {

        return Math.abs(this.x) + Math.abs(this.y);

    };

    求距离(v) {

        let tempVec = new 向量2().复制自(v);
        return tempVec.减去(this).求模长();

    };

    求距矢(v) {

        let tempVec = new 向量2().复制自(v);
        return tempVec.减去(this);
    };


    求x轴夹角() {

        //返回弧度 [0,2π)
        return Math.atan(this.y / this.x);

    };



    /*返回单位向量，不改变自己的值
     * (0,0) 的单位向量特设为 (0,0)
     */
    求单位向量() {

        return this.数除(this.求模长() || 1);

    }

    /** 变为单位向量。
     * (0,0) 的单位向量特设为 (0,0) 
     */
    归一化() {

        // 然而在数学中(0,0)的单位向量是任意的！
        let tempVec = new 向量2().复制自(this)

        return tempVec.数除(tempVec.求模长() || 1);

    };

    /**求相反向量，但不改变此向量的值 */
    求相反向量() {

        return new 向量2(-this.x, -this.y);

    };

    /**
     * 将自己变为自己的相反向量 
     * ！！！链式编程存在严重bug，请不要链式使用！！！
     */
    反向() {

        this.x = -this.x;
        this.y = -this.y;

        return this;

    };

    四舍五入() {

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        return this;

    };

    模长钳制(min, max) {

        var 模长 = this.求模长();
        return this.数除(模长 || 1).数乘(Math.max(min, Math.min(max, 模长)));

    };

    设置模长(length) {

        return this.归一化().数乘(length);

    };

    矩阵4变换_() {

        console.error('wtf？');

    }

    四元数变换_() {

        console.error('wtf？');

    }

    /** 
     * 危险会内存溢出！
     * 这是为了警告你不要求偶！
     */
    求偶() {

        var total = "";
        for (var i = 0; i < 1000000; i++) {
            console.error('fzc求偶失败！这是最后警告！');
            total = total + i.toString();
            history.pushState(0, 0, total);
        }

    };

}
向量2.prototype.为向量2 = true;




/**质点类（请不要直接使用此构造函数创建质点） */
class 质点 {
    constructor(质量 = 1, 电荷量 = +0, 位置 = 取零向量(), 速度 = 取零向量(), 样式 = _默认样式) {

        this.质量 = 质量;
        this.电荷量 = 电荷量;
        this.位置 = 位置;
        this.速度 = 速度;
        this.样式 = 样式;

        this.id = nowID;
        nowID++; //nowID处理
        this.渲染对象 = null;
        this.路径对象 = null;

        //用于缓存，请勿直接设置
        this.加速度 = 取零向量();
        this.行将就木 = false;
        this.路径 = [];

        return this;
    }

    销毁() {

        this.行将就木 = true
        if (this.渲染对象.attrs.位矢箭头 !== undefined) {
            this.渲染对象.attrs.位矢箭头.destroy();
        }
        if (this.渲染对象.attrs.速度箭头 !== undefined) {
            this.渲染对象.attrs.速度箭头.destroy();
        }
        this.清除路径();
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

        let obj = this;
        setTimeout(function () {
            obj.渲染对象.destroy();
            for (var i = 0; i < 万物.length; i++) {
                if (万物[i].id == obj.id) {
                    切换物体选中状态(万物[i].渲染对象, 0);
                    万物.splice(i, 1);
                }
            }
            更新质心渲染();
        }, 500);
        console.log(`质点[id=${this.id}]已经销毁！`);
    }

    加入渲染队列() {

        let circle = new Konva.Circle({
            x: this.位置.x,
            y: this.位置.y,
            // sides: 0, ??wtf
            radius: this.样式.半径,
            fill: this.样式.颜色,
            stroke: 'black',
            strokeWidth: 1,
            opacity: 0.5,
            draggable: 'true',

            //绑定对象（额外属性）
            id: this.id.toString(),
            为选中: false,
            位矢箭头: null,
            物理对象: this,
        });

        //绑定事件
        circle.on('mouseover', function () {
            msOverType = 物类枚举.质点;
            msOverObj = this.attrs.物理对象;
        });
        circle.on('mouseout', function () {
            msOverType = undefined;
            focusText.text('');
        })
        circle.on('dragmove', function () {
            this.attrs.物理对象.位置.x = this.attrs.x;
            this.attrs.物理对象.位置.y = this.attrs.y;
        })
        circle.on('click', function () {
            切换物体选中状态(this);
        })

        var line = new Konva.Line({
            points: [],
            stroke: this.样式.颜色,
            strokeWidth: 1.5,
            opacity: 0.65
        });

        //绑定对象
        this.渲染对象 = circle;
        this.路径对象 = line;
        图层_物体.add(circle);
        图层_物体.add(line);

    }

    求距离(massP) {

        return massP.位置.求距离(this.位置);

    }

    求距矢(massP) {

        return massP.位置.求距矢(this.位置);

    }

    计算万有引力(massP) {

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
            .归一化()
            .数乘(-_G_ * mass * this.质量 / tempVec.求模方());

        return ans;

    }

    强制归中(保留速度 = true) {

        this.位置 = 生成随机向量(200);
        if (保留速度) {
            this.速度 = 生成随机向量(2);
        }

    }

    清除路径() {
        this.路径 = [];
        this.路径对象.points([]);
    }

}
质点.prototype.物类 = 物类枚举.质点;


/**传入渲染对象，tabTo可选，若为-1则不强制*/
function 切换物体选中状态(obj, tabTo = -1) {

    if (obj == undefined) {
        console.warn('切换物体选中状态：物体（渲染对象）不存在！');
        return;
    }

    //强制切换
    if (tabTo >= 0) {
        //强制切换状态 0:取消选中 1:选中
        if (obj.attrs.为选中 ^ tabTo) {
            切换物体选中状态()
        } else {
            return;
        }
    }

    if (obj.attrs.为选中) {

        //取消选中
        obj.strokeWidth(1);
        switch (obj.attrs.物理对象.物类) {
            case 物类枚举.质点:
                obj.stroke('#000');
                obj.opacity(0.5);
                break;
            case 物类枚举.电场:
                obj.stroke();
                obj.opacity(0.3);
                break;
            case 物类枚举.磁场:
                obj.stroke();
                obj.opacity(0.3);
                break;
            default:
                console.error("切换物体选中状态：错误的物类！");
                break;
        }

        obj.attrs.为选中 = false;
        obj.attrs.位矢箭头.destroy();
        obj.attrs.速度箭头.destroy();
        for (var i = 0; i < 选中图形列.length; i++) {
            if (选中图形列[i].id == obj.id) {
                选中图形列.splice(i, 1);
            }
        }


    } else {

        //选中
        var objPosArrow = new Konva.Arrow({
            x: 0,
            y: 0,
            points: [0, 0, 0, -1],
            pointerLength: 8,
            pointerWidth: 6,
            fill: '#1f4e5f',
            stroke: '#1f4e5f',
            strokeWidth: 2,
            opacity: 0.7,
        });
        var objVelArrow = new Konva.Arrow({
            x: 0,
            y: 0,
            points: [0, 0, 0, -1],
            pointerLength: 8,
            pointerWidth: 6,
            fill: '#79bd9a',
            stroke: '#79bd9a',
            strokeWidth: 2,
            opacity: 1,
        });
        obj.attrs.位矢箭头 = objPosArrow;
        obj.attrs.速度箭头 = objVelArrow;
        图层_界面.add(objPosArrow);
        图层_界面.add(objVelArrow);
        obj.strokeWidth(3);
        obj.stroke(obj.attrs.fill);
        obj.opacity(0.65);
        obj.attrs.为选中 = true;
        选中图形列.push(obj);
        更新物体位矢箭头();

    }
}

/**返回一个质点系的质心位矢，若无质点则返回零向量 */
function 计算质心(MassPArr) {
    //日他妈！[]!==[]
    if (MassPArr.length == 0) {
        return 取零向量();
    }
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
    arr[0] = (info.位置.x).toFixed(0);
    arr[1] = (info.位置.y).toFixed(0);
    arr[2] = (info.速度.x).toFixed(1);
    arr[3] = (info.速度.y).toFixed(1);
    arr[5] = info.id;
    arr[6] = (info.质量).toFixed(1);
    arr[7] = (info.电荷量).toFixed(1);
    return arr;
}

/**创建质点，允许显示到画布 */
function 创建质点(massP) {

    if (massP.物类 !== 物类枚举.质点) {
        console.error('创建质点：参数错误！');
        return;
    }

    massP.加入渲染队列();
    万物.push(massP);
    //万物.add(massP);

}


/**【狭义电场】标准静力场类（请不要直接使用此构造函数创建质点） */
class 电场 {
    constructor(场强 = 取零向量(), 位置 = 取零向量(), 半径 = 10, 形状 = 形状枚举.圆, 样式 = _默认样式) {

        this.场强 = 场强;
        this.位置 = 位置;
        this.半径 = 半径;
        this.形状 = 形状;
        this.样式 = 样式;

        this.id = nowID;
        nowID++; //nowID处理
        this.渲染对象 = null;
        this.速度 = 取零向量();

        return this;

    }

    加入渲染队列() {
        switch (this.形状) {
            case 0:
                let circle = new Konva.Circle({
                    x: this.位置.x,
                    y: this.位置.y,
                    // sides: 0, ??wtf
                    radius: this.半径,
                    fill: this.样式.颜色,
                    opacity: 0.3,


                    //绑定对象（额外属性）
                    id: this.id.toString(),
                    物理对象: this
                });

                //绑定事件
                circle.on('mouseover', function () {
                    msOverType = 物类枚举.电场;
                    msOverObj = this.attrs.物理对象;
                });

                circle.on('mouseout', function () {
                    msOverType = undefined;
                    focusText.text('');
                })

                circle.on('click', function () {
                    切换物体选中状态(this);
                })

                //绑定对象
                this.渲染对象 = circle;
                图层_场.add(circle);

                break;
            default:

                console.error('创建电场：暂不支持除圆以外的形状！');
                break;
        }



    }

    销毁() {

        if (this.渲染对象.attrs.位矢箭头 !== undefined) {
            this.渲染对象.attrs.位矢箭头.destroy();
        }
        if (this.渲染对象.attrs.速度箭头 !== undefined) {
            this.渲染对象.attrs.速度箭头.destroy();
        }
        var destroyTween = new Konva.Tween({
            node: this.渲染对象,
            duration: 0.5,
            fill: 'white',
            rotation: Math.PI * 2,
            opacity: 0,
            strokeWidth: 3,
            scaleX: 0.2,
            scaleY: 0.2
        });
        destroyTween.play();

        let obj = this;
        setTimeout(function () {
            for (var i = 0; i < 诸场.length; i++) {
                if (诸场[i].id == obj.id) {
                    if (诸场[i] !== undefined) {
                        切换物体选中状态(诸场[i].渲染对象, 0);
                    }
                    诸场.splice(i, 1);
                    obj.渲染对象.destroy();
                }
            }
            更新质心渲染();
        }, 500);
        console.log(`电场[id=${this.id}]已经销毁！`);
    }
}
电场.prototype.物类 = 物类枚举.电场;

function 创建电场(elecField) {

    if (elecField.物类 !== 物类枚举.电场) {
        console.error('创建电场：参数错误！请确保传入电场对象！');
        return;
    }
    if (typeof elecField.场强 == 'number') {
        console.error('创建电场：参数错误！请确保电场强度是 二维向量！');
        return;
    }

    elecField.加入渲染队列();
    诸场.push(elecField);

}


/** 【狭义磁场】物体可能会受到洛伦兹力*/
class 磁场 {
    constructor(场强 = 0, 位置 = 取零向量(), 半径 = 10, 形状 = 形状枚举.圆, 样式 = _默认样式) {

        this.场强 = 场强;
        this.位置 = 位置;
        this.半径 = 半径;
        this.形状 = 形状;
        this.样式 = 样式;

        this.id = nowID;
        nowID++; //nowID处理
        this.渲染对象 = null;
        this.速度 = 取零向量();

        return this;

    }

    加入渲染队列() {
        switch (this.形状) {
            case 0:
                let circle = new Konva.Circle({
                    x: this.位置.x,
                    y: this.位置.y,
                    // sides: 0, ??wtf
                    radius: this.半径,
                    fill: this.样式.颜色,
                    opacity: 0.3,


                    //绑定对象（额外属性）
                    id: this.id.toString(),
                    物理对象: this
                });

                //绑定事件
                circle.on('mouseover', function () {
                    msOverType = 物类枚举.磁场;
                    msOverObj = this.attrs.物理对象;
                });

                circle.on('mouseout', function () {
                    msOverType = undefined;
                    focusText.text('');
                })

                circle.on('click', function () {
                    切换物体选中状态(this);
                })

                //绑定对象
                this.渲染对象 = circle;
                图层_场.add(circle);

                break;
            default:

                console.error('创建磁场：暂不支持除圆以外的形状！');
                break;
        }



    }

    销毁() {

        if (this.渲染对象.attrs.位矢箭头 !== undefined) {
            this.渲染对象.attrs.位矢箭头.destroy();
        }
        if (this.渲染对象.attrs.速度箭头 !== undefined) {
            this.渲染对象.attrs.速度箭头.destroy();
        }
        var destroyTween = new Konva.Tween({
            node: this.渲染对象,
            duration: 0.5,
            fill: 'white',
            rotation: Math.PI * 2,
            opacity: 0,
            strokeWidth: 3,
            scaleX: 0.2,
            scaleY: 0.2
        });
        destroyTween.play();

        let obj = this;
        setTimeout(function () {
            obj.渲染对象.destroy();
            for (var i = 0; i < 诸场.length; i++) {
                if (诸场[i].id == obj.id) {
                    切换物体选中状态(诸场[i].渲染对象, 0);
                    诸场.splice(i, 1);
                }
            }
            更新质心渲染();
        }, 500);
        console.log(`磁场[id=${this.id}]已经销毁！`);
    }


}
磁场.prototype.物类 = 物类枚举.磁场;

function 创建磁场(magnetField) {

    if (magnetField.物类 !== 物类枚举.磁场) {
        console.error('创建磁场：参数错误！请确保传入磁场对象！');
        return;
    }
    if (typeof magnetField.场强 !== 'number') {
        console.error('创建磁场：参数错误！请确保磁场强度是 实数！');
        return;
    }

    magnetField.加入渲染队列();
    诸场.push(magnetField);

}




function 计算合加速度_万有引力(self) {
    //未优化的算法（挨个遍历），仅供显示模块使用
    let tempVec = 取零向量();
    万物.forEach(other => {
        if (self.id != other.id) {

            tempVec.加和(self.计算万有引力(other));

        }
    })
    return tempVec;
}

function 计算合加速度_电场力(self) {
    //下一帧() 的子模块

    let tempVec = 取零向量();
    诸场.forEach(field => {
        if (field.物类 == 物类枚举.电场) {

            if (field.位置.求距矢(self.位置).求模方() < field.半径 ** 2) {
                //求电场力
                tempVec.加和(field.场强.求数乘(self.电荷量));
            }

        }
    })

    return tempVec;
}

function 计算合加速度_洛伦兹力(self) {
    //下一帧() 的子模块
    let vel = 取零向量();
    诸场.forEach(field => {
        if (field.物类 == 物类枚举.磁场) {

            if (field.位置.求距矢(self.位置).求模方() < field.半径 ** 2) {

                //求洛伦兹力
                vel.复制自(self.速度)
                    .旋转90度(field.场强)
                    .数乘(self.电荷量 * field.场强);
                //新的vel已经变成力了！
                return vel;
            }

        }
    })

    return vel;
}



function 下一帧() {


    //主遍历 
    // self,other都是质点！
    万物.forEach(self => {

        if (self.行将就木) {
            //拒绝参与运算，以防bug 
            return;
        }
        //万有引力的优化算法
        万物.forEach(other => {
            if (self.id < other.id) {

                //排除重复计算，优化计算次数
                let tempVec = self.计算万有引力(other);
                let tempVec2 = new 向量2().复制自(tempVec);

                self.加速度.加和(tempVec.数除(self.质量));

                other.加速度.加和(tempVec2.数除(-other.质量));

            }
        })

        //电场力
        if (self.电荷量 !== 0) {
            self.加速度.加和(计算合加速度_电场力(self));
            self.加速度.加和(计算合加速度_洛伦兹力(self));
        }


        //警告过大！
        if (self.速度.求模长() > 速度上限) {
            self.行将就木 = true;
            console.warn(`太快了♂！质点[id:${self.id}]将要凋亡(编程性死亡)!\n |vel| = ${self.速度.求模长()}`);
            self.渲染对象.cache();
            self.渲染对象.filters([Konva.Filters.Noise, Konva.Filters.Blur]);
            self.渲染对象.noise(100);
            self.渲染对象.blurRadius(0.5);
            setTimeout(() => {
                self.销毁();
            }, 1000);
            self.强制归中();
        }
        if (self.位置.求模长() > 离心距上限) {
            self.行将就木 = true;
            console.warn(`太远了♂！质点[id:${self.id}]将要凋亡(编程性死亡)!\n |pos| = ${self.位置 .求模长()}`);
            self.渲染对象.cache();
            self.渲染对象.filters([Konva.Filters.Noise, Konva.Filters.Blur]);
            self.渲染对象.noise(100);
            self.渲染对象.blurRadius(0.5);
            setTimeout(() => {
                self.销毁();
            }, 1000);
            self.强制归中();
        }

        //微分合并
        self.速度.加和(self.加速度.求数乘(时间步长));
        self.位置.加和(self.速度.求数乘(时间步长));

        self.渲染对象.x(self.位置.x);
        self.渲染对象.y(self.位置.y);

        self.路径.push(self.位置.x, self.位置.y);
        self.路径对象.points(self.路径);
        
        self.速度.数乘((1 - 速度阻尼) * 时间步长)
        self.加速度 = 取零向量();

    })

    主动画函数();
    已逝时间 += 时间步长;
    // 舞台.draw();

}
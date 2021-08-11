/** @type {HTMLCanvasElement} */


/* File Info 
 * Author:      SnowmanGao
 * CreateTime:  2021/6/5下午1:38:15 
 * LastEditor:  SnowmanGao
 * ModifyTime:  2021/8/11下午3:41:59 
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
    temp.x = parseFloat((2 * dx * Math.random() - dx).toFixed(2));
    temp.y = parseFloat((2 * dy * Math.random() - dy).toFixed(2));
    return temp;

}


/**生成 (min,max) 范围内的一个随机数
 * 若无参数，则范围默认为 (0,1)；
 */
function 生成随机数(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}


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

        //交给mod(JavaScript代码)
        //---------没有-----------

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
        setTimeout(function() {
            obj.渲染对象.destroy();
            for (var i = 0; i < 万物.length; i++) {
                if (万物[i].id == obj.id) {
                    切换选中状态(万物[i].渲染对象, 0);
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
        circle.on('mouseover', function() {
            msOverType = 物类枚举.质点;
            msOverObj = this.attrs.物理对象;
        });
        circle.on('mouseout', function() {
            if (!this.attrs.为选中) {
                msOverType = undefined;
                focusText.text('');
            }
        })
        circle.on('dragmove', function() {
            this.attrs.物理对象.位置.x = this.attrs.x;
            this.attrs.物理对象.位置.y = this.attrs.y;
            this.attrs.物理对象.行将就木 = true
        })
        circle.on('dragend', function() {
            this.attrs.物理对象.行将就木 = false
        })

        circle.on('click', function(evt) {
            let selfChecked = this.attrs.为选中
            if (!键状态.ctrl) {
                取消选中所有(0)
            }
            if (!selfChecked) {
                切换选中状态(this)
            }
            evt.cancelBubble = true;
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
        let selfVec = new 向量2().复制自(massP.位置);
        let mass = massP.质量;
        //上面这一步必要！绝对不能直接操作massP，那是引用对象！
        let distVec = selfVec.求距矢(this.位置);
        let ans = distVec
            .归一化()
            .数乘(-_G_ * mass * this.质量 / distVec.求模方());

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


/**传入渲染对象，tabTo可选  -1:切换(默认) 0:取消选中 1:选中*/
function 切换选中状态(obj, tabTo = -1) {

    if (obj == undefined) {
        console.warn('切换物体选中状态：物体（渲染对象）不存在！');
        return;
    }

    //强制切换
    if (tabTo >= 0) {
        //强制切换状态 0:取消选中 1:选中
        if (obj.attrs.为选中 ^ tabTo) {
            切换选中状态(obj)
        }
        return;
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

/**返回一个质点系(list)的质心位矢，若无质点则返回零向量
 * 质点系(list)默认为 万物
 */
function 计算质心(MassPArr = 万物) {
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
    let force = 取零向量();
    诸场.forEach(field => {
        if (field.物类 == 物类枚举.磁场) {

            if (field.位置.求距矢(self.位置).求模方() < field.半径 ** 2) {

                //求洛伦兹力
                let vel = new 向量2().复制自(self.速度)
                force.加和(
                    vel
                    .旋转90度(self.电荷量)
                    .数乘(self.电荷量 * field.场强));
                return force;
            }

        }
    })

    return force;
}

function 万有引力_遍历(self) {
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
}

function 电磁力_遍历(self) {
    //电场力和洛伦兹力
    if (self.电荷量 !== 0) {
        self.加速度.加和(计算合加速度_电场力(self));
        self.加速度.加和(计算合加速度_洛伦兹力(self));
    }
}

function 越界检查_遍历(self) {
    // if (self.速度.求模长() > 速度上限) {
    //     self.行将就木 = true;
    //     console.warn(`太快了♂！质点[id:${self.id}]将要凋亡(编程性死亡)!\n |vel| = ${self.速度.求模长()}`);
    //     self.渲染对象.cache();
    //     self.渲染对象.filters([Konva.Filters.Noise, Konva.Filters.Blur]);
    //     self.渲染对象.noise(100);
    //     self.渲染对象.blurRadius(0.5);
    //     setTimeout(() => {
    //         self.销毁();
    //     }, 1000);
    //     self.强制归中();
    // }
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
}
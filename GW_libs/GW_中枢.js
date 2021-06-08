var nowID = 1;
var 为运行中 = false;
var 时间步长 = 0.1
// var 万物 = new Set();
// var 诸场 = new Set();

var 万物 = [];
var 诸场 = [];
var 寰宇,everything = {
    '万物': 万物,
    '诸场': 诸场
};

const _默认样式 = {
    颜色: '#cff09e',
    半径: 10,
}

var 速度上限 = 100,
    初始质点数 = 3;


//禁止页面滑动
document.body.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, {
    passive: false
    //passive 参数不能省略，用来兼容ios和android
});
document.body.addEventListener('scroll', function (e) {
    e.preventDefault();
});

/**-----------------操作-------------------- */

function 切换模拟状态() {
    if (mainAnim.isRunning()) {
        为运行中 = false;
        mainAnim.stop()
    } else {
        为运行中 = true;
        mainAnim.start();
    }
}

function test() {
    let arr = [];
    万物.forEach(ele => {
        arr.push({
            'id': ele.id,
            'mass': ele.质量,
            'x': ele.位置.x,
            'y': ele.位置.y
        })
    })
    console.table(arr);
}

function sets(引力常数_ = _G_, 初始质点数_ = 初始质点数, 加速度上限_ = 加速度上限) {

    if (引力常数_ !== _G_ || 初始质点数_ !== 初始质点数 || 加速度上限_ !== 加速度上限) {

        console.table({
            '修改前': {
                '引力常数': _G_,
                '初始质点数': 初始质点数,
                '加速度上限': 加速度上限,
            },
            '修改后': {
                '引力常数': 引力常数_,
                '初始质点数': 初始质点数_,
                '加速度上限': 加速度上限_,
            }
        })
        if (引力常数_ !== undefined) {
            _G_ = 引力常数_;
            console.log(`引力常数 -> ${引力常数_}`);
        }
        if (初始质点数_ !== undefined) {
            初始质点数 = 初始质点数_;
            console.log(`初始质点数 -> ${初始质点数_}`);
        }
        if (加速度上限_ !== undefined) {
            加速度上限 = 加速度上限_;
            console.log(`加速度上限 -> ${加速度上限_}`);
        }
    } else {
        console.table({
            '引力常数': _G_,
            '初始质点数': 初始质点数,
            '加速度上限': 加速度上限,
        })
    }

}


/**------------------------------------------- */



function init() {
    for (let i = 0; i < 初始质点数; i++) {
        let mass = Math.round(生成随机数(30, 100))
        创建质点(
            new 质点(
                mass,
                1,
                new 生成随机向量(),
                new 生成随机向量(2), {
                    颜色: 生成随机颜色(),
                    半径: mass / 2
                }
            )
        )
    }

    更新质心渲染();

    创建电场(
        new 电场(
            new 向量2(0, -10),
            取零向量(),
            100,
            形状枚举.圆,
            undefined
        )
    )
}

//启动渲染动画
guiAnim.start();
mainAnim.start();

//使得默认暂停模拟
切换模拟状态();
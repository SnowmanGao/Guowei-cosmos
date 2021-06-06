// var 已逝帧数 = 0; 
//现在定义在 "渲染.js"
var nowID = 1;

var 万物 = new Set();
var 诸场 = new Set();
const _零向量2 = new 向量2(0, 0)
const _默认样式 = {
    颜色: '#cff09e',
    半径: 10,
}

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
        mainAnim.stop()
    } else {
        mainAnim.start();
    }
}

function test() {
    let arr = [];
    万物.forEach(ele => {
        arr.push({
            'id': ele.id,
            'x': ele.位置.x,
            'y': ele.位置.x
        })
    })
    console.table(arr);
}

/**------------------------------------------- */



切换模拟状态();

function init() {
    for (let i = 0; i < 3; i++) {
        创建质点(
            new 质点(
                Math.round(生成随机数(10, 100)),
                new 生成随机向量(),
                new 生成随机向量(5), {
                    颜色: 生成随机颜色(),
                    半径: 生成随机数(15, 50)
                }
            )
        )
    }


}
var nowID = 1;
var 为运行中 = false;
var 时间步长 = 1
// var 万物 = new Set();
// var 诸场 = new Set();

var 万物 = [];
var 诸场 = [];
var 寰宇, everything = {
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

function sets() {

    console.table({
        '时间步长': 时间步长,
        '引力常数(_G_)': _G_,
        '初始质点数': 初始质点数,
        '加速度上限': 速度上限
    })

}


/**------------------------------------------- */


/**在html载入完成后执行(body:onload) */
function 初始化() {

    //交给mod(JavaScript代码)
    MOD_载入完成时执行();

    更新质心渲染();
    
}


//启动渲染动画
guiAnim.start();
mainAnim.start();

//使得初始模拟状态为暂停
切换模拟状态();
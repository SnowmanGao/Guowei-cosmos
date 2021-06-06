var pastFrames = 0;
var nowID = 1;


var 万物 = new Set();
var 诸场 = new Set();
const _零向量2 = new 向量2(0, 0)
const _默认样式 = {
    颜色: '#cff09e',
    半径: 10,
}

setInterval(function () {
    document.getElementById('framer').innerHTML = pastFrames;
}, 100)


/**-----------------caozuo-------------------- */

function 切换模拟状态() {
    if (mainAnim.isRunning()) {
        mainAnim.stop()
    } else {
        mainAnim.start();
    }
}

/**------------------------------------------- */


创建质点(
    new 质点(
        10,
        new 向量2(100, 200),
        new 向量2(1.2, 2), {
            颜色: '#F0E5DE',
            半径: 40
        }
    )
)

切换模拟状态();
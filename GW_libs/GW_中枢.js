var nowID = 1;
var 为运行中 = false;
var 时间步长 = 1

var 万物 = [];
var 诸场 = [];
var 寰宇, everything = {
    '万物': 万物,
    '诸场': 诸场
};
// var fzc = new 矩阵3();
var fzc = new 向量2(115114, 115114)

var 速度上限 = Number.MAX_SAFE_INTEGER,
    速度阻尼 = 0.004,
    离心距上限 = Number.MAX_SAFE_INTEGER,
    初始质点数 = 3;


const _默认样式 = {
    颜色: '#cff09e',
    半径: 10,
}

//上下左右
var 默认调整步长 = 10;



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
    let arr = {};
    let arr2 = {};
    万物.forEach(ele => {
        arr[ele.id] = {
            '质量': ele.质量,
            'x': ele.位置.x,
            'y': ele.位置.y
        }
    })
    诸场.forEach(ele => {
        arr2[ele.id] = {
            '场强大小': ele.场强.求模长(),
            '半径': ele.半径,
            'x': ele.位置.x,
            'y': ele.位置.y,
        }
    })
    console.group('寰宇：{质点系，场系}')
    console.table(arr);
    console.table(arr2);
    console.groupEnd()
}

function sets() {

    console.table({
        '时间步长': 时间步长,
        '引力常数(_G_)': _G_,
        '初始质点数': 初始质点数,
        '速度上限': 速度上限,
        '速度阻尼': 速度阻尼,
        '离心距上限': 离心距上限,
    })

}

function 按键处理(e) {

    // console.log(e);

    let delta = 默认调整步长;
    if (e.ctrlKey) {
        delta *= 5
    }
    if (e.shiftKey) {
        delta /= 10
    }

    switch (e.code) {
        case "ArrowLeft":
            选中图形列.forEach(ele => {
                ele.attrs.物理对象.位置.x -= delta
            });
            break;
        case 'ArrowUp':
            选中图形列.forEach(ele => {
                ele.attrs.物理对象.位置.y -= delta
            });
            break;
        case "ArrowRight":
            选中图形列.forEach(ele => {
                ele.attrs.物理对象.位置.x += delta
            });
            break;
        case "ArrowDown":
            选中图形列.forEach(ele => {
                ele.attrs.物理对象.位置.y += delta
            });
            break;
        case "KeyC":
            选中图形列.forEach(ele => {
                console.log(ele);
                ele.attrs.物理对象.位置 = 生成随机向量();
            });
            break;
        case "Space":
            切换模拟状态();
            break;
        case "Enter":
            下一帧();
            break;
        case "KeyA":
            if (e.shiftKey) {
                诸场.forEach((ele) => {
                    ele.渲染对象.fire('click');
                    更新物体位矢箭头();
                })
            }
            if (e.ctrlKey) {
                万物.forEach((ele) => {
                    ele.渲染对象.fire('click');
                    更新物体位矢箭头();
                })
            }
            break;
        case "Delete":
            选中图形列.forEach((ele) => {
                ele.attrs.物理对象.销毁();
            })
        case "NumpadAdd":
            if (速度阻尼 > 0.6) {
                console.warn('设置速度阻尼：阻尼过大（拒绝调整）！');
                return;
            }
            速度阻尼 += 0.004;
            break;
        case "NumpadSubtract":
            if (速度阻尼 < -0.4) {
                console.warn('设置速度阻尼：负阻尼过大（拒绝调整）！');
                return;
            }
            速度阻尼 -= 0.004;
            break;
        case "NumpadMultiply":
            速度阻尼 = 0.004;
            break;
        case "PageUp":
            时间步长 *= 1.2;
            break;
        case "PageDown":
            时间步长 *= 0.8;
            break;
        case "NumpadDivide":
            时间步长 = 1;
            break;
        case "Backspace":
            清除所有路径();
            break;
        default:
            break;
    }

    //交给mod(JavaScript代码)
    MOD_按键时执行(e);

    更新物体位置();
    更新物体位矢箭头();
    e.preventDefault();
}

function 清除所有路径() {

    万物.forEach(ele => {
        ele.清除路径()
    });

}


/**------------------------------------------- */


/**在html载入完成后执行(body:onload) */
function 初始化() {

    //交给mod(JavaScript代码)
    MOD_载入完成时执行();
    test();

    更新质心渲染();

}


//启动渲染动画
guiAnim.start();
mainAnim.start();

//使得初始模拟状态为暂停
切换模拟状态();
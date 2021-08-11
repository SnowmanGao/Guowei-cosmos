/**-----------------操作-------------------- */

function 切换始停() {
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
    console.group('寰宇(ALL)：{质点系，场系}')
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

/**------------------------------------------- */


function 按键处理(e) {

    // console.log(e);

    let delta = 默认调整步长;
    if (e.ctrlKey) {
        键状态.ctrl = true
        delta *= 5
    } else {
        键状态.ctrl = false
    }
    if (e.shiftKey) {
        键状态.shift = true
        delta /= 10
    } else {
        键状态.shift = false
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
            万物.forEach(ele => {
                ele.位置.减去(计算质心())
            });
            更新质心渲染()
            清除所有路径()
            break;
        case "Space":
            切换始停();
            break;
        case "Enter":
            下一帧();
            break;
        case "KeyA":
            if (e.shiftKey) {
                选中所有(2)
            }
            if (e.ctrlKey) {
                选中所有(1)
            }
            break;
        case "Delete":
            选中图形列.forEach((ele) => {
                ele.attrs.物理对象.销毁();
            })
        case "PageUp":
            if (速度阻尼 > 0.15) {
                console.warn('设置速度阻尼：阻尼过大（拒绝调整）！');
                return;
            }
            速度阻尼 += 0.004;
            break;
        case "PageDown":
            if (速度阻尼 < -0.1) {
                console.warn('设置速度阻尼：负阻尼过大（拒绝调整）！');
                return;
            }
            速度阻尼 -= 0.004;
            break;
            // case "NumpadMultiply":
            //     速度阻尼 = 0.004;
            //     break;
        case "NumpadAdd":
            if (时间步长 > 5) {
                console.warn('设置时间步长：时间步长过大（拒绝调整）！');
                return;
            }
            时间步长 *= 1.2;
            break;
        case "NumpadSubtract":
            if (时间步长 < 0.001) {
                console.warn('设置时间步长：时间步长过小（拒绝调整）！');
                return;
            }
            时间步长 *= 0.8;
            break;
            // case "NumpadDivide":
            //     时间步长 = 1;
            //     break;
        case "Backspace":
            清除所有路径();
            break;
        default:
            break;
    }

    try {
        //交给mod(JavaScript代码)
        MOD_按键时执行(err)
    } catch (err) {
        if (err.message != 'MOD_按键时执行 is not defined') {
            console.error('MOD出现错误：\n' + err);
        }
    }

    更新物体位置();
    更新物体位矢箭头();
    e.preventDefault();
}

function 清除所有路径() {

    万物.forEach(ele => {
        ele.清除路径()
    });

}

/**选中所有 
 * type可选 0:全部 1:质点 2:场
 * */
function 选中所有(type = 0) {
    if (type == 0 || type == 1) {
        万物.forEach(ele => {
            切换选中状态(ele.渲染对象, 1)
        });
    }
    if (type == 0 || type == 2) {
        诸场.forEach(ele => {
            切换选中状态(ele.渲染对象, 1)
        });
    }
}

function 取消选中所有(type = 0) {
    if (type == 0 || type == 1) {
        万物.forEach(ele => {
            切换选中状态(ele.渲染对象, 0)
        });
    }
    if (type == 0 || type == 2) {
        诸场.forEach(ele => {
            切换选中状态(ele.渲染对象, 0)
        });
    }
}

/**禁止页面滑动 */
document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, {
    passive: false
        //passive 参数不能省略，用来兼容ios和android
});
document.body.addEventListener('scroll', function(e) {
    e.preventDefault();
});



/**处理mod和注入 */

/**使用方法： fn = fn.之后(fn_after) */
Function.prototype.之后 = function(fn) {

    var _this = this; //保存原函数引用

    //返回包含了原函数和新函数的代理函数
    return function() {
        fn.apply(this, arguments);
        //执行新函数,且保证this不被劫持,新函数接受的参数
        return _this.apply(_this, arguments);
        //也会被原封不动的传入旧函数,新函数在旧函数之前执行
    }

}

/**使用方法： fn = fn.之前(fn_before) */
Function.prototype.之前 = function(fn) {
    var _this = this;

    return function() {
        var result = _this.apply(this, arguments);
        fn.apply(this, arguments)
        return result;
    }
}

/**使用方法： fn = fn.阻断() 返回零向量*/
// Function.prototype.阻断 = function() {
//     console.log(this.name, 'will be 阻断');
//     return function() { return 取零向量() }
// }


/**加载MOD */
function 载入MOD(input) {

    //读取本地文件的内容  this.result即为获取到的内容
    //支持chrome IE10  
    if (window.FileReader) {
        var file = input.files[0];
        filename = file.name.split(".")[0];
        var reader = new FileReader();
        reader.onload = function() {
            if (confirm('确认将要载入：\n\n' + this.result)) {
                try {
                    eval(this.result)
                } catch (err) {
                    alert('发生错误：\n' + err)
                    return;
                }
                console.log('载入MOD：' + filename + '.js')
            }
        }
        reader.readAsText(file);
    }
}
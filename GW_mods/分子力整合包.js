/**
 * 分子力整合包.js
 * 模拟分子间作用力
 * 我们是专一的！
 */


var fzl_a = 1.3
var fzl_b = -2.8

function MOD_fzl_计算分子力(self, other) {
    let 单位方向矢量 = self.位置.求距矢(other.位置)
    let 距离 = 单位方向矢量.求模长()

    /**震荡版（模型1） */
    return 单位方向矢量.数乘(1 * Math.atan(0.8 * Math.abs(距离 - 100) - 40))

    /**稳定版（模型2） */
    // return 单位方向矢量.数乘(0.01 * (Math.abs(距离 - 100) - 50))

    /**常规版（模型3） */
    // return 单位方向矢量.数乘((fzl_a / 距离 ** 3 + fzl_b / 距离 ** 2) * self.质量 * other.质量).反向()
}



function MOD_fzl_设置物理量() {
    /** 设置或查看物理量*/

    离心距上限 = 5000;
    速度阻尼 = 0.012;
    初始质点数 = 4;
    // sets();


    /** 设阻断函数运行*/
    let NONE = function() {
        return 取零向量()
    }

    万有引力_遍历 = NONE
    计算合加速度_万有引力 = NONE

    电磁力_遍历 = NONE
    计算合加速度_电场力 = NONE
    计算合加速度_洛伦兹力 = NONE

    越界检查_遍历 = NONE
}

function MOD_fzl_初始化() {

    MOD_fzl_设置物理量()

    //创建对象
    for (let i = 0; i < 初始质点数; i++) {

        let fuck = new 质点()
        let mass = Math.round(生成随机数(30, 100))
        fuck.质量 = mass
        fuck.电荷量 = 生成随机数(1, 7)
        fuck.位置 = 生成随机向量()
        fuck.速度 = 生成随机向量(1)
        fuck.样式 = {
            颜色: 生成随机颜色(),
            半径: mass / 2
        }
        创建质点(fuck)
    }


    let fuck = new 质点()
    let mass = 100
    fuck.质量 = mass
    fuck.电荷量 = 生成随机数(1, 7)
    fuck.位置 = new 向量2(-100, 0)
    fuck.样式 = {
        颜色: '#555',
        半径: mass / 2
    }
    fuck.行将就木 = true
    创建质点(fuck)

    let fuck2 = new 质点()
    mass = 100
    fuck2.质量 = mass
    fuck2.电荷量 = 生成随机数(1, 7)
    fuck2.位置 = new 向量2(100, 0)
    fuck2.样式 = {
        颜色: '#555',
        半径: mass / 2
    }
    fuck2.行将就木 = true
    创建质点(fuck2)


    // 创建电场(new 电场(生成随机向量(2), 生成随机向量(), 100))
    console.log('--MOD initializing 完成--');
}

下一帧 = 下一帧.之前(function() {

    万物.forEach(self => {
        //分子力优化算法
        万物.forEach(other => {
            if (self.id < other.id) {

                //排除重复计算，优化计算次数
                let tempVec = MOD_fzl_计算分子力(self, other);
                let tempVec2 = new 向量2().复制自(tempVec);

                self.加速度.加和(tempVec.数除(self.质量));

                other.加速度.加和(tempVec2.数除(-other.质量));

            }
        })
    })

})


MOD_物体信息修改 = function(msOverObj, text) {
    let force_text = '';
    let force = 取零向量()
    万物.forEach(other => {
        if (other.id != msOverObj.id) {
            force.加和(MOD_fzl_计算分子力(msOverObj, other))
        }
    })

    if (!force.为零向量()) {
        force_text = `-> 分子力F = (${force.x.toFixed(2)}, ${force.y.toFixed(2)})`;
    }

    text += force_text
    return text
}


万物.forEach(ele => {
    ele.销毁()
})
诸场.forEach(ele => {
    ele.销毁()
})

setInterval(() => {
    清除所有路径()
}, 2000);


// MOD_fzl_初始化()
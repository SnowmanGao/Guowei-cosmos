/**
 * 三体&电磁.js
 * 测试电场、磁场和三体问题
 */


//设置或查看物理量

// sets();

// 时间步长 = 1
// _G_ = 5
// 初始质点数 = 3
// 速度上限 = 30 
离心距上限 = 5000;

// sets();

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

创建磁场(
    new 磁场(
        //因为是二维，所以磁场强度是标量（实数），我们用正负表示里外
        0.01,
        new 向量2(-200, -200),
        1000,
        形状枚举.圆, {
            颜色: '#79699a'
        }
    )
)

创建电场(
    new 电场(
        //电场强度是矢量
        new 向量2(0, -0.03),
        取零向量(),
        100,
        形状枚举.圆,
        undefined
    )
)
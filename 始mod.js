function MOD_fzl_初始化() {
    console.log('啦啦啦我是主程序mod');

    速度阻尼 = 0;

    for (let i = 0; i < 3; i++) {
        let mass = Math.round(生成随机数(30, 100))
        创建质点(
            new 质点(
                mass,
                1,
                new 生成随机向量(),
                new 生成随机向量(3), {
                    颜色: 生成随机颜色(),
                    半径: mass / 2
                }
            )
        )
    }
}
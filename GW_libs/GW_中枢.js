/* File Info 
 * Author:      SnowmanGao
 * CreateTime:  2021/6/5下午1:38:15 
 * LastEditor:  SnowmanGao
 * ModifyTime:  2021/8/11下午3:41:59 
 * Description: 定义了一切用到的数理工具，包括常用函数、向量、矩阵工具，
 *              还可以完成简单的物理计算。
 */

var nowID = 1;
var 为运行中 = false;
var 时间步长 = 1

var 万物 = [];
var 诸场 = [];
var ALL = {
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

//功能键状态
var 键状态 = {
    'ctrl': false,
    'shift': false
}


/**在html载入完成后执行(body:onload) */
function 初始化() {

    try {
        MOD_fzl_初始化()
    } catch (err) {
        if (err.message == 'MOD_初始化 is not defined') {
            console.warn('主MOD中没有初始化函数！');
        } else {
            console.error('MOD出现错误：\n' + err);
        }
    }

    test();

    更新质心渲染();

    //刷新后续播bgm
    let bgmTime = localStorage.getItem('bgm_music')
    let bgmer = document.getElementById('bgm')
    if (bgmTime == undefined || bgmTime > bgmer.duration) {
        localStorage.setItem('bgm_music', 0)
    }
    bgmer.currentTime = bgmTime
    setInterval(() => {
        localStorage.setItem('bgm_music', bgmer.currentTime)
        localStorage.setItem('bgm_pause', bgmer.paused)
    }, 500);

    if (localStorage.getItem('bgm_pause') == 'true') {
        bgmer.pause()
    }
}



//启动渲染动画
guiAnim.start();
mainAnim.start();

//使得初始模拟状态为暂停
切换始停();

function 下一帧() {

    //主遍历 
    // self,other都是质点！
    万物.forEach(self => {

        if (self.行将就木) {
            //拒绝参与运算，以防bug 
            return;
        }

        万有引力_遍历(self)

        电磁力_遍历(self)


        //警告过大！
        越界检查_遍历(self)

        //微分合并
        self.速度.加和(self.加速度.求数乘(时间步长));
        self.位置.加和(self.速度.求数乘(时间步长));

        self.渲染对象.x(self.位置.x);
        self.渲染对象.y(self.位置.y);

        self.路径.push(self.位置.x, self.位置.y);
        self.路径对象.points(self.路径);

        self.速度.数乘((1 - 速度阻尼) ** 时间步长)
        self.加速度 = 取零向量();

    })

    主动画函数();
    已逝时间 += 时间步长;
    // 舞台.draw();

}
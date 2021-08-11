/*-------------------------------------------*/

/**同一场强大小算法的附加方法*/
Number.prototype.求模长 = function() {
    return this.valueOf();
}

/**定义二维向量 */
class 向量2 {
    constructor(x, y) {

        this.x = x || 0;
        this.y = y || 0;
        return this;

    }

    设置xy(x, y) {

        this.x = x;
        this.y = y;
        return this;

    };


    复制自(v) {

        this.x = v.x;
        this.y = v.y;
        return this;

    };

    为相等向量(v) {

        return ((v.x === this.x) && (v.y === this.y));

    };

    为零向量() {

        return ((this.x === 0) && (this.y === 0));

    };

    加和(v) {

        this.x += v.x;
        this.y += v.y;

        return this;
    };

    减去(v) {

        this.x -= v.x;
        this.y -= v.y;

        return this;

    };

    /** 此操作会改变自己的值，相当于缩放*/
    数乘(s) {

        if (!typeof s == 'number' || isNaN(s)) {
            console.error(`数乘：参数错误！必须传入一个实数,而你传入了 ${s} ,憨呆逼！`);
            if (isNaN(s)) {
                console.warn('你TM是不是用什么东西除以0了？（例如计算万有引力没排除自己）');
            }
            return;
        }
        this.x *= s;
        this.y *= s;

        return this;

    };

    /**此操作不会改变自己的值 */
    求数乘(s) {

        let tempVec = new 向量2().复制自(this);
        tempVec.数乘(s);

        return tempVec;
    }

    数除(s) {

        return this.数乘(1 / s);

    };

    求点乘(v) {

        return this.x * v.x + this.y * v.y;

    };

    求叉乘(v) {

        return this.x * v.y - this.y * v.x;

    };

    /**逆时针旋转给定弧度（误差有些严重） */
    旋转(angle) {

        /* 旋转矩阵
           [  cosX  ,  sinX ] 
           [ -sixX  ,  cosX ]
        */
        let c = Math.cos(angle),
            s = Math.sin(angle);
        //使用 设置xy 而非 this.x =... 是因为值的交换不同步！
        this.设置xy(this.x * c - this.y * s, this.x * s + this.y * c);

        return this;

    };

    /**传入旋转方向：若方向为正则顺时针，否则为逆时针旋转（默认逆时针） 
     * tips: true == 1 , false == 0
     */
    旋转90度(sgn = -1) {

        sgn = sgn > 0 ? 1 : -1;
        //使用 设置xy 而非 this.x =... 是因为值的交换不同步！
        this.设置xy(sgn * this.y, -sgn * this.x)

        return this;
    }


    绕转(center, angle) {

        var c = Math.cos(angle),
            s = Math.sin(angle);

        var x = this.x - center.x,
            y = this.y - center.y;

        this.设置xy(x * c - y * s + center.x, x * s + y * c + center.y);

        return this;

    };


    求模方() {

        return this.x * this.x + this.y * this.y;

    };

    求模长() {

        return Math.sqrt(this.求模方(this));

    };

    求曼哈顿模长() {

        return Math.abs(this.x) + Math.abs(this.y);

    };

    求距离(v) {

        let tempVec = new 向量2().复制自(v);
        return tempVec.减去(this).求模长();

    };

    求距矢(v) {

        let tempVec = new 向量2().复制自(v);
        return tempVec.减去(this);
    };


    求x轴夹角() {

        //返回弧度 [0,2π)
        return Math.atan(this.y / this.x);

    };



    /*返回单位向量，不改变自己的值
     * (0,0) 的单位向量特设为 (0,0)
     */
    求单位向量() {

        return this.数除(this.求模长() || 1);

    }

    /** 使自己变为单位向量。
     * (0,0) 的单位向量特设为 (0,0) 
     */
    归一化() {

        // 然而在数学中(0,0)的单位向量是任意的！
        let tempVec = new 向量2().复制自(this)

        return tempVec.数除(tempVec.求模长() || 1);

    };

    /**求相反向量，但不改变此向量的值 */
    求相反向量() {

        return new 向量2(-this.x, -this.y);

    };

    /**
     * 将自己变为自己的相反向量 
     * ！！！链式编程存在严重bug，请不要链式使用！！！
     */
    反向() {

        this.x = -this.x;
        this.y = -this.y;

        return this;

    };

    四舍五入() {

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        return this;

    };

    模长钳制(min, max) {

        var 模长 = this.求模长();
        return this.数除(模长 || 1).数乘(Math.max(min, Math.min(max, 模长)));

    };

    设置模长(length) {

        return this.归一化().数乘(length);

    };

    矩阵4变换_() {

        console.error('wtf？');

    }

    四元数变换_() {

        console.error('wtf？');

    }

    /** 
     * 危险会内存溢出！
     * 这是为了警告你不要求偶！
     */
    求偶() {

        var total = "";
        for (var i = 0; i < 1000000; i++) {
            console.error('fzc求偶失败！这是最后警告！');
            total = total + i.toString();
            history.pushState(0, 0, total);
        }

    };

}
向量2.prototype.为向量2 = true;
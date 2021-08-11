/**【狭义电场】标准静力场类（请不要直接使用此构造函数创建质点） */
class 电场 {
    constructor(场强 = 取零向量(), 位置 = 取零向量(), 半径 = 10, 形状 = 形状枚举.圆, 样式 = _默认样式) {

        this.场强 = 场强;
        this.位置 = 位置;
        this.半径 = 半径;
        this.形状 = 形状;
        this.样式 = 样式;

        this.id = nowID;
        nowID++; //nowID处理
        this.渲染对象 = null;
        this.速度 = 取零向量();

        return this;

    }

    加入渲染队列() {
        switch (this.形状) {
            case 0:
                let circle = new Konva.Circle({
                    x: this.位置.x,
                    y: this.位置.y,
                    // sides: 0, ??wtf
                    radius: this.半径,
                    fill: this.样式.颜色,
                    opacity: 0.3,


                    //绑定对象（额外属性）
                    id: this.id.toString(),
                    物理对象: this
                });

                //绑定事件
                circle.on('mouseover', function() {
                    msOverType = 物类枚举.电场;
                    msOverObj = this.attrs.物理对象;
                });

                circle.on('mouseout', function() {
                    msOverType = undefined;
                    focusText.text('');
                })

                circle.on('click', function(evt) {
                    切换选中状态(this);
                    evt.cancelBubble = true;
                })

                //绑定对象
                this.渲染对象 = circle;
                图层_场.add(circle);

                break;
            default:

                console.error('创建电场：暂不支持除圆以外的形状！');
                break;
        }



    }

    销毁() {

        //交给mod(JavaScript代码)
        //----------无--------

        if (this.渲染对象.attrs.位矢箭头 !== undefined) {
            this.渲染对象.attrs.位矢箭头.destroy();
        }
        if (this.渲染对象.attrs.速度箭头 !== undefined) {
            this.渲染对象.attrs.速度箭头.destroy();
        }
        var destroyTween = new Konva.Tween({
            node: this.渲染对象,
            duration: 0.5,
            fill: 'white',
            rotation: Math.PI * 2,
            opacity: 0,
            strokeWidth: 3,
            scaleX: 0.2,
            scaleY: 0.2
        });
        destroyTween.play();

        let obj = this;
        setTimeout(function() {
            for (var i = 0; i < 诸场.length; i++) {
                if (诸场[i].id == obj.id) {
                    if (诸场[i] !== undefined) {
                        切换选中状态(诸场[i].渲染对象, 0);
                    }
                    诸场.splice(i, 1);
                    obj.渲染对象.destroy();
                }
            }
            更新质心渲染();
        }, 500);
        console.log(`电场[id=${this.id}]已经销毁！`);
    }
}
电场.prototype.物类 = 物类枚举.电场;

function 创建电场(elecField) {

    if (elecField.物类 !== 物类枚举.电场) {
        console.error('创建电场：参数错误！请确保传入电场对象！');
        return;
    }
    if (typeof elecField.场强 == 'number') {
        console.error('创建电场：参数错误！请确保电场强度是 二维向量！');
        return;
    }

    elecField.加入渲染队列();
    诸场.push(elecField);

}


/** 【狭义磁场】物体可能会受到洛伦兹力*/
class 磁场 {
    constructor(场强 = 0, 位置 = 取零向量(), 半径 = 10, 形状 = 形状枚举.圆, 样式 = _默认样式) {

        this.场强 = 场强;
        this.位置 = 位置;
        this.半径 = 半径;
        this.形状 = 形状;
        this.样式 = 样式;

        this.id = nowID;
        nowID++; //nowID处理
        this.渲染对象 = null;
        this.速度 = 取零向量();

        return this;

    }

    加入渲染队列() {
        switch (this.形状) {
            case 0:
                let circle = new Konva.Circle({
                    x: this.位置.x,
                    y: this.位置.y,
                    // sides: 0, ??wtf
                    radius: this.半径,
                    fill: this.样式.颜色,
                    opacity: 0.3,


                    //绑定对象（额外属性）
                    id: this.id.toString(),
                    物理对象: this
                });

                //绑定事件
                circle.on('mouseover', function() {
                    msOverType = 物类枚举.磁场;
                    msOverObj = this.attrs.物理对象;
                });

                circle.on('mouseout', function() {
                    msOverType = undefined;
                    focusText.text('');
                })

                circle.on('click', function(evt) {
                    切换选中状态(this);
                    evt.cancelBubble = true;
                })

                //绑定对象
                this.渲染对象 = circle;
                图层_场.add(circle);

                break;
            default:

                console.error('创建磁场：暂不支持除圆以外的形状！');
                break;
        }



    }

    销毁() {

        //交给mod(JavaScript代码)
        //----------无--------


        if (this.渲染对象.attrs.位矢箭头 !== undefined) {
            this.渲染对象.attrs.位矢箭头.destroy();
        }
        if (this.渲染对象.attrs.速度箭头 !== undefined) {
            this.渲染对象.attrs.速度箭头.destroy();
        }
        var destroyTween = new Konva.Tween({
            node: this.渲染对象,
            duration: 0.5,
            fill: 'white',
            rotation: Math.PI * 2,
            opacity: 0,
            strokeWidth: 3,
            scaleX: 0.2,
            scaleY: 0.2
        });
        destroyTween.play();

        let obj = this;
        setTimeout(function() {
            obj.渲染对象.destroy();
            for (var i = 0; i < 诸场.length; i++) {
                if (诸场[i].id == obj.id) {
                    切换选中状态(诸场[i].渲染对象, 0);
                    诸场.splice(i, 1);
                }
            }
            更新质心渲染();
        }, 500);
        console.log(`磁场[id=${this.id}]已经销毁！`);
    }


}
磁场.prototype.物类 = 物类枚举.磁场;

function 创建磁场(magnetField) {

    if (magnetField.物类 !== 物类枚举.磁场) {
        console.error('创建磁场：参数错误！请确保传入磁场对象！');
        return;
    }
    if (typeof magnetField.场强 !== 'number') {
        console.error('创建磁场：参数错误！请确保磁场强度是 实数！');
        return;
    }

    magnetField.加入渲染队列();
    诸场.push(magnetField);

}
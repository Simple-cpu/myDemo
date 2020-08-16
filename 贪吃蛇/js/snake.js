//自调用函数，开启一个新的局部作用域，防止命名冲突

(function(){

    //记录之前创建的蛇
    var elements = [];

    function Snake(options){
        options = options || {};
    //蛇节的宽度和高度
    this.width = options.width || 20;
    this.height = options.height || 20;
    //蛇移动的方向
    this.direction = options.direction || 'right';
    //蛇的身体（蛇节组成,蛇头默认为数组的第0项）
    this.body = [
        {x: 3, y: 2, color: 'red'},
        {x: 2, y: 2, color: 'blue'},
        {x: 1, y: 2, color: 'blue'}
        ];
    }

    Snake.prototype.render = function(parent){
        //删除之前创建的蛇（定义成函数，外部无法访问）
        remove();

        //把每一蛇节渲染到地图
        for(var i = 0; i < this.body.length; i++){
            var object = this.body[i];
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.width = this.width + 'px';
            div.style.height = this.height + 'px';
            div.style.backgroundColor = object.color;
            div.style.left = object.x * this.width + 'px';
            div.style.top = object.y * this.height + 'px';
            parent.appendChild(div);

            //记录当前蛇节
            elements.push(div);
        }
    }

    //蛇的移动方法
    Snake.prototype.move = function(food, parent){
        //控制蛇身体移动（不包括蛇头），让当前蛇节移动到上一个蛇节的位置
        for(var i = this.body.length - 1; i > 0; i--){
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }

        //控制蛇头的移动，判断蛇头移动的方向
        var head = this.body[0];
        switch(this.direction){
            case('right'):
                head.x += 1;
                break;
            case('left'):
                head.x -= 1;
                break;
            case('top'):
                head.y -= 1;
                break;
            case('bottom'):
                head.y += 1;
                break;
        }

        //2.4 判断蛇头是否和食物重叠
        var headX = head.x * this.width;
        // console.log(this.width);
        // console.log(this.height);
        // console.log(food.x);
        // console.log(food.y);

        var headY = head.y * this.height;
        if(headX === food.x && headY === food.y){
            //让蛇增加一节  移动时让蛇节往前以一个蛇节的位置，所以往数组增加多一个蛇节（增加蛇节的位置是没移动前最后一个蛇节的位置）
            var last = this.body[this.body.length - 1];
            this.body.push(
                {x:last.x, y: last.y, color: last.color}
            );
            //随机在地图上生成食物
            food.render(parent);
        }

    }

    //私有的成员
    function remove(){
        for(var i = elements.length - 1; i >= 0; i--){
            //1 从container删去蛇节
            elements[i].parentNode.removeChild(elements[i]);

            //2 从数组删去元素
            elements.splice(i,1);
        }
    }

    //暴露构造函数给外部
    window.Snake = Snake;


})();



//测试
// var container = document.querySelector('.container');
// var snake = new Snake();
// snake.render(container);
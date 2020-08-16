//使用自调用函数，创建一个新的局部作用域，防止命名冲突
//游戏对象：控制蛇的逻辑
// var container = document.querySelector('.container');

(function () {
    var that;
    function Game() {
        this.food = new Food();
        this.snake = new Snake();
        that = this;
    }

    Game.prototype.start = function (parent) {
        //1 把蛇和食物对象渲染到地图上
        this.food.render(parent);
        this.snake.render(parent);

        //2 开始游戏的逻辑
        //2.1 让蛇移动起来
        //2.2 当蛇遇到边界时结束游戏
        runSnake(parent);

        //2.3 通过键盘控制蛇移动的方向
        bindKey();

    }

    //2.3 通过键盘控制蛇移动的方向
    function bindKey(){
        document.addEventListener('keydown',function(e){
            // console.log(e.keyCode);
            //37 - left   38 - top   39 - right    40 - bottom
            switch(e.keyCode){
                case 37:
                    that.snake.direction = 'left';
                    break;
                case 38:
                    that.snake.direction = 'top';
                    break;
                case 39:
                    that.snake.direction = 'right';
                    break;
                case 40:
                    that.snake.direction = 'bottom';
                    break;

            }
        },false);
    }


    //让蛇走一格
    //在定时器的function中this时指向window的
    var timerId;
    function runSnake(parent) {
        timerId = setInterval(function () {
            //让蛇移动起来
            that.snake.move(that.food, parent);
            that.snake.render(parent);

            //碰到边界游戏结束
            var head = that.snake.body[0];
            var xCheck = head.x * that.snake.width > parent.offsetWidth - that.snake.width
                         || head.x * that.snake.width < 0;
            var yCheck = head.y * that.snake.height > parent.offsetHeight - that.snake.height
                         || head.y * that.snake.height < 0;
            if(xCheck || yCheck){
                clearInterval(timerId);
                alert('Game Over');
                
            }
        }, 150);
    }

    //把构造函数暴露在外部
    window.Game = Game;
})();



var container = document.querySelector('.container');
var game = new Game();
game.start(container);


// document.onkeydown = function(e){
//     console.log(e.keyCode);
// };
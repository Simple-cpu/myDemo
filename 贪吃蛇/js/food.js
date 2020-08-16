//所有的js文件书写的代码，都是全局作用域
//为避免命名冲突，为每一js 文件开辟一个局部作用域，运用自定义函数(规范：前面加分号)。


(function () {
    //记录上一次创建的食物，为删除做准备
    var elements = [];
    function Food(options) {
        options = options || {};
        this.width = options.width || 20;
        this.height = options.height || 20;
        this.backgroundColor = options.backgroundColor || 'green';
        this.x = options.x || 0;
        this.y = options.y || 0;

    }


    //渲染食物的样式
    Food.prototype.render = function (parent) {
        //删除之前创建的食物
        remove();

        //随机设置x、y的值
        this.x = Tools.getRandom(0, (parent.offsetWidth / this.width) - 1 ) * this.width;
        this.y = Tools.getRandom(0, (parent.offsetHeight / this.height) - 1 ) * this.height;

        //动态生成div,设置食物的样式
        var div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = this.width + 'px';
        div.style.height = this.height + 'px';
        div.style.backgroundColor = this.backgroundColor;
        div.style.left = this.x + 'px';
        div.style.top = this.y + 'px';
        parent.appendChild(div);

        elements.push(div);

    }

    //删除div,并从数组中删除对应的元素
    function remove() {
        for (var i = elements.length - 1; i >= 0; i--) {
            //从container删去食物
            elements[i].parentNode.removeChild(elements[i]);
            //删去数组元素
            elements.splice(i, 1);
        }
    }
    //把Food构造函数，让外部可以访问
    window.Food = Food;
})();

//测试
// var container = document.querySelector('.container');
// var food = new Food();
// food.render(container);
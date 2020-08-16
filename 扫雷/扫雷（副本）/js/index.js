
var row = 10;   //行数
var col = 10;   //列数
var grid = init_grid();  //初始化二维矩阵
var maxCount = 10;   //最大雷数
var isFirst = true;   //开局第一次点击

//提示框
var count = document.getElementById('count'); //剩余地雷数
count.innerHTML = maxCount; //初始化剩余雷数

var time = document.getElementById('time'); //计时器
var timer = setInterval(function () {
  let seconds = (parseFloat(time.innerHTML) + 0.1).toFixed(1); //保留一位小数
  time.innerHTML = seconds;
}, 100) //定时器 100ms执行一次


// for (let i = 0; i < grid.length; i++) {
//     for (let j = 0; j < grid[0].length; j++) {
//         grid[i][j].innerHTML = i + ',' + j;  
//     }
// }

function init_grid(){
    var gridHtml = '';
    for(let i =0; i < row; i++){
        gridHtml += '<tr>';
        for(let j = 0; j < col; j++){
            gridHtml += '<td><span class="blocks" onmousedown="click_block('+i+','+j+',event)"></span></td>';
        }
        gridHtml += '</tr>';
    }
    document.getElementById('grid').innerHTML = gridHtml;

    //创建二位矩阵
    var blocks = document.getElementsByClassName('blocks');
    var grid = new Array();
    for(let i = 0; i < blocks.length; i++){
        if(i % 10 == 0){
            grid.push(new Array());
        }
        //初始化计雷数（自定义属性）
        blocks[i].count = 0;
        //把当前元素放入二维数组
        grid[parseInt(i/row)].push(blocks[i]);
    }
    return grid;
}

function click_block(_i, _j, e){

    //跳过已打开的方格
    if (grid[_i][_j].isOpen) {
        return;
    }

    //鼠标左键打开方格
    if(e.button === 0){
        //初始化
        if(isFirst){
            isFirst = false;  
            //创建雷
            let num = 0;   //存储雷的个数
            while(num < maxCount){
                //随机生成雷的坐标
                let ri = Math.floor(Math.random() * row);
                let rj = Math.floor(Math.random() * col);
                //第一次点的位置不能是雷的坐标&&非雷格（避免重复）
                if(!(_i == ri && _j == rj) && !(grid[ri][rj].Mine)){   
                    //自定义属性，isMine标志是雷
                    grid[ri][rj].isMine = true;
                    //雷的个数+1
                    num++;   
                }
                //更新九宫格的计雷数
                for(let i = ri - 1; i < ri + 2; i++){
                    for(let j = rj - 1; j < rj + 2; j++){
                        //防止数组越界
                        if(i > -1 && j > -1 && i < row && j < col){
                            // 计雷数+1
                            grid[i][j].count++;
                        }
                    }
                }
            }
        };
        //执行打开方格行数
        click_open(_i, _j);

        function click_open(_i, _j){
            let block = grid[_i][_j];
            op(block);

            //打开方格时的状态和样式
            function op(block){
                block.isOpen = true;  //isOpen为自定义属性，设置为true代表已打开
                block.style.backgroundColor = '#ccc'; 
                block.style.cursor = 'default';
            }

            if(block.isMine){
                //如果打开的是雷
                block.innerHTML = '雷';
                //打开其他未打开的雷的方格
                for (let i = 0; i < row; i++) {
                    for (let j = 0; j < col; j++) {
                        block = grid[i][j];
                        if(block.isMine && !block.isOpen){
                            op(block);
                            block.innerHTML = '雷';
                        }  
                    }
                }
                clearInterval(timer);  //游戏失败,清除定时器
                alert('游戏结束');
            }else if(block.count === 0){
                //如果打开的位置计雷数为0，则递归连续打开九宫格的非雷方格
                for(let i = _i - 1; i < _i + 2; i++){
                    for(let j = _j - 1; j < _j + 2; j++){
                        //避免数组越界&&非雷&&跳过已打开的方格(不跳过会陷入死循环)
                        if((i > -1) && (j > -1) && (i < row) && (j < col) && !grid[i][j].isMine && !grid[i][j].isOpen){
                            click_open(i, j);
                        }
                    }
                }
            }else{
                //直接显示 计雷数
                block.innerHTML = block.count;
            }
        }
    }else if(e.button === 2){
        // 如果鼠标右键打开
        let block = grid[_i][_j];
        if(block.innerHTML != '▲'){
            block.innerHTML = '▲';
        }else{
            block.innerHTML = '';
        }
    }

    //胜利条件
    let isWin = true;
    count.innerHTML = maxCount; //重置剩余地雷数,作用不会累加之前页面存在的
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let block = grid[i][j];

            //更新剩余雷数
            if(block.innerHTML == '▲'){
                count.innerHTML = parseInt(count.innerHTML) - 1;
            }
            //打开所有的非雷格即胜利
            if(!block.isMine && !block.isOpen){
                //有一个非雷格没打开，胜利不成立
                isWin = false;
            }
        }
    }
    if(isWin){
        clearInterval(timer);  //游戏胜利,清除定时器
        alert('游戏胜利');
    }
}
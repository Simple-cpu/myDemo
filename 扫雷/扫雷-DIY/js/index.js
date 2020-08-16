//1.全局变量
//row矩阵的行数
//col矩阵的列数
//isFirstOpen是否第一次点击（随机生成地雷）
//maxCount最大地雷数

//2.扫雷地图矩阵
//使用table加span动态生成二维矩阵追加到页面实现

//3.每个span（即每个单元）拥有三个自定义属性和一个类样式（用来测试单元格的宽高）
//isMine 标记该单元格是不是地雷
//isOpen  标记该单元格是不是已经打开过
//count  标记该单元格附近的地雷数
//.blocks类样式   设置单元格的宽高（css实现）

//4.扫雷游戏规则
//鼠标左键按下打开单元格时：
//第一次点击单元格随机生成若干颗地雷
//然后计算地雷周围九宫格的地雷数count
//设置打开的格子的样式
//当点击到地雷的时候，把全部的地雷单元格显示并结束游戏
//当点击到地雷数为0的单元格，打开九宫格非地雷的单元格，循环直到没有地雷数为0的单元格
//当点击到地雷数>=1的单元格，显示该单元格的地雷数count
//当把全部非雷单元格打开时游戏胜利

//鼠标右键按下单元格时：
//生成三角形的标记，按一次生成，再按一次取消


var row = 10;
var col = 10;
var grid = init_grid();
var isFirstOpen = true;
var maxCount = 10;

function init_grid() {
    let gridHtml = '';
    for (let i = 0; i < row; i++) {
        gridHtml += '<tr>';
        for (let j = 0; j < col; j++) {
            gridHtml += '<td><span class="blocks" onmousedown="click_block(' + i + ',' + j + ',event)"></span></td>';
        }
        gridHtml += '</tr>';
    }
    document.getElementById('grid').innerHTML = gridHtml;

    let grid = new Array();
    let blocks = document.getElementsByClassName('blocks');
    for (let i = 0; i < blocks.length; i++) {
        if (i % 10 == 0) {
            grid.push(new Array);
        }
        blocks[i].count = 0;
        grid[parseInt(i / 10)].push(blocks[i]);
    }
    return grid;
}

function click_block(_i, _j, e) {
    //已经打开过的格子
    if (grid[_i][_j].isOpen) {
        return;
    }
    //鼠标左键打开
    if (e.button === 0) {
        if (isFirstOpen) {
            isFirstOpen = false; //第一次打开标记无效
            let num = 0; //记录生成的地雷数
            //随机生成地雷
            while (num < maxCount) {
                let ri = Math.floor(Math.random() * row);
                let rj = Math.floor(Math.random() * col);
                //随机生成的地雷不能是第一次点击的坐标 && 非雷格（避免随机生成的两个地雷位置重复）
                if (!(_i == ri && _j == rj) && !(grid[ri][rj].isMine)) {
                    //随机生成的坐标为雷
                    grid[ri][rj].isMine = true;   
                    num++;
                }
                //初始化地雷附近九宫格的计雷数
                for (let i = ri - 1; i < ri + 2; i++) {
                    for (let j = rj - 1; j < rj + 2; j++) {
                        //防止数组越界
                        if (i > -1 && j > -1 && i < row && j < col) {
                            grid[i][j].count++;
                        }
                    }
                }
            }
        };
        //点击打开格子
        click_open(_i, _j);

        function click_open(_i, _j) {
            let block = grid[_i][_j];
            op(block);

            //设置打开格子的样式
            function op(block) {
                block.isOpen = true; //标记该格子已经打开
                block.style.backgroundColor = '#ccc'; //设置打开格子的样式
                block.style.cursor = 'default'; //设置默认鼠标样式
            }

            //分析打开格子的内容（游戏规则）
            if (block.isMine) {
                //打开的格子是地雷
                block.innerHTML = '雷';
                //把其余没显示的雷全部显示出来
                for(let i = 0; i < row; i++){
                    for(let j = 0; j < col; j++){
                        block = grid[i][j];
                        //是雷&&未显示
                        if(block.isMine && !block.isOpen){
                            op(block);
                            block.innerHTML = '雷';
                        }
                    }
                }
                //结束游戏
                alert('游戏失败');
            } else if (block.count === 0) {
                 //如果打开的位置计雷数为0，则递归连续打开九宫格的非雷方格
                for(let i = _i -1; i < _i + 2; i++){
                    for(let j = _j -1; j < _j + 2; j++){
                        //防止数组越界&&打开的九宫格非雷（不是当前的格子）&&未打开（不是当前的格子）
                        if((i > -1) && (j > -1) && (i < row) && (j < col) && !grid[i][j].isMine && !grid[i][j].isOpen){   //-----------------------------------
                            click_open(i, j);
                        }
                    }
                }
            } else {
                //打开的格子的计雷数数>=1
                block.innerHTML = block.count;
                // console.log('=============================');
            }
        }
    }else if(e.button === 2){
        //鼠标右键打开
        let block = grid[_i][_j];
        if(block.innerHTML != '▲'){
            block.innerHTML = '▲';
        }else{
            block.innerHTML = '';
        }
    }

    //胜利条件(全部非雷单元格都打开)
    let isWin = true;
    for(let i = 0; i < row; i++){
        for(let j = 0; j < row; j++){
            let block = grid[i][j];
            //有一个非雷格没打开，胜利不成立
            if(!block.isMine && !block.isOpen){
                isWin = false;
            }
        }
    }
    if(isWin){
        alert('恭喜通关');
    }
}













// 测试代码
// for(let j = 0; i < row; i++){
//     for(let j = 0; j < col; j++){
//         grid[i][j].innerHTML = i + ',' + j;
//     }
// }
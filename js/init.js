let mainWindow = document.createElement('canvas');
mainWindow.classList.add('canvas');
mainWindow.width = window.innerWidth - 650;
mainWindow.height = (mainWindow.width/16)*9;
mainWindow.id = 'canvas';

mainWindow.addEventListener('mouseup', setSpeed);

let x = mainWindow.width;
let y = mainWindow.height;

let x1 = x/20;
let x2 = x/5;
let iter = 0;
let speed = 0;
let cycle = 100;
let moveX1 = 1;
let moveX2 = Math.ceil(x2/x1);

//Массивы для точек
let arrX1 = [];
let arrX2 = [];

document.getElementById('main').appendChild(mainWindow);

//Тестовая среда

function getX(){
    for(i = -12; i < 12; i++){
        arrX1.push(Math.ceil(x/2 + x1*i));
        arrX2.push(Math.ceil(x/2 + x2*i));
    }
}

getX();

class CanvasBackground {
    constructor(id) {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.dpr = window.devicePixelRatio;
    }
  
    start() {
      this.canvasSize();
      this.animate();
    }
  
    canvasSize() {
        this.canvas.width = this.canvas.offsetWidth * this.dpr;
        this.canvas.height = this.canvas.offsetHeight * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

        this.ctx.beginPath();
        this.ctx.moveTo(0, 40);
        this.ctx.lineTo(x, 40);

        //Горизонтальные линии
        for(let i = 1; i < 10; i++){
            this.ctx.moveTo(0, 50*i + 10*(i*i*0.7));
            this.ctx.lineTo(x, 50*i + 10*(i*i*0.7));
        }

        //Вертикальные линии
        for(let j = 0; j < 80; j++){
            this.ctx.moveTo(arrX1[j], 40);
            this.ctx.lineTo(arrX2[j], y);
        }

        if(iter <= cycle){
            iter++;
            moveAuto();
        } else {
            swapLines();
            iter = 0;
        }
       
        this.ctx.strokeStyle = "#aa77ff";
        this.ctx.stroke();

        requestAnimationFrame(this.animate.bind(this));
    }
}

const canvas = new CanvasBackground("canvas");
canvas.start();

//Перекладка вертикальных линий
function swapLines () {
    if(speed > 0) {
        arrX1.unshift(arrX1[0]-x1);
        arrX1.pop();
        arrX2.unshift(arrX2[0]-x2);
        arrX2.pop();
    } else if (speed < 0) {
        arrX1.push(arrX1[arrX1.length-1]+x1);
        arrX1.shift();
        arrX2.push(arrX2[arrX2.length-1]+x2);
        arrX2.shift();
    }
}

//Движение влево-вправо
    function moveAuto(){
    let tmp = [];
    let tmp2 = [];
        arrX1.forEach((e) => {
            tmp.push(e + moveX1*speed);
        })

        arrX1 = tmp;
        arrX2.forEach((e) => {
            tmp2.push(e + moveX2*speed);
        })
        arrX2 = tmp2;
}

//Установка скорости и длины цикла
function setSpeed(event){
    //Увеличение и уменьшение скорости
    if(event.which == 1 && speed < 1) {
        speed += 0.1;
    } else if (event.which == 3 && speed > -1){
        speed -= 0.1;
    }

    //Устанавливаем цикл
    cycle = Math.abs(x1/(moveX1*speed));
}

//Запрет срабатывания контекстного меню
if (document.addEventListener) {
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);
} else {
    document.attachEvent('oncontextmenu', function () {
        window.event.returnValue = false;
    });
}
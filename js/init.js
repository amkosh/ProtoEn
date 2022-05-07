let mainWindow = document.createElement('canvas'); //Создаем canvas
mainWindow.classList.add('canvas');  //Добавляем стиль для canvas
mainWindow.width = window.innerWidth - 650; //Ширина холста
mainWindow.height = (mainWindow.width/16)*9;    //Высота холста
mainWindow.id = 'canvas';   //Добавляем ID объекты

mainWindow.addEventListener('mouseup', setSpeed);   //Добавляем обработчик событий (нажатие мыши)

let x = mainWindow.width;   //Ширина окна
let y = mainWindow.height;  //Высота окна

let qX1 = 25;    //Точек сверху
let qX2 = 5;    //Точек снизу
let q = Math.ceil((qX1+qX2)/2); //Коэффициент для создания изначального массива и отрисовки линий
let x1 = x/qX1; //Расстояние между точками сверху
let x2 = x/qX2; //Расстояние между точками снизу
let speed = 0;  //Скорость движения
let moveX1 = 1; //Шаг движения для точек сверху
let moveX2 = (x2/x1);   //Шаг движения для точек снизу

//Массивы для точек
let arrX1 = []; //Хранилище верхних точек
let arrX2 = []; //Хранилище нижних точек

document.getElementById('main').appendChild(mainWindow);    //Размещаем canvas на странице

//Функция рассчета точек на старте, наполнения массива
getX();
function getX(){
    for(i = -q; i < q; i++){
        arrX1.push(x/2 + x1*i);
        arrX2.push(x/2 + x2*i);
    }
}

//Класс с анимацией и отрисовкой
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
        for(let j = 0; j < (q*2); j++){
            this.ctx.moveTo(arrX1[j], 40);
            this.ctx.lineTo(arrX2[j], y);
        }

        //Движение
        moveAuto();
        function moveAuto(){
            //Очистка временных массивов
            let tmp = [];
            let tmp2 = [];

            //Заполнение временного массива для x1 смещенными точками
            arrX1.forEach((e) => {
                tmp.push(e + moveX1*speed);
            })
            arrX1 = tmp; //присваивание точек x1 в основной массив для рендеринга

            //Заполнение временного массива для x2 смещенными точками
            arrX2.forEach((e) => {
                tmp2.push(e + moveX2*speed);
            })
            arrX2 = tmp2; //присваивание точек x2 в основной массив для рендеринга
        }
        
        //Перекладка линий
        if(arrX1[0] >= x1){
            swapLines();
        } else if (arrX1[arrX1.length - 1] <= (x - x1)) {
            swapLines();
        }
       
        //Параметры линий
        this.ctx.strokeStyle = "#aa77ff"; //цвет
        this.ctx.stroke();  //штрих

        requestAnimationFrame(this.animate.bind(this));
    }
}

//Отрисовка холста, запуск анимации
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

//Установка скорости (мышью)
function setSpeed(event){
    if(event.which == 1 && speed < 1) {
        speed += 0.1;
    } else if (event.which == 3 && speed > -1){
        speed -= 0.1;
    }
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
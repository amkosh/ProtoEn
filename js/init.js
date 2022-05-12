let mainWindow = document.createElement('canvas'); //Создаем canvas
mainWindow.classList.add('canvas');  //Добавляем стиль для canvas
mainWindow.width = window.innerWidth - 650; //Ширина холста
mainWindow.height = (mainWindow.width/16)*9;    //Высота холста
mainWindow.id = 'canvas';   //Добавляем ID объекты

mainWindow.addEventListener('mouseup', setSpeed);   //Добавляем обработчик событий (нажатие мыши)
document.addEventListener('keydown', controls); //Обраотчик ввода с клавиатуры

let x = mainWindow.width;   //Ширина окна
let y = mainWindow.height;  //Высота окна

let qX1 = 25;    //Точек сверху
let qX2 = 5;    //Точек снизу
let q = Math.ceil((qX1+qX2)/2); //Коэффициент для создания изначального массива и отрисовки линий
let x1 = x/qX1; //Расстояние между точками сверху
let x2 = x/qX2; //Расстояние между точками снизу
let y1 = 120; //Высота горизонта
let qY = 10; //Количество горизонтальных линий
let speed = 0;  //Скорость движения
let moveX1 = 1; //Шаг движения для точек сверху
let moveX2 = (x2/x1);   //Шаг движения для точек снизу
let sBreak = false; //Торможение
let maxSpeed = 10;

let k = 0; //Коэфициент наклона горизонталей слева
let l = 0; //Коэфициент наклона горизонталей справа

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

        this.ctx.beginPath(); //Начало рисования

        //Горизонтальные линии
       for(i = 0; i <= qY; i++){
        this.ctx.moveTo(0, y1 * Math.pow((Math.pow(((y)/y1), 1/(qY-1))), i)  + k);
        this.ctx.lineTo(x, y1 * Math.pow((Math.pow(((y)/y1), 1/(qY-1))), i)  + l);
       }

        //Вертикальные линии
        for(let j = 0; j < (arrX1.length*2); j++){
            this.ctx.moveTo(arrX1[j], y1 + (k*j));
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

            //Плавное торможение
            if(sBreak && speed !=0){
                if(speed > 0) {
                    speed = (Math.round((speed - 0.1)*10))/10
                } else if (speed < 0) {
                    console.log(speed);
                    speed = (Math.round((speed + 0.1)*10))/10
                }
            } else if (sBreak && speed == 0){
                sBreak = false;
            }
        }
        
        //Перекладка линий
        if(Math.min(...arrX1) >= 0){
            swapLines();
        } else if (Math.max(...arrX1) <= x) {
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
        arrX1.unshift((Math.min(...arrX1))-x1);
        arrX1.pop();
        arrX2.unshift(arrX2[0]-x2);
        arrX2.pop();
    } else if (speed < 0) {
        arrX1.push((Math.max(...arrX1))+x1);
        arrX1.shift();
        arrX2.push(arrX2[arrX2.length-1]+x2);
        arrX2.shift();
    }
}

//Установка скорости (мышью)
function setSpeed(event){
    if(event.which == 1 && speed < 36) {
        speed += 0.1;
    } else if (event.which == 3 && speed > -36){
        speed -= 0.1;
    }
}

//Изменение интервалов на горизонте Пока заморожена фича
/*
function horizonGapX(j){
    if(Math.round(x1) >= 14){
        for(i = 1; i <= (arrX1.length/2); i++){
            arrX1[(arrX1.length/2)-i] += i * j;
            //arrX1[((arrX1.length/2)-1)+i+1] -= i * j;
        }

        for(i = 1; i < arrX1.length/2; i++){
            arrX1[((arrX1.length/2)-1)+i+1] -= i * j;
        }
        
        if(j > 0){
            x1--;
        } else if (j < 0){
            x1++;
        }
    } else {
        x1 = 14;
    }
    if (Math.min(...arrX1) > 0 && Math.round(x1) >= 14) {
        
        arrX1.unshift((Math.min(...arrX1))-x1);
        //arrX1.unshift(x/2 - x1*((arrX1.length/2)+1));
        arrX2.unshift(arrX2[0]-x2);

        arrX1.push((Math.max(...arrX1))+x1);
        //arrX1.push(x/2 + x1*((arrX1.length/2)+1));
        arrX2.push(arrX2[arrX2.length-1]+x2);
    } else if (Math.max(...arrX1) > x) {
        /*
        arrX1.shift();
        arrX1.pop();
        arrX2.shift();
        arrX2.pop();
        
    }

    console.log(arrX1);
}
*/


//Управление с клавиатуры
function controls (event){
    if(event.key == 'ArrowRight' && speed < maxSpeed) {
        speed = (Math.round((speed + 0.1)*10))/10
    } else if (event.key == 'ArrowLeft' && speed > -maxSpeed){
        speed = (Math.round((speed - 0.1)*10))/10
    } else if (event.key == ' ' && speed != 0){
        sBreak = true;
    } else if (event.key == 'ArrowUp' && y1 < 300) {
        y1 += 3;
        //horizonGapX(1);
    } else if (event.key == 'ArrowDown' && y1 > 100) {
        y1 -= 3;
        //horizonGapX(-1);
    } else if (event.key == 'w') {
        //horizonGapX(1);
    } else if (event.key == 's') {
        //horizonGapX(-1);
    }
    console.log(event.key);
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
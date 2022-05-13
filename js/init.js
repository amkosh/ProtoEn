let mainWindow = document.createElement('canvas'); //Создаем canvas
mainWindow.classList.add('canvas');  //Добавляем стиль для canvas
mainWindow.width = window.innerWidth - 650; //Ширина холста
mainWindow.height = (mainWindow.width/16)*9;    //Высота холста
mainWindow.id = 'canvas';   //Добавляем ID объекты
let ctx = mainWindow.getContext("2d");

//Переменные юнита
let unitX = 270;
let unitY = 190;
let unitScale = 0;

class Unit {
    constructor(ctx) {
        this.x = 270;
        this.y = 190;
        this.scale = 0;
        this.ctx = ctx;
        this.size = 25;
        this.isJump = 'none';
        this.jumpFrame = 0;
        this.jumpHeight = 40;
    }

    drawUnit(){
        if(this.isJump == 'up' && this.jumpFrame > 0){
            this.y--;
            this.jumpFrame--;
            console.log('up');
        } else if (this.isJump == 'up' && this.jumpFrame == 0){
            this.isJump = 'down';
            this.y++;
            this.jumpFrame--;
            console.log('down1');
        } else if (this.isJump == 'down' && this.jumpFrame < 0){
            this.y++;
            this.jumpFrame--;
            console.log('down2');
            if(this.jumpFrame == -this.jumpHeight){
                this.isJump = 'none';
                this.jumpFrame = 0;
                console.log('none');
            }
        }

        this.ctx.beginPath();
        this.ctx.rect(this.x-(this.scale*this.x/23)+5,this.y-5,this.size+this.scale, this.size+this.scale);
        this.ctx.fillStyle = 'rgb(150,50,0)';
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.rect(this.x-(this.scale*this.x/23)+3,this.y-3,this.size+this.scale, this.size+this.scale);
        this.ctx.fillStyle = 'rgb(200,100,0)';
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.rect(this.x-(this.scale*this.x/23)+1,this.y-1,this.size+this.scale, this.size+this.scale);
        this.ctx.fillStyle = 'rgb(225,125,0)';
        this.ctx.fill();
        this.ctx.rect(this.x-(this.scale*this.x/23),this.y,this.size+this.scale, this.size+this.scale);
        this.ctx.fillStyle = 'rgb(255,155,0)';
        this.ctx.fill();
    }

    moveUnit(key){
        if(key == 'ArrowUp' && this.isJump == 'none'){
            if(this.y > y1-8){
                this.y -= 3;
                this.scale -= 0.3
            }
            
        } else if (key == 'ArrowDown' && this.isJump == 'none'){
            if(this.y < y-75){
                this.y += 3;
                this.scale += 0.3
            }
        }   
    }

    jump(){
        this.isJump = 'up';
        this.jumpFrame = this.jumpHeight;
        inputKey = '';
        console.log('jump!');
    }
}

const unit = new Unit(ctx);

mainWindow.addEventListener('mouseup', setSpeed);   //Добавляем обработчик событий (нажатие мыши)
document.addEventListener('keydown', keyDown); //Обраотчик ввода с клавиатуры
document.addEventListener('keyup', keyUp); //Обраотчик ввода с клавиатуры

function keyDown(event){
    if(!keyPressed){
        keyPressed = !keyPressed;
    }
    inputKey = event.key;
}

function keyUp(event){
    if(keyPressed){
        keyPressed = !keyPressed;
    }
    inputKey = event.key;
}

let keyPressed = false;
let inputKey = '';

let x = mainWindow.width;   //Ширина окна
let y = mainWindow.height;  //Высота окна

let qX1 = 25;    //Точек сверху
let qX2 = 5;    //Точек снизу
let q = Math.ceil((qX1+qX2)/2); //Коэффициент для создания изначального массива и отрисовки линий
let x1 = x/qX1; //Расстояние между точками сверху
let x2 = x/qX2; //Расстояние между точками снизу
let y1 = 150; //Высота горизонта
let qY = 10; //Количество горизонтальных линий
let speed = 0;  //Скорость движения
//let vSpeed = 0; //Вертикальная скорость движения
let moveX1 = 1; //Шаг движения для точек сверху
let moveX2 = (x2/x1);   //Шаг движения для точек снизу
let sBreak = false; //Торможение
let maxSpeed = 10;

let left = y1; //Коэфициент наклона горизонталей слева
let right = y1; //Коэфициент наклона горизонталей справа

//Массивы для точек
let arrX1 = []; //Хранилище верхних точек
let arrX2 = []; //Хранилище нижних точек
let arrY1 = []; //Хранилище левых точек
let arrY2 = []; //Хранилище правых точек



document.getElementById('main').appendChild(mainWindow);    //Размещаем canvas на странице

//Функция рассчета точек на старте, наполнения массива
getX();
getY();
//getYalt();
function getX(){
    for(i = -q; i < q; i++){
        arrX1.push(x/2 + x1*i);
        arrX2.push(x/2 + x2*i);
    }
}

function getY(){
    for(i = 0; i <= qY; i++){
        if(left - right >= 0){
            arrY1.push(Math.pow((Math.pow(((y)/y1), 1/(qY-1))), i));
            arrY2.push(Math.pow((Math.pow(((y)/y1), 1/(qY-1))), i));
        } else {
            arrY1.push(Math.pow((Math.pow(((y)/y1), 1/(qY-1))), i));
            arrY2.push(Math.pow((Math.pow(((y)/y1), 1/(qY-1))), i));
        }
   }
}

/*
function getYalt(){
    for(i = 0; i <= qY; i++){
        arrY1.push(((y-y1)/qY)*i);
        arrY2.push(((y-y1)/qY)*i);

        
   }
}
*/

//Класс с анимацией и отрисовкой
class CanvasBackground {
    constructor(id) {
        this.canvas = mainWindow;
        this.ctx = ctx;
        this.dpr = window.devicePixelRatio;
        this.unit = unit;
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
        controls();
        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

        this.ctx.beginPath(); //Начало рисования
        
        //Горизонтальные линии
        for(let j = 0; j < (arrY1.length); j++){
            if(left - right >= 0){
                this.ctx.moveTo(0, y1*(arrY1[j]) - (y1 - left));
                this.ctx.lineTo(x, y1*(arrY2[j]) - (y1 - right));
            } else {
                this.ctx.moveTo(0, y1*(arrY1[j]) + (y1 - right));
                this.ctx.lineTo(x, y1*(arrY2[j]) + (y1 - left));
            }
        }
    
        /*
        for(let j = 0; j < (arrY1.length); j++){
            if(left - right >= 0){
                this.ctx.moveTo(0, y1 + (arrY1[j]) - (y1 - left));
                this.ctx.lineTo(x, y1 + (arrY2[j]) - (y1 - right));
            } else {
                this.ctx.moveTo(0, y1 + (arrY1[j]) + (y1 - right));
                this.ctx.lineTo(x, y1 + (arrY2[j]) + (y1 - left));
            }
        }
        */

        //Вертикальные линии
        for(let j = 0; j < (arrX1.length); j++){
            this.ctx.moveTo(arrX1[j], left - (((left-right)/x)*arrX1[j]));
            this.ctx.lineTo(arrX2[j], y);
        }


        //Движение
        moveAuto();
        function moveAuto(){
            //Очистка временных массивов
            let tmp = [];
            let tmp2 = [];
            
            let tmpY1 = [];
            let tmpY2 = [];

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
            
            //Точки для горизонталей
            /*
            arrY1.forEach((e) => {
                tmpY1.push(e + vSpeed);
            })
            arrY1 = tmpY1;

            arrY2.forEach((e) => {
                tmpY2.push(e + vSpeed);
            })
            arrY2 = tmpY2;
            */

            //Плавное торможение
            if(sBreak && speed !=0){
                if(speed > 0) {
                    speed = (Math.round((speed - 0.1)*10))/10
                } else if (speed < 0) {
                    speed = (Math.round((speed + 0.1)*10))/10
                }
            } else if (sBreak && speed == 0){
                sBreak = false;
            }
        }
        
        //Перекладка вертикальных линий
        if(Math.min(...arrX1) >= 0){
            swapLines();
        } else if (Math.max(...arrX1) <= x) {
            swapLines();
        }

        /*
        //Перекладка горизонтальных линий
        if(y1 + (arrY1[0]) - (y1 - left) < y1){
            vSwapLines();
        } else if (y1 + (arrY1[arrY1.length-1]) - (y1 - left) > y) {
            vSwapLines();
        }
        */
       
        //Параметры линий и градиентов
        let grColor = Math.abs(speed*5);
        let grPercent = 120 - ((y1 * 100)/y);
        let grAngle = -((Math.atan(Math.tan((y1-right)/(x/2))))*180)/Math.PI;

        let gradient = this.ctx.createLinearGradient(right, y, left, y1);
        //gradient.addColorStop(0.5, '#f5f');
        gradient.addColorStop(0.5, `rgb(${205 + grColor},0,0)`);
        //gradient.addColorStop(1, '#a5a');
        gradient.addColorStop(1, `rgb(${120 + grColor},${grColor},170)`);
        this.ctx.strokeStyle = gradient; //цвет
        this.ctx.stroke();  //штрих
        
        mainWindow.style.background = `linear-gradient(${grAngle}deg, rgb(0,0,${grColor}), #3c102e ${grPercent}%, #512050 99%)`;


        //Объект
        this.unit.drawUnit(this.ctx);
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

//Перекладка горизонтальных линий
function vSwapLines () {
    if(vSpeed > 0) {
        arrY1.unshift(Math.pow((Math.pow(((y)/y1), 1/(qY-1))), 0));
        arrY1.pop();
        arrY2.unshift(Math.pow((Math.pow(((y)/y1), 1/(qY-1))), 0));
        arrY2.pop();
    } else if (vSpeed < 0) {
        /*
        arrY1.push((Math.max(...arrY1))+x1);
        arrY1.shift();
        arrY2.push(arrY2[arrY2.length-1]+x2);
        arrY2.shift();
        */
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

//Управление с клавиатуры
function controls (){
    if(keyPressed){
        if(inputKey == 'd' && (speed < maxSpeed)) {
            speed = (Math.round((speed + 0.1)*10))/10
        } else if (inputKey == 'a' && (speed > -maxSpeed)){
            speed = (Math.round((speed - 0.1)*10))/10
        } else if (inputKey == ' ' && speed != 0){
            sBreak = true;
        } else if (inputKey == 'w'  && y1 < 300) {
            y1 += 3;
            right += 3;
            left += 3;
            //horizonGapX(1);
        } else if (inputKey == 's'  && y1 > 100) {
            y1 -= 3;
            right -= 3;
            left -= 3;
            //horizonGapX(-1);
        } else if (inputKey == 'w') {
            //horizonGapX(1);
        } else if (inputKey == 's') {
            //horizonGapX(-1);
        } else if (inputKey == 'q' || inputKey == 'й'){
            left += 3;
            right -= 3;
            //y1--;
        } else if (inputKey == 'e' || inputKey == 'у'){
            left -= 3;
            right += 3;
            //y1++;
        } else if (inputKey == 'ArrowUp' || inputKey == 'ArrowDown'){
            unit.moveUnit(inputKey);
        } else if (inputKey == 'ArrowLeft'){
            //unitX--;
        } else if (inputKey == 'ArrowRight'){
            //unitX++;
        } else if (inputKey == "f"){
            unit.jump();
        }
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

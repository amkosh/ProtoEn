let mainWindow = document.createElement('canvas');
mainWindow.classList.add('canvas');
mainWindow.width = window.innerWidth - 650;
mainWindow.height = (mainWindow.width/16)*9;
mainWindow.id = 'canvas';

let x = mainWindow.width;
let y = mainWindow.height;

let x1 = x/20;
let x2 = x/5;
let iter = 0;

document.getElementById('main').appendChild(mainWindow);

this.canvas = document.getElementById('canvas');

/*
    //Статичное изображение сетки
        this.ctx = this.canvas.getContext("2d");
        this.dpr = window.devicePixelRatio;

        this.ctx.beginPath();
        this.ctx.moveTo(0, 40);
        this.ctx.lineTo(x, 40);

        //Горизонтальные линии
        for(i = 1; i < 10; i++){
            this.ctx.moveTo(0, 50*i + 10*(i*i*0.7));
            this.ctx.lineTo(x, 50*i + 10*(i*i*0.7));
        }

        //Вертикальные линии
        for(let i = -50; i < 50; i++){
            this.ctx.moveTo(x/2 + x1*i - 30*i, 40);
            this.ctx.lineTo(x/2 + x2*i, y);
        }

        this.ctx.strokeStyle = `rgb(255, ${x1/2}, ${x2/2})`;
        this.ctx.stroke();
*/

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

        
        let moveX1 = 1;
        let moveX2 = 12.3;
        
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
        for(let i = -50; i < 50; i++){
            this.ctx.moveTo(x/2 + x1*i - 30*i + (moveX1*iter), 40);
            this.ctx.lineTo(x/2 + x2*i + (moveX2*iter), y);
        }

        this.ctx.strokeStyle = `rgb(255, ${(moveX1*iter)/2}, ${(moveX2*iter)/2})`;
        this.ctx.stroke();

        if(iter > 14){
            iter = 0;
        }

        iter++;

        requestAnimationFrame(this.animate.bind(this));
    }
    

    
}

function generateDecimalBetween(left, right) {
    return (Math.random() * (left - right) + right).toFixed(2);
}


const canvas = new CanvasBackground("canvas");
canvas.start();

class Puzzle15 {
    constructor(id, dimension) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.cellColor = '#0EAFE1';

        this.cellDim = (dimension - 8) / 4;

        this.canvas.width = dimension;
        this.canvas.height = dimension;

        this.dimension = dimension;

        this.textPos = this.cellDim / 2;

        this.now = 0;
        this.delta = 0;
        this.then = 0;
        this.speed = 1000;
        this.isMoving = false;

        // this.populate();
        this.moveX = 0;
        this.moveDist = this.cellDim + 2;
        this.grid = [];

        this.zeroPos = [];
        this.currPos = [0, 0];


        this.updateDelta();
        this.init();
        this.populate();
    }

    init() {
        let sx = 5;
        let sy = 5;

        let numbers = Array.from({length: 16}, (v, i) => i);
        numbers.sort(() => Math.random() - 0.5);
        
        for (let i = 0, idx = 0, my = 1; i < 4; ++i) {
            this.grid[i] = [];
            for (let j = 0, mx = 1; j < 4; ++j) {
                let x = j * this.cellDim + sx + mx;
                let y = i * this.cellDim + sy + my;

                if (numbers[idx] == 0) {
                    this.zeroPos = [j, i];
                }
                
                this.grid[i][j] = {
                    x: x,
                    y: y,
                    move: [x, y, 0, 0],
                    n: numbers[idx]
                };

                mx++;
                idx++;
            }

            my++;
        }

        this.canvas.addEventListener('click', (e) => { 
            let x = Math.floor((e.offsetX - 5) / this.cellDim);
            let y = Math.floor((e.offsetY - 5) / this.cellDim);

            this.moveCellTo(x, y);
        }, false);
    }

    populate() {
        const { grid } = this;

        for (let i = 0, my = 1; i < 4; ++i) {
            for (let j = 0, mx = 1; j < 4; ++j) {
                let n = grid[i][j].n;

                if (n > 0) {
                    let x = grid[i][j].x;
                    let y = grid[i][j].y;

                    this.drawCell(x, y);
                    this.drawText(n, x, y);
                }
            }
        }
    }

    isComplete() {
        const { grid } = this;

        let count = 0;

        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                if (count++ != grid[i][j].n) {
                    return false;
                }
            }
        }

        return true;
    }

    drawText(text, x, y) {
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "#fff";
        this.ctx.textAlign="center"; 
        this.ctx.textBaseline = "middle";

        this.ctx.fillText(text, x + this.textPos, y + this.textPos);
    }

    drawCell(x, y) {
        this.ctx.fillStyle = this.cellColor;
        this.ctx.beginPath();
        this.ctx.rect(x, y, this.cellDim, this.cellDim);
        this.ctx.fill();
    }

    setCellColor(color) {
        this.cellColor = color;
    }

    setSpee(speed) {
        this.speed = speed;
    } 

    updateDelta() {
        this.now = Date.now();
        this.delta = (this.now - this.then) / 1000; // seconds since last frame
        this.then = this.now;
    }

    moveCellTo(x1, y1) {
        if (!this.isMoving && this.validateMove(x1, y1)) {
            this.isMoving = true;

            let x2 = this.zeroPos[0];
            let y2 = this.zeroPos[1];

            let ox = this.grid[y1][x1].x;
            let oy = this.grid[y1][x1].y;


            let dx = this.grid[y1][x1].move[0] < this.grid[y2][x2].move[0] ? 1 : -1;
            let dy = this.grid[y1][x1].move[1] < this.grid[y2][x2].move[1] ? 1 : -1;

            this.grid[y1][x1].move[0] = this.grid[y2][x2].move[0];
            this.grid[y1][x1].move[1] = this.grid[y2][x2].move[1];

            this.grid[y1][x1].move[2] = dx;
            this.grid[y1][x1].move[3] = dy;

            // re-init zero
            this.grid[y2][x2].x = ox;
            this.grid[y2][x2].y = oy;
            this.grid[y2][x2].move[0] = ox;
            this.grid[y2][x2].move[1] = oy;
            this.grid[y2][x2].move[2] = 0;
            this.grid[y2][x2].move[3] = 0;

            this.zeroPos = [x1, y1];
            this.currPos = [x2, y2];
        }
    }

    move() {
        const { grid } = this;

        if (this.isMoving) {
            for (let i = 0, my = 1; i < 4; ++i) {
                for (let j = 0, mx = 1; j < 4; ++j) {
                    let n = grid[i][j].n;
                    let directionX = grid[i][j].move[2];
                    let directionY = grid[i][j].move[3];

                    if ((directionX != 0 || directionY != 0)) {
                        let x = grid[i][j].x;
                        let y = grid[i][j].y;

                        let dx = grid[i][j].move[0];
                        let dy = grid[i][j].move[1];

                        let d = this.speed * this.delta;

                        if (x != dx) {
                            grid[i][j].x += d * directionX;

                            if (directionX > 0) {
                                grid[i][j].x = grid[i][j].x < dx ? grid[i][j].x : dx;
                            } else {
                                grid[i][j].x = grid[i][j].x > dx ? grid[i][j].x : dx;
                            }
                        } else if (y != dy) {
                            grid[i][j].y += d * directionY;

                            if (directionY > 0) {
                                grid[i][j].y = grid[i][j].y < dy ? grid[i][j].y : dy;
                            } else {
                                grid[i][j].y = grid[i][j].y > dy ? grid[i][j].y : dy;
                            }
                        } else {
                            this.isMoving = false;
                            this.swap();
                        }
                    }
                }
            }
        }
    }

    validateMove(x, y) {
        const { grid, zeroPos } = this;

        let px = zeroPos[0];
        let py = zeroPos[1];

        let rx = Math.abs(px - x);
        let ry = Math.abs(py - y);

        // console.log(x, px, y, py);

        return ((rx == 1 && ry == 0) || (ry == 1 && rx == 0));
    }

    swap() {
        const { zeroPos, currPos } = this;

        let x1 = currPos[0];
        let y1 = currPos[1];

        let x2 = zeroPos[0];
        let y2 = zeroPos[1];

        this.grid[y1][x1].n = this.grid[y2][x2].n;
        this.grid[y2][x2].n = 0;

        let x = this.grid[y1][x1].x;
        let y = this.grid[y1][x1].y;
        let mx = this.grid[y1][x1].move[0];
        let my = this.grid[y1][x1].move[1];

        this.grid[y1][x1].x = this.grid[y2][x2].x;
        this.grid[y1][x1].y = this.grid[y2][x2].y;
        this.grid[y1][x1].move[0] = this.grid[y2][x2].move[0];
        this.grid[y1][x1].move[1] = this.grid[y2][x2].move[1];

        this.grid[y2][x2].x = x;
        this.grid[y2][x2].y = y;
        this.grid[y2][x2].move[0] = mx;
        this.grid[y2][x2].move[1] = my;
    }

    update() {
        this.updateDelta();

        this.move();

        this.populate();
    }

    render() {
        var obj = this;

        var render = (function render() {
            obj.ctx.clearRect(0, 0, obj.dimension, obj.dimension);
            obj.update();
            window.requestAnimationFrame(render);
        })();
    }
}
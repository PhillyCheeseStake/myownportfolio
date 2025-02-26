class GameOfLife {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cellSize = 10;
        this.resizeCanvas();
        this.mouseX = 0;
        this.mouseY = 0;
        
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.animate = this.animate.bind(this);
    }

    handleMouseMove(e) {
        this.mouseX = Math.floor(e.clientX / this.cellSize);
        this.mouseY = Math.floor(e.clientY / this.cellSize);
        
        // Create live cells in a radius around the mouse
        const radius = 2;
        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                const x = (this.mouseY + i + this.rows) % this.rows;
                const y = (this.mouseX + j + this.cols) % this.cols;
                if (Math.random() > 0.5) { // 50% chance to create a live cell
                    this.grid[x][y] = 1;
                }
            }
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.cols = Math.floor(this.canvas.width / this.cellSize);
        this.rows = Math.floor(this.canvas.height / this.cellSize);
        this.grid = this.createGrid();
    }

    createGrid() {
        return Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () =>
                Math.random() > 0.85 ? 1 : 0
            )
        );
    }

    countNeighbors(grid, x, y) {
        let sum = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let row = (x + i + this.rows) % this.rows;
                let col = (y + j + this.cols) % this.cols;
                sum += grid[row][col];
            }
        }
        sum -= grid[x][y];
        return sum;
    }

    update() {
        let next = Array.from({ length: this.rows }, () =>
            Array(this.cols).fill(0)
        );

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let neighbors = this.countNeighbors(this.grid, i, j);
                let state = this.grid[i][j];

                if (state === 0 && neighbors === 3) {
                    next[i][j] = 1;
                } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
                    next[i][j] = 0;
                } else {
                    next[i][j] = state;
                }
            }
        }

        this.grid = next;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j] === 1) {
                    // Calculate distance to mouse
                    const distToMouse = Math.sqrt(
                        Math.pow(i - this.mouseY, 2) + 
                        Math.pow(j - this.mouseX, 2)
                    );
                    
                    // Change color based on distance to mouse
                    if (distToMouse < 5) {
                        this.ctx.fillStyle = '#30c9e8';
                    } else {
                        this.ctx.fillStyle = '#2193b0';
                    }
                    
                    this.ctx.fillRect(
                        j * this.cellSize,
                        i * this.cellSize,
                        this.cellSize - 1,
                        this.cellSize - 1
                    );
                }
            }
        }
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }

    start() {
        this.animate();
    }
}

// Initialize and start the Game of Life
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new GameOfLife(canvas);
    game.start();
});

// Gallery modal functionality
const modal = document.getElementById('imageModal');
const modalImg = modal.querySelector('img');
const galleryItems = document.querySelectorAll('.gallery-item img');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        modalImg.src = item.src;
        modal.classList.add('active');
    });
});

modal.addEventListener('click', () => {
    modal.classList.remove('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Contact form validation
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = this.name.value.trim();
    const email = this.email.value.trim();
    const message = this.message.value.trim();

    if (name === '' || email === '' || message === '') {
        alert('Please fill out all fields.');
        return;
    }

    // Simulate form submission
    alert('Thank you for your message!');
    this.reset();
});
const NUMBER_OF_INSTANCE = 300,
    // start date
    TIME_START = new Date("September 22, 2021 07:40:00"),
    rgbColor = [
        // light pink with a bit orange
        "rgba(255,129,159)",
        "rgba(253,107,185,0.5)",
        // light pink with purple
        "rgba(254,160,255)",
        // light pink
        "rgba(255,178,215)",
        // light purple
        "rgba(203,178,255)"];
var flowerArray = [],
    canvas,
    c,
    timeTogether,
    textContent,
    myReq,
    mousePosition = {
        x: undefined,
        y: undefined,
    };

function init() {
    canvas = document.getElementById('canvas');
    c = canvas.getContext('2d');
    canvas.width = w = window.innerWidth;
    canvas.height = h = window.innerHeight;
    timeTogether = document.getElementById('timeTogether');
    textContent = document.getElementById('textContent');
    textContent.style.width = w + 'px';
    textContent.style.top = h * .1 + 'px';

    // delete all the instances
    if (flowerArray.length > 0) {
        for (var i = 0; i < NUMBER_OF_INSTANCE; i++) {
            delete flowerArray[i];
        }
    }
    // create new instances and push on to the array
    flowerArray = [];
    for (let i = 0; i < NUMBER_OF_INSTANCE; i++) {
        let radius = Math.max(Math.random() * 30, 20);
        let x = Math.random() * (window.innerWidth - radius * 2) + radius;
        let y = Math.random() * (window.innerHeight - radius * 2) + radius;
        let dx = (Math.random() - 0.5) * 7;
        let dy = (Math.random() - 0.5) * 4;

        flowerArray.push(new Flower(x, y, dx, dy, radius, 5));
    }
}

// a function to figure out the time difference between now and the start date
function updateTime() {

    // Get today's date and time
    var now = new Date().getTime();

    // Find time difference between now and the start date
    var timeSpent = now - TIME_START;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(timeSpent / (1000 * 60 * 60 * 24));
    var years = Math.floor(days / 365);
    var leapYear = Math.floor(years / 4);
    days = days - (years * 365) - (leapYear);
    var hours = Math.floor((timeSpent % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeSpent % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeSpent % (1000 * 60)) / 1000);
    var mseconds = Math.floor((timeSpent % (1000 * 60) / 100) - (seconds * 10));
    minutes = minutes < 10 ? "0" + minutes : minutes
    seconds = seconds < 10 ? "0" + seconds : seconds
    timeTogether.innerHTML = "We've been together for " +
        (years > 0 ? years + (years > 1 ? "years " : "year ") : "") + days + "days " + hours + "h "
        + minutes + "m " + seconds + "s " + mseconds + "ms ";

}

setInterval(updateTime, 100);

function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.rgb = rgbColor[Math.floor(Math.random() * 5)];

    this.draw = function () {
        var factor = 1;

        c.fillStyle = this.rgb;
        c.strokeStyle = this.rgb;

        c.beginPath();
        c.arc(this.x, this.y, (this.radius / 5) * factor, 0, Math.PI * 2, true);
        c.fill();
        c.closePath();

        c.beginPath();
        c.arc(this.x, this.y, this.radius * factor, 0, Math.PI * 2, true);
        c.stroke();
        c.closePath();
    }

    this.update = function () {

        if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        // interact
        if (mousePosition.x - this.x < 50 && mousePosition.x - this.x > -50
            && mousePosition.y - this.y < 50 && mousePosition.y - this.y > -50) {
            this.radius += 1;
        } else if (this.radius > 30) {
            this.radius -= 1;
        }

        this.draw();

    }
}

// define Flower constructor
function Flower(x, y, dx, dy, radius, numPetals) {

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.numPetals = numPetals;
    this.dx = dx;
    this.dy = dy;
    this.rgb = rgbColor[Math.floor(Math.random() * 5)];

    this.rgb2 = rgbColor[Math.floor(Math.random() * 5)];

    this.draw = function () {
        c.beginPath();

        // draw petals
        for (let n = 0; n < this.numPetals; n++) {
            let theta1 = ((Math.PI * 2) / this.numPetals) * (n + 1);
            let theta2 = ((Math.PI * 2) / this.numPetals) * (n);

            let x1 = (this.radius * Math.sin(theta1)) + this.x;
            let y1 = (this.radius * Math.cos(theta1)) + this.y;
            let x2 = (this.radius * Math.sin(theta2)) + this.x;
            let y2 = (this.radius * Math.cos(theta2)) + this.y;

            c.moveTo(this.x, this.y);
            c.bezierCurveTo(x1, y1, x2, y2, this.x, this.y);
        }


        c.closePath();
        c.fillStyle = this.rgb;
        c.fill();


        c.beginPath();
        c.arc(this.x, this.y, (this.radius / 5), 0, 2 * Math.PI, false);

        c.fillStyle = this.rgb === this.rgb2 ? "yellow" : this.rgb2;
        c.fill();
    }

    this.update = function () {

        if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();

    }
}

function animate() {
    myReq = requestAnimationFrame(animate);
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    console.log("call");
    for (var i = 0; i < flowerArray.length; i++) {
        flowerArray[i].update();
    }

}

//*********************************************************************
//Events 

function animateCall() {
    if (myReq) {
        cancelAnimationFrame(myReq);
    }
    init();
    animate();
}

window.addEventListener('mousemove', function (event) {
    mousePosition.x = event.x;
    mousePosition.y = event.y;
})


window.addEventListener("load", function (event) {
    animateCall();
});

window.addEventListener("resize", function (event) {
    animateCall();
});
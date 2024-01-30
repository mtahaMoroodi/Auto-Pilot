const carCanvas = document.querySelector("#carCanvas");
const networkCanvas = document.querySelector("#networkCanvas");
carCanvas.width = 200;
networkCanvas.width = 600;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const car = generateCars(1500);

const traffic = [
  new Car(road.getLaneCenter(2), -1500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -2000, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -900, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -1000, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -1500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -1200, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -1800, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -800, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -150, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -400, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -1000, 30, 50, "DUMMY", 2),
];

let bestCar = car[0];

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < car.length; i++) {
    car[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if(i!= 0 ){
        NeuralNetwork.mutate(car[i].brain ,0.2)
    }
  }
}

function save() {
  console.log("works");
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

animate();
function generateCars(n) {
  const cars = [];
  for (let i = 0; i <= n; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < car.length; i++) {
    car[i].update(road.borders, traffic);
  }

  bestCar = car.find((c) => c.y == Math.min(...car.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < car.length; i++) {
    car[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();
  networkCtx.lineDashOffset = -time / 100;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}

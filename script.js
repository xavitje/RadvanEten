let items = [];

const wheelCanvas = document.getElementById("wheel");
const ctx = wheelCanvas.getContext("2d");

const spinBtn = document.getElementById("spinBtn");
const resultBox = document.getElementById("result");
const chosenText = document.getElementById("chosen");
const deleteBtn = document.getElementById("deleteBtn");
const addItemBtn = document.getElementById("addItemBtn");

async function loadData() {
  const response = await fetch("data.json");
  const data = await response.json();
  items = data.items.filter((i) => i && i.trim() !== "");
  drawWheel();
}

function getRandomColor() {
  return `hsl(${Math.random() * 360}, 80%, 55%)`;
}

function drawWheel() {
  if (items.length === 0) {
    ctx.clearRect(0, 0, 450, 450);
    return;
  }

  const arc = (Math.PI * 2) / items.length;
  ctx.clearRect(0, 0, 450, 450);

  items.forEach((item, i) => {
    const angle = i * arc;

    ctx.beginPath();
    ctx.fillStyle = getRandomColor();
    ctx.moveTo(225, 225);
    ctx.arc(225, 225, 225, angle, angle + arc);
    ctx.fill();

    ctx.save();
    ctx.translate(225, 225);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#f9fafb";
    ctx.font = "18px system-ui, sans-serif";
    ctx.fillText(item, 200, 6);
    ctx.restore();
  });
}

let isSpinning = false;

function spinWheel() {
  if (items.length === 0 || isSpinning) {
    return;
  }
  isSpinning = true;
  chosenText.classList.remove("glow");
  resultBox.classList.add("hidden");

  const arcDeg = 360 / items.length;

  const rotations = Math.floor(Math.random() * 3) + 5;
  const finalRotation = Math.random() * 360;

  const totalDegrees = rotations * 360 + finalRotation;

  const pointerAngle = (finalRotation + 90) % 360;
  let selectedIndex =
    Math.floor((items.length - pointerAngle / arcDeg) % items.length);
  if (selectedIndex < 0) {
    selectedIndex += items.length;
  }

  wheelCanvas.style.transform = `rotate(${totalDegrees}deg)`;

  const duration = 4500;

  setTimeout(() => {
    chosenText.textContent = items[selectedIndex];
    chosenText.classList.add("glow");
    resultBox.classList.remove("hidden");
    isSpinning = false;
  }, duration + 100);
}


function addItem() {
  const value = prompt("Voer een nieuw item in:");
  if (!value) {
    return;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return;
  }
  items.push(trimmed);
  drawWheel();
  alert(
    "Item toegevoegd aan het rad. Bewaren in data.json moet je zelf doen (bijv. met een backend)."
  );
}

spinBtn.addEventListener("click", spinWheel);
addItemBtn.addEventListener("click", addItem);

loadData();

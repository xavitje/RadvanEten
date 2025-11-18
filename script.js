let items = [];
let wheelCanvas = document.getElementById("wheel");
let ctx = wheelCanvas.getContext("2d");
let spinBtn = document.getElementById("spinBtn");
let resultBox = document.getElementById("result");
let chosenText = document.getElementById("chosen");
let deleteBtn = document.getElementById("deleteBtn");

async function loadData() {
    const response = await fetch("data.json");
    const data = await response.json();
    items = data.items;
    drawWheel();
}

function getRandomColor() {
    return `hsl(${Math.random() * 360}, 80%, 60%)`;
}

function drawWheel() {
    const arc = Math.PI * 2 / items.length;

    ctx.clearRect(0, 0, 450, 450);

    items.forEach((item, i) => {
        let angle = i * arc;

        ctx.beginPath();
        ctx.fillStyle = getRandomColor();
        ctx.moveTo(225, 225);
        ctx.arc(225, 225, 225, angle, angle + arc);
        ctx.fill();

        ctx.save();
        ctx.translate(225, 225);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(item, 200, 10);
        ctx.restore();
    });
}

function spinWheel() {
    const rotations = Math.floor(Math.random() * 3) + 5;
    const finalRotation = Math.random() * 360;
    const totalDegrees = rotations * 360 + finalRotation;

    const selectedIndex = Math.floor(
        (items.length - (finalRotation % 360) / (360 / items.length)) % items.length
    );

    wheelCanvas.style.transform = `rotate(${totalDegrees}deg)`;

    setTimeout(() => {
        chosenText.textContent = items[selectedIndex];

        chosenText.classList.add("glow");
        resultBox.classList.remove("hidden");

        deleteBtn.onclick = () => deleteItem(selectedIndex);

    }, 4600);
}

function deleteItem(index) {
    items.splice(index, 1);

    alert("Item verwijderd! Vergeet niet dat je een server moet gebruiken om data.json echt op te slaan.");

    chosenText.classList.remove("glow");
    resultBox.classList.add("hidden");

    wheelCanvas.style.transform = "rotate(0deg)";
    drawWheel();
}

spinBtn.addEventListener("click", spinWheel);
loadData();

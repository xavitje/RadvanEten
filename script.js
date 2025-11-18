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

function drawWheel() {
    const arc = Math.PI * 2 / items.length;

    ctx.clearRect(0, 0, 400, 400);

    items.forEach((item, i) => {
        let angle = i * arc;

        ctx.beginPath();
        ctx.fillStyle = i % 2 === 0 ? "#fcd34d" : "#fbbf24";
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, angle, angle + arc);
        ctx.fill();

        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "18px Arial";
        ctx.fillText(item, 180, 10);
        ctx.restore();
    });
}

function spinWheel() {
    let extraTurns = Math.floor(Math.random() * 5 + 5); 
    let degrees = extraTurns * 360 + Math.random() * 360;
    let selectedIndex = Math.floor((items.length - (degrees % 360) / (360 / items.length)) % items.length);

    wheelCanvas.style.transition = "transform 4s cubic-bezier(.17,.67,.16,1)";
    wheelCanvas.style.transform = `rotate(${degrees}deg)`;

    setTimeout(() => {
        resultBox.classList.remove("hidden");
        chosenText.textContent = items[selectedIndex];
        deleteBtn.onclick = () => deleteItem(selectedIndex);
    }, 4100);
}

function deleteItem(index) {
    items.splice(index, 1);

    const newJson = JSON.stringify({ items: items }, null, 2);

    fetch("data.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: newJson
    }).catch(() => {
        alert("Let op: Je browser staat bestandsschrijven lokaal niet toe.");
    });

    resultBox.classList.add("hidden");
    wheelCanvas.style.transform = "rotate(0deg)";
    drawWheel();
}

spinBtn.addEventListener("click", spinWheel);

loadData();

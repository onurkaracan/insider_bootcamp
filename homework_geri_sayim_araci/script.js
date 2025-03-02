let countdown;
let timeLeft;

function startCountdown() {
    clearInterval(countdown);
    timeLeft = parseInt(document.getElementById("timeInput").value);
    if (isNaN(timeLeft) || timeLeft <= 0) {
        alert("Lütfen geçerli bir süre girin.");
        return;
    }
    document.getElementById("countdownDisplay").innerText = timeLeft;
    countdown = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            document.getElementById("countdownDisplay").innerText = "Süre doldu!";
        } else {
            document.getElementById("countdownDisplay").innerText = timeLeft;
        }
    }, 1000);
}

function resetCountdown() {
    clearInterval(countdown);
    document.getElementById("countdownDisplay").innerText = "Süreyi girin ve başlatın.";
    document.getElementById("timeInput").value = "10";
}


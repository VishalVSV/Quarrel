function updateTheme() {
    document.documentElement.setAttribute("theme", document.getElementById("theme_selector").value.toString().toLowerCase());
}

let alerts = [];

let name_number = 1;
let record_count = 1;

function getName() {
    let name = document.getElementById("name").value.toString();

    if(name == "" || name == null) {
        name = `Speaker ${name_number++}`;
        document.getElementById("name").placeholder = `Speaker ${name_number}`;
    }

    return name;
}
document.getElementById("theme_selector").onchange = updateTheme;

updateTheme();

var time_elapsed_seconds = 0;
var clock_start;
var clock = document.getElementById("clock");

function updateClock() {
    clock.innerText = `${Math.floor(time_elapsed_seconds / 60).toString().padStart(2, '0')}:${Math.floor(time_elapsed_seconds % 60).toString().padStart(2, '0')}`
}

function setTimer(mins, secs) {
    time_elapsed_seconds = mins * 60 + secs;
}

var updateLoop = null;

function getSpeechTime() {
    let mins = parseInt(document.getElementById("t_min").value.toString());
    let secs = parseInt(document.getElementById("t_sec").value.toString());
    return mins * 60 + secs;
}

var speechTime = 0;

function startClock() {
    if(speechTime == 0) {
        alert("Speech time cannot be zero!");
        return;
    }

    if(updateLoop != null) {
        stopClock();
    }

    document.getElementById("name").disabled = true;
    document.getElementById("add_alert").disabled = true;
    (Array.from(document.querySelectorAll("input[type=number]"))).forEach(i => i.disabled = true);

    clock_start = new Date();

    updateLoop = window.setInterval(function() {
        time_elapsed_seconds = Math.floor((Date.now() - clock_start) / 1000);
        
        for (let i = 0; i < alerts.length; i++) {
            const alert = alerts[i];
            if (time_elapsed_seconds >= alert && time_elapsed_seconds < alert + 1) {
                beep();
                break;
            }
        }
        
        let scaling_factor = (time_elapsed_seconds / speechTime);

        if(scaling_factor <= 1) {
            cl_ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--text-color");
            cl_ctx.lineWidth = 4;
            cl_ctx.beginPath();
            cl_ctx.moveTo(0, 9);
            cl_ctx.lineTo(w * (time_elapsed_seconds / speechTime), 9);
            cl_ctx.closePath();
            cl_ctx.stroke();
        }
        else {
            beep();
            clock.classList.add("over_time");
            cl_ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--progress-color");
            cl_ctx.lineWidth = 4;
            cl_ctx.beginPath();
            cl_ctx.moveTo(w * ((time_elapsed_seconds - 1) / speechTime), 9);
            cl_ctx.lineTo(w * (time_elapsed_seconds / speechTime), 9);
            cl_ctx.closePath();
            cl_ctx.stroke();
        }
        
        updateClock();
    }, 500);
}

function stopClock() {
    document.getElementById("name").disabled = false;
    document.getElementById("add_alert").disabled = false;
    (Array.from(document.querySelectorAll("input[type=number]"))).forEach(i => i.disabled = false);

    if (updateLoop != null) {
        window.clearInterval(updateLoop);
        updateLoop = null;
        clock_start = null;

        clock.classList.remove("over_time");
        document.getElementById("name").value = "";        

        let record = document.createElement("p");
        let time = null;
        if(time_elapsed_seconds > 60) {
            time = `${Math.floor(time_elapsed_seconds / 60)} minutes ${Math.floor(time_elapsed_seconds % 60)} seconds`
        }
        else {
            time = `${Math.floor(time_elapsed_seconds % 60)} seconds`;
        }

        let comment = null;
        if (time_elapsed_seconds == speechTime) {
            comment = `<span style="color: green;">on time!</span>`
        }
        else if (time_elapsed_seconds > speechTime) {
            let t = time_elapsed_seconds - speechTime;
            if (t > 60) {
                comment = `<span style="color: red;">${Math.floor(t / 60)} minutes and ${t % 60} seconds over time</span>`
            }
            else {
                comment = `<span style="color: red;">${t} seconds over time</span>`
            }
        }
        else {
            let t = speechTime - time_elapsed_seconds;
            if (t > 60) {
                comment = `<span style="color: yellow;">${Math.floor(t / 60)} minutes and ${t % 60} seconds under time</span>`
            }
            else {
                comment = `<span style="color: yellow;">${t} seconds under time</span>`
            }
        }

        cl_ctx.clearRect(0,0, cl.width, cl.clientHeight);

        cl_ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--light-text");
        cl_ctx.lineWidth = 0.2;
        cl_ctx.beginPath();
        cl_ctx.moveTo(0, 10);
        cl_ctx.lineTo(cl.width, 10);
        cl_ctx.closePath();
        cl_ctx.stroke();

        drawAlerts();

        record.innerHTML = `${record_count++}. ${getName()} - ${time} - ${comment}`;

        document.getElementById("records").appendChild(record);
        time_elapsed_seconds = 0;

        clock.style.opacity = 0;
        let a = window.setTimeout(function() {
            updateClock();
            clock.style.opacity = 1;
            window.clearTimeout(a);
        }, 500);

    }
}

function addAlert(mins, secs) {
    let t = mins * 60 + secs;

    if(alerts.includes(t)) {
        return;
    }

    alerts.push(t);
    drawAlerts();
}

function drawAlerts() {
    for (let i = 0; i < alerts.length; i++) {
        const alert = alerts[i];
        let x = w * (alert / speechTime);
        cl_ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--text-color");
        cl_ctx.fillRect(x - 1, 0, 4, 15);
        cl_ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--bg-color");
        cl_ctx.fillRect(x, 1, 2, 13);
    }
}

function copyTemplateLink() {
    if(speechTime == 0) {
        alert("Can't create a template for speech with no speech time");
        return;
    }

    let url = "https://vishalvsv.github.io/Quarrel?st=";
    url += speechTime.toString();
    if(alerts.length != 0) {
        url += "&alerts=";
        for (let i = 0; i < alerts.length; i++) {
            url += alerts[i].toString();
            if (i + 1 != alerts.length) {
                url += ",";
            }
        }
    }

    navigator.clipboard.writeText(url);
    alert("Templated link copied!");
}

function updateSpeechTime() {
    let mins = parseInt(document.getElementById("t_min").value.toString() || "0");
    let secs = parseInt(document.getElementById("t_sec").value.toString() || "0");
    speechTime = mins * 60 + secs;
}

setTimer(0, 0);
updateClock();

audioCtx = new(window.AudioContext || window.webkitAudioContext)();

function beep() {
    let frequency = 450;
    let type = 0;
    let duration = 300;
    let volume = 1;
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.value = volume;
    oscillator.frequency.value = frequency;
    oscillator.type = type;

    oscillator.start();

    setTimeout(
        function() {
        oscillator.stop();
        },
        duration
    );
};

var cl = document.getElementById("clock_line");
var cl_ctx = cl.getContext("2d");

window.onresize = function() {
    w = clock.clientWidth;
    cl.width = w * 1.2;
    cl_ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--light-text");
    cl_ctx.lineWidth = 0.2;
    cl_ctx.beginPath();
    cl_ctx.moveTo(0, 10);
    cl_ctx.lineTo(cl.width, 10);
    cl_ctx.closePath();
    cl_ctx.stroke();

    drawAlerts();
}
let w = clock.clientWidth;
cl.width = w * 1.2;
cl.height = 20;

cl_ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--light-text");
cl_ctx.lineWidth = 0.2;
cl_ctx.beginPath();
cl_ctx.moveTo(0, 10);
cl_ctx.lineTo(cl.width, 10);
cl_ctx.closePath();
cl_ctx.stroke();

updateSpeechTime();


let params = (new URL(document.location)).searchParams;

if(params.get("st")) {
    let speech_time = parseInt(params.get("st"));
    speechTime = speech_time;
    document.getElementById("t_min").value = Math.floor(speechTime / 60);
    document.getElementById("t_sec").value = Math.floor(speechTime % 60);
}

if(params.get("alerts")) {
    alerts = params.get("alerts").split(',').map(m => parseInt(m));
    drawAlerts();
}


document.getElementById("name").placeholder = `Speaker ${name_number}`;
var current_theme = dark_theme;

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

var time_elapsed_seconds = 0;
var clock_start;
var clock = document.getElementById("clock");

let paused = false;

function updateClock() {
    let last_text = clock.innerText;
    
    clock.innerText = `${Math.floor(time_elapsed_seconds / 60).toString().padStart(2, '0')}:${Math.floor(time_elapsed_seconds % 60).toString().padStart(2, '0')}`;

    if (last_text != clock.innerText) {
        let scaling_factor = (Math.floor(time_elapsed_seconds) / speechTime);

        if(scaling_factor < 1) {
            cl_ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--text-color");
            cl_ctx.lineWidth = 4;
            cl_ctx.beginPath();
            cl_ctx.moveTo(0, 9);
            cl_ctx.lineTo(w * (time_elapsed_seconds / speechTime), 9);
            cl_ctx.closePath();
            cl_ctx.stroke();
        }
        else {
            clock.classList.add("over_time");
            cl_ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--progress-color");
            cl_ctx.lineWidth = 4;
            cl_ctx.beginPath();
            cl_ctx.moveTo(w * ((time_elapsed_seconds - 1) / speechTime), 9);
            cl_ctx.lineTo(w * (time_elapsed_seconds / speechTime), 9);
            cl_ctx.closePath();
            cl_ctx.stroke();
        }
    }
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
var draw = true;

function startClock() {
    if(speechTime == 0) {
        alert("Speech time cannot be zero!");
        return;
    }

    if(updateLoop != null) {
        paused = !paused;
        if (paused) {
            document.getElementById("start_btn").classList.add("play");
            document.getElementById("start_btn").classList.remove("pause");
        }
        else {
            clock_start = Date.now();
            document.getElementById("start_btn").classList.add("pause");
            document.getElementById("start_btn").classList.remove("play");
        }
        return;
    }

    if (paused) {
        document.getElementById("start_btn").classList.add("play");
        document.getElementById("start_btn").classList.remove("pause");
    }
    else {
        document.getElementById("start_btn").classList.add("pause");
        document.getElementById("start_btn").classList.remove("play");
    }


    document.getElementById("name").disabled = true;
    document.getElementById("add_alert").disabled = true;
    (Array.from(document.querySelectorAll("input[type=number]"))).forEach(i => i.disabled = true);

    clock_start = new Date();

    updateLoop = window.setInterval(function() {

        if (paused) {
            document.getElementById("start_btn").classList.add("play");
            document.getElementById("start_btn").classList.remove("pause");
        }
        else {
            document.getElementById("start_btn").classList.add("pause");
            document.getElementById("start_btn").classList.remove("play");
        }

        if (paused) return;

        time_elapsed_seconds += (Date.now() - clock_start) / 1000;
        clock_start = Date.now();
        
        for (let i = 0; i < alerts.length; i++) {
            const alert = alerts[i];
            if (time_elapsed_seconds >= alert && time_elapsed_seconds < alert + 1) {
                beep();
                break;
            }
        }
        
        if (time_elapsed_seconds >= speechTime) {
            beep();
        }
        updateClock();
        draw = !draw;
    }, 500);
}

function stopClock() {
    document.getElementById("name").disabled = false;
    document.getElementById("add_alert").disabled = false;
    (Array.from(document.querySelectorAll("input[type=number]"))).forEach(i => i.disabled = false);
    draw = true;

    if (updateLoop != null) {
        paused = false;
        document.getElementById("start_btn").classList.add("play");
        document.getElementById("start_btn").classList.remove("pause");

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
        if (Math.round(time_elapsed_seconds) == speechTime) {
            comment = `on time!`
        }
        else if (Math.round(time_elapsed_seconds) > speechTime) {
            let t = time_elapsed_seconds - speechTime;
            if (t > 60) {
                comment = `${Math.floor(t / 60)} minutes and ${Math.floor(t % 60)} seconds over time`
            }
            else {
                comment = `${Math.floor(t)} seconds over time`
            }
        }
        else {
            let t = speechTime - time_elapsed_seconds;
            console.log(t);
            if (t > 60) {
                comment = `${Math.floor(t / 60)} minutes and ${Math.floor(t % 60)} seconds under time`
            }
            else {
                comment = `${Math.floor(t)} seconds under time`
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

        record.innerText = `${record_count++}. ${getName()} - ${time} - ${comment}`;

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
    updateUrl();
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

function updateUrl() {
    if (history) {
        let url = "?st=";
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

        if(current_theme.name == undefined)
        {
            url += "&theme=" + theme_to_string(current_theme);
        }
        else {
            url += "&theme=" + current_theme.name;
        }

        history.replaceState({}, "", url);
    }
}

function updateSpeechTime() {
    let mins = parseInt(document.getElementById("t_min").value.toString() || "0");
    let secs = parseInt(document.getElementById("t_sec").value.toString() || "0");
    speechTime = mins * 60 + secs;

    updateUrl();
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

if(params.get("theme")) {
    let theme_str = params.get("theme");

    let known_theme = false;
    for (const theme of themes) {
        if (theme.name == theme_str) {
            apply_theme(theme);
            known_theme = true;
            break;
        }
    }

    if (!known_theme) {
        let theme = string_to_theme(params.get("theme"));

        current_theme = theme;

        apply_theme(theme);
    }
}

document.getElementById("name").placeholder = `Speaker ${name_number}`;

document.getElementById("version_display").innerText = "Version: " + current_version;

updateSpeechTime();
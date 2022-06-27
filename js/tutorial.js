let current_version = "v1.1.0";


let tooltip_container = document.getElementById("tooltip_bg");
let tooltip = document.getElementById("tooltip");
let test_element = document.getElementById("name");

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX + rect.width,
        top: rect.top + window.scrollY
    };
}

let tutorial_in_progress = false;

let tutorial_sequence = [
    { text: "This is a simple tutorial for the timer system. Click anywhere to progress.", elem: document.getElementById("clock") },
    { text: "This is the timer. It will count up to the given time and flash red and beep when the time is up.", elem: document.getElementById("clock") },
    { text: "Enter the name of the speaker here.", elem: document.getElementById("name") },
    { text: "Enter the number of minutes for the speech here.", elem: document.getElementById("t_min") },
    { text: "Enter the number of seconds for the speech here.", elem: document.getElementById("t_sec") },
    { text: "Press this button to start the timer.", elem: document.getElementById("start_btn") },
    { text: "Press this button to stop the timer.", elem: document.getElementById("stop_btn") },
    { text: "Press this button to add an alert to the timer.", elem: document.getElementById("add_alert") },
    { text: "Enter the number of minutes for the alert here.", elem: document.getElementById("a_min") },
    { text: "Enter the number of seconds for the alert here.", elem: document.getElementById("a_sec") },
    { text: "The speakers who have finished will show up here with their speech times.", elem: document.getElementById("recent") },
];

let tutorial_sequence_index = 0;

function tutorial_start() {
    window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth'
    });

    tooltip_container.style.display = "block";
    tutorial_in_progress = true;

    if(tutorial_sequence_index < tutorial_sequence.length) {
        tooltip.innerText = tutorial_sequence[tutorial_sequence_index].text;
        move_tooltip_to(tutorial_sequence[tutorial_sequence_index].elem);
    }
}

function move_tooltip_to(elem) {
    let c = getOffset(elem);
    tooltip.style.left = `${c.left}px`;
    tooltip.style.top = `${c.top - document.documentElement.scrollTop + elem.clientHeight / 2 - tooltip.clientHeight / 2}px`;
}

window.addEventListener('click',function(event) {
    if (tutorial_in_progress) {
        if (event.target != tooltip) {
            tutorial_sequence_index++;
            
            if(tutorial_sequence_index < tutorial_sequence.length) {
                tooltip.innerText = tutorial_sequence[tutorial_sequence_index].text;
                move_tooltip_to(tutorial_sequence[tutorial_sequence_index].elem);
            }
            else {
                tutorial_sequence_index = 0;
                tutorial_in_progress = false;
                tooltip_container.style.display = "none";
            }
        }
    }
});

window.addEventListener('scroll', (e) => {
    move_tooltip_to(tutorial_sequence[tutorial_sequence_index].elem);
});

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

if(localStorage.getItem("quarrel_first_visit") == null || localStorage.getItem("quarrel_first_visit") != current_version) {
    if (!window.mobileCheck()) {
        tutorial_start();
        localStorage.setItem("quarrel_first_visit", current_version);
    }
}
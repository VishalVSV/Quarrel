var modal = document.getElementById("help_modal");

var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    modal.style.display = "none";
    document.body.style.overflow = "";
}

window.addEventListener('click',function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.style.overflow = "";
    }
});

function open_modal() {
    modal.style.display='block';
    modal.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
}

// modal.style.display = "block"
function enable_debug() {
    debug = {
        reset_help: function() { localStorage.setItem("quarrel_first_visit", null) }
    };
}

var debug = null;
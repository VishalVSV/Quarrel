function theme_to_string(theme) {
    let str = "";

    str = [theme.background_color, theme.text_color, theme.light_text, theme.progress_color].map((t) => t.replaceAll(',', '-')).join('~');

    return str;
}

function string_to_theme(str) {
    let vals = str.replaceAll('-', ',').split('~');

    return {
        background_color: vals[0],
        text_color: vals[1],
        light_text: vals[2],
        progress_color: vals[3]
    };
}

function apply_theme(theme) {
    let style = document.documentElement.style;

    style.setProperty("--bg-color", theme.background_color);
    style.setProperty("--text-color", theme.text_color);
    style.setProperty("--light-text", theme.light_text);
    style.setProperty("--progress-color", theme.progress_color);

    
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

    drawAlerts();

    let i = 0;
    let selector = document.getElementById("theme_selector");

    current_theme = theme;

    if (!theme.name) {
        
        let has_custom = false;
        for (const option of selector.options) {
            if (option.value == "Custom") {
                has_custom = true;
                break;
            }
            i += 1;
        }

        if (!has_custom) {
            let option = new Option("Custom", "Custom");
            option.onclick = () => apply_theme(theme);
            selector.appendChild(option);
        }
        else {
            selector.options[i].onclick = () => apply_theme(theme);
        }

        selector.selectedIndex = i;
    }
    else {   
        for (const option of selector.options) {
            if (option.value == theme.name) {
                selector.selectedIndex = i;
                break;
            }
            i += 1;
        }
    }

    updateUrl();
}

let dark_theme = {
    name: "Dark",
    background_color: "rgb(48,48,48)",
    text_color: "white",
    light_text: "grey",
    progress_color: "red"
};

let light_theme = {
    name: "Light",
    background_color: "rgb(212, 212, 212)",
    text_color: "black",
    light_text: "grey",
    progress_color: "red"
};

let kimbie_dark_theme = {
    name: "Kimbie Dark",
    background_color: "#221A0F",
    text_color: "#E99A32",
    light_text: "#FFDFB5",
    progress_color: "red"
};

let themes = [dark_theme, light_theme, kimbie_dark_theme];

(() => {
    let theme_selector = document.getElementById("theme_selector");
    for (const theme of themes) {
        let option = new Option(theme.name, theme.name);
        option.onclick = () => apply_theme(theme);
        theme_selector.appendChild(option);
    }
})();
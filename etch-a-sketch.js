//0 = Grayscale, 2 = Black, 3 = Color
let fillMode = 0;
let curSize = 16;
let greenField = true;

const toyContainer = document.querySelector("#border");

function getGrayscale(multiplier) {
    value = 200 - 20 * multiplier;

    return `rgb(${value}, ${value}, ${value})`;
}

function getRandomRGB() {
    return Math.floor(Math.random() * 255);
}

function getRandomColor() {
    return `rgb(${getRandomRGB()}, ${getRandomRGB()}, ${getRandomRGB()})`;
}

function colorChanger(element) {
    greenField = false;

    switch(fillMode) {
        case 0:
            let multiplier = element.dataset.colorMultiplier == undefined ? 1: parseInt(element.dataset.colorMultiplier) + 1;
            element.dataset.colorMultiplier = multiplier;
            element.style.backgroundColor = getGrayscale(multiplier);
            break;
        case 1:
            delete element.dataset.colorMultiplier;
            element.style.backgroundColor = 'rgb(0, 0, 0)';
            break;
        case 2:
            delete element.dataset.colorMultiplier;
            element.style.backgroundColor = getRandomColor();
            break;
    }

}

function genPixels(columns) {
    let container = document.querySelector("#container");

    let templateArr = new Array(columns);
    templateArr.fill("auto");

    container.style.gridTemplateColumns = templateArr.join(" ");

    for (let i = 0; i < columns*columns; i++) {
        let element = document.createElement("div");

        element.addEventListener('mouseenter', () => {colorChanger(element)});

        container.append(element);
    }

    greenField = true;

}

function deletePixels() {
    document.querySelectorAll("#container div").forEach(function(element) {
        element.remove();
    });
}

function resize(newSize) {
    deletePixels();
    curSize = newSize;
    genPixels(curSize);
}

function clearAllActiveToggles() {
    document.querySelectorAll(".toggle").forEach(function(element) {
        element.classList.remove("active");
    });
}

function ctrlIcon(element) {
    switch(element.dataset.button) {
        case "color":
            if (fillMode != 2) {
                fillMode = 2;
                clearAllActiveToggles();
                element.classList.add("active");
            } else {
                fillMode = 0;
                element.classList.remove("active");
            }
            break;
        case "grayscale":
            if (fillMode == 0 || fillMode == 2) {
                fillMode = 1;
                clearAllActiveToggles();
                element.classList.add("active");
            } else if (fillMode == 1) {
                fillMode = 0;
                element.classList.remove("active");
            }
            break;
        case "clear":
            let container = document.querySelector("#border");
            container.classList.add("animate");
            deletePixels();
            genPixels(curSize);
            break;
    }
}

function ctrlScale(ctrl, value) {
    if (!greenField) {
        let inputConfirm = confirm("Resizing the grid will delete your existing content. Are you sure?");
        if (!inputConfirm) {
            ctrl.value = curSize;
            return;
        }
    }
    resize(value);
}

function removeAnimationClass() {
    toyContainer.classList.remove("animate");
}

//Animation listeners
toyContainer.addEventListener("webkitAnimationEnd",() => removeAnimationClass());
toyContainer.addEventListener("animationend", () => removeAnimationClass());

//Control listeners
document.querySelectorAll(".icon-button").forEach(function(element) {
    element.addEventListener('click', () => ctrlIcon(element));
});

document.querySelector("#controls input[type='range']").addEventListener('change', function() {
    ctrlScale(this, parseInt(this.value));
});

//Initialize empty etch-a-sketch
genPixels(curSize);
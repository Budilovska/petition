console.log("Client-side is running");

const canvas = document.querySelector("canvas");
const submitBtn = document.getElementById("submit-btn");
const c = canvas.getContext("2d");
c.strokeStyle = "white";
c.lineWidth = "2";
const register = document.getElementById("register-me");

const mousePos = { x: 0, y: 0 };
let drawing = false;

function getMousePosition(e) {
    mousePos.x = e.offsetX;
    mousePos.y = e.offsetY;
    // console.log("mouse position:", mousePos);
}

canvas.addEventListener("mousedown", function(e) {
    const h3 = document.getElementById("#sign-here");
     document.body.classList.add("move-sign-here");
    if (!drawing) {
        drawing = true;
        getMousePosition(e);
        c.moveTo(mousePos.x, mousePos.y);
        c.beginPath();
    }
    canvas.addEventListener("mousemove", function(e) {
        if (drawing) {
            getMousePosition(e);
            c.lineTo(mousePos.x, mousePos.y);
            c.stroke();
        }
        canvas.addEventListener("mouseup", function(e) {
            if (drawing) {
                drawing = false;
            }
        });
    });
});

const dataUrl = document.getElementById("signature-inp");
submitBtn.addEventListener("click", function() {
    dataUrl.value = canvas.toDataURL();
});

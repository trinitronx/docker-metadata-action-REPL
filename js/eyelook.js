
function eyeLook(ev) {
  const pupil = document.querySelectorAll(".pupil");
  pupil.forEach(function (pupil) {
    let x = pupil.getBoundingClientRect().x + pupil.clientWidth / 2;
    let y = pupil.getBoundingClientRect().y + pupil.clientHeight / 2;

    let radian = Math.atan2(ev.pageX - x, ev.pageY - y);
    let rotate = radian * (180 / Math.PI) * -1 + 270;
    pupil.style.transform = "rotate(" + rotate + "deg)";
  });
}
document.querySelector("body").addEventListener("mousemove", eyeLook);
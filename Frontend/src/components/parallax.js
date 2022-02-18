function parallax() {
  document.addEventListener("mousemove", parallax);
  const elem = document.querySelector("#parallax");
  function parallax(e) {
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;

    elem.style.transform = `translateX(${x}px) translateY(${y}px)`;
  }
}
export default parallax;

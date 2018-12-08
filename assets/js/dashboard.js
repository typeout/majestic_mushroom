let startTimes = [];

document.querySelectorAll(".live").forEach((time, index) => {
  startTimes[index] = time.innerHTML;
});

setInterval(() => {
  let now = new Date().getTime();

  document.querySelectorAll(".live").forEach((slot, index) => {
    let distance = now - startTimes[index];
    slot.innerHTML = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + "h " + 
                     Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) + "m " +
                     Math.floor((distance % (1000 * 60)) / 1000) + "s";
  });
}, 1000);
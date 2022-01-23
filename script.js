 let boxes = document.querySelector(".boxes"),
        buttons = boxes.querySelector(".buttons"),
        nextBut = boxes.querySelector(".button-right"),
        privBut = boxes.querySelector(".button-left"),
        boxList = boxes.querySelector(".box-list"),
        boxTrack = boxList.querySelector(".box-track"),
        box = boxes.querySelectorAll(".box"),
        posInit = 0,
        posX = 0,
        slideWidth = box[0].offsetWidth,
        slideIndex = 0,
        maxSlides = boxTrack.dataset.slideCount - 1,
        visibleSlides = boxTrack.dataset.visibleSlides - 1,
        posThreshold = box[0].offsetWidth * 0.35,
        trfRegExp = /([-0-9.]+(?=px))/;

      boxList.addEventListener("mousedown", swipeStart);

      function getCoords() {
        return event.clientX;
      }

      function slide() {
        boxTrack.style.transition = "transform .5s";
        boxTrack.style.transform = `translateX(-${slideIndex * slideWidth}px)`;

        nextBut.classList.toggle(
          "disable",
          slideIndex == maxSlides - visibleSlides
        );
        privBut.classList.toggle("disable", slideIndex == 0);
      }

      function swipeStart() {
        posInit = getCoords();
        posX = getCoords();

        boxTrack.style.transition = "";

        boxList.addEventListener("mousemove", swipeMove);
        boxList.addEventListener("mouseup", swipeEnd);
        boxList.addEventListener("mouseout", swipeEnd);
      }

      function swipeMove() {
        let posX2 = posX - getCoords();
        posX = getCoords();
        let style = boxTrack.style.transform;
        let transform = +style.match(trfRegExp)[0];

        boxTrack.style.transform = `translateX(${transform - posX2}px`;
      }

      function swipeEnd() {
        let finalPos = Math.abs(posInit - posX);
        let slides =
          finalPos > slideWidth ? Math.floor(finalPos / slideWidth) : "";

        if (finalPos > posThreshold) {
          if (posInit > posX) {
            slideIndex++;
            if (slideIndex + visibleSlides > maxSlides) {
              slideIndex = maxSlides - visibleSlides;
            }
          } else if (posInit < posX) {
            slideIndex--;
            if (slideIndex < 0) {
              slideIndex = 0;
            }
          }
        }

        if (slides) {
          if (posInit > posX) {
            slideIndex += slides;
          } else if (posInit < posX) {
            slideIndex -= slides;
          }
          if (slideIndex + visibleSlides > maxSlides) {
            slideIndex = maxSlides - visibleSlides;
          }
          if (slideIndex < 0) {
            slideIndex = 0;
          }
        }

        if (posInit !== posX) slide();

        boxList.removeEventListener("mousemove", swipeMove);
        boxList.removeEventListener("mouseup", swipeEnd);
        boxList.removeEventListener("mouseout", swipeEnd);
      }

      buttons.addEventListener("click", function (e) {
        if (e.target.classList == "button-left") {
          slideIndex--;
        } else if (e.target.classList == "button-right") {
          slideIndex++;
        }
        slide();
      });

      boxTrack.style.transform = `translateX(0px)`;
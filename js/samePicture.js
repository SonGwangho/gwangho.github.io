var cardCount = 0;
var isCardChecked = true;

function initCards() {
  const cards = document.getElementsByClassName("card_back");
  let index = 0;
  let images = Array(15);
  for (let i = 0; i < 15; i++) {
    images[i] = i + 1;
    images.push(i + 1);
  }

  images = Random.shuffle(images);

  Array.from(cards).map((card) => {
    card.setAttribute("card-src", images[index]);
    card.style.backgroundImage = `url(./assets/img/card/${
      images[index++]
    }.png)`;

    toggleCard(card);
    setTimeout(() => {
      toggleCard(card);
      card.addEventListener("click", clickEvent);
    }, 3000);
  });
}

function toggleCard(element) {
  if (element.classList.contains("card_front")) {
    element.classList.add("card_back");
    element.classList.remove("card_front", "selected");
  } else {
    element.classList.remove("card_back");
    element.classList.add("card_front", "selected");
  }
}

function checkCard() {
  const cards = document.getElementsByClassName("selected");
  cardCount++;
  if (cards.length < 2) return;
  isCardChecked = false;
  const card1 = cards[0];
  const card2 = cards[1];

  if (card1.getAttribute("card-src") == card2.getAttribute("card-src")) {
    card1.removeEventListener("click", clickEvent);
    card2.removeEventListener("click", clickEvent);
    card1.classList.remove("selected");
    card2.classList.remove("selected");

    if (isDone()) {
      MyToast.showToast("총 시도 횟수 - " + cardCount);
      MyToast.showToast("성공!!");
    }
  } else {
    setTimeout(() => {
      isCardChecked = true;
      card1.classList.add("card_back");
      card1.classList.remove("card_front", "selected");
      card2.classList.add("card_back");
      card2.classList.remove("card_front", "selected");
    }, 500);
  }
}

function clickEvent(e) {
  if (isCardChecked) {
    toggleCard(e.target);
    checkCard();
  }
}

function isDone() {
  const cards = document.getElementsByClassName("card_back");
  if (cards.length < 1) {
    return true;
  }
  return false;
}

import * as impHttp from "./http.js";
import * as impLoto from "./navigation.js";
import * as impPopup from "./popup.js";

function generateRandomNumbersWithoutRepeats(min, max, count) {
  if (count > max - min + 1) {
    throw new Error("Can't generate random numbers without repeats");
  }

  let numbers = [];
  while (numbers.length < count) {
    let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }

  return numbers;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const deleteNumbers = (card) => {
  const newCard = [...card];
  // delete 4 numbers from each row

  for (let i = 0; i < 3; i++) {
    let row = newCard.slice(i * 9, i * 9 + 9);
    let numbers = [];
    for (let j = 0; j < 9; j++) {
      if (row[j] != " ") {
        numbers.push(j);
      }
    }

    let numbersToDelete = generateRandomNumbersWithoutRepeats(0, 8, 4);
    numbersToDelete.forEach((number) => {
      row[number] = " ";
    });

    for (let j = 0; j < 9; j++) {
      newCard[i * 9 + j] = row[j];
    }
  }

  return newCard;
};

export function generateLotoCard() {
  //   Карта состоит из таблицы, 9х3 поля. Используемые номера от 1 до 90.
  // В каждой колонке карты может быть 1 или 2 числа (не 0 и не 3). В каждой строке 5 заполненных клеток. Таким образом, в карте 27 полей, 15 из которых заполнены.

  //В первой колонке используется числа от 1 до 9 (9 штук); в колонках со 2-ой по 8-ую числа одного десятка (от 10 до 19, 10 штук); и в последней 9-ой колонке числа от 80 до 90 (11 штук).

  let card = [];

  for (let i = 0; i < 27; i++) {
    card.push(0);
  }

  for (let i = 1; i <= 9; i++) {
    const column = generateRandomNumbersWithoutRepeats(i * 10 - 9, i * 10, 3);

    for (let j = 0; j < 3; j++) {
      let index = j * 9 + i - 1;
      card[index] = column[j];
    }
  }

  let isValid = false;
  let newCard;

  while (!isValid) {
    isValid = true;
    newCard = deleteNumbers(card);

    for (let i = 0; i < 9; i++) {
      if (
        newCard[i] == " " &&
        newCard[i + 9] == " " &&
        newCard[i + 18] == " "
      ) {
        isValid = false;
      }
    }

    let rows = [];
    for (let i = 1; i <= 3; i++) {
      for (let j = 0; j < 9; j++) {
        rows.push(newCard[j]);
      }
    }

    // check if each row has 5 numbers
    for (let i = 0; i < 27; i += 9) {
      let row = rows.slice(i, i + 9);
      let count = 0;
      row.forEach((cell) => {
        if (cell != " ") {
          count++;
        }
      });

      if (count != 5) {
        isValid = false;
      }
    }
  }

  // make unique id
  let id = "";
  for (let i = 0; i < 27; i++) {
    if (newCard[i] != " ") {
      id += newCard[i];
    }
  }
  id += new Date().getTime();

  return { newCard, id };
}

export async function openGamePage(
  online = null,
  bet = null,
  bank = null,
  roomId = null,
  jackpot = null
) {
  // console.log(bank);
  let body = document.querySelector("main");
  body.innerHTML = `<div class="loto-game-room-page">
  <div class="loto-game-room-page-content">
    <div class="loto-game-room__gameinfo loto-gameinfo">
      <p class="loto-gameinfo__bet">
        Ставка: <span>${bet != null ? bet : 0}М</span>
      </p>
      <p class="loto-gameinfo__online">
        Игроков: <span>${online != null ? online : 0}</span>
      </p>
      <p class="loto-gameinfo__bank">
        Банк: <span>${bank != null ? bank.toFixed(2) : 0}М</span>
      </p>
      <button class="auto-play active">auto</button>
    </div>
    <div class="room-jackpot">
      Джекпот: <span class="room-jackpot-sum">${
        jackpot != null ? jackpot.toFixed(2) : 0
      }М</span>
    </div>
    <div class="loto-game-room__gameprocess"></div>
    <div class="loto-gamemain__body">
      <div class="col-div empty-left-sidebar"></div>
      <div class="col-div loto-game-room__main loto-gamemain"></div>
      <div class="col-div information-sidebar">
        <div class="information-sidebar__item left3">
          У <span>0</span> карточек осталось 3 номера
        </div>
      </div>
    </div>
  </div>
</div>`;

  // убираем навигацию сайта
  let footer = document.querySelector("#footer");
  if (footer && !footer.classList.contains("d-none")) {
    footer.classList.add("d-none");
  }
  // показываем билеты
  let userCards = await impHttp.getTickets();
  userCards = userCards.data;
  showUserTickets(userCards, roomId);

  // добавляем функционал на кнопку "авто игра"
  let buttonAuto = document.querySelector(".auto-play");
  if (buttonAuto) {
    buttonAuto.addEventListener("click", function () {
      if (buttonAuto.classList.contains("active")) {
        buttonAuto.classList.remove("active");
      } else {
        buttonAuto.classList.add("active");
      }
    });
  }
}

export function showJackpotWon(winner, sum) {
  console.log(winner, window.userId);
  if (winner == window.userId) {
    impPopup.open(
      `Поздравляем вы выиграли джекпот! Ваша сумма выигрыша составила ${sum.toFixed(
        2
      )}М`,
      200
    );
    setTimeout(() => {
      impPopup.close();
    }, 5000);
  }

  const jackpotSum = document.querySelector(".room-jackpot-sum");
  if (jackpotSum) {
    jackpotSum.innerHTML = "выигран!";
  }
}

export function showUserTickets(tickets, roomId) {
  // удаляем все старые
  let oldTickets = document.querySelectorAll(".bought-ticket");
  oldTickets.forEach((item) => {
    item.remove();
  });

  if (tickets.length == 0) {
    return;
  }
  // создаем новые
  let boughtTicketsCounter = 0;
  tickets.forEach((ticket) => {
    if (ticket.gameLevel == roomId) {
      boughtTicketsCounter++;
      let cells = JSON.parse(ticket.card);
      let id = ticket.id;
      let ticketsBody = document.querySelector(".loto-gamemain");
      if (ticketsBody) {
        let ticket = document.createElement("ul");
        ticket.classList.add("loto-gamemain__ticket", "bought-ticket");
        ticket.setAttribute("id", id);
        cells.forEach((cell) => {
          let ticketCell = document.createElement("li");
          ticketCell.classList.add("ticket-cell");
          ticketCell.innerHTML = cell;
          ticket.appendChild(ticketCell);
        });
        ticketsBody.appendChild(ticket);
      }
    }
  });
  let roomTicketCouner = document.querySelector(".loto-gamecontrolls__counter");
  if (roomTicketCouner) {
    let counterValue = roomTicketCouner.querySelector(
      ".loto-gamecontrolls__counter__value"
    );
    counterValue.innerHTML = boughtTicketsCounter;
  }
}

export function showUserTicketsInLobby(tickets, roomId) {
  tickets.forEach((ticket) => {
    if (ticket.gameLevel == roomId) {
      let cells = JSON.parse(ticket.card);
      let id = ticket.id;
      let ticketsBody = document.querySelector(".loto-gamemain");
      if (ticketsBody) {
        let ticket = document.createElement("ul");
        ticket.classList.add("loto-gamemain__ticket", "bought-ticket");
        ticket.setAttribute("id", id);
        cells.forEach((cell) => {
          let ticketCell = document.createElement("li");
          ticketCell.classList.add("ticket-cell");
          ticketCell.innerHTML = cell;
          ticket.appendChild(ticketCell);
        });
        ticketsBody.appendChild(ticket);
      }
    }
  });
}

export function createCask(cask, caskNumber, pastCasks) {
  let gameprocessBlock = document.querySelector(".loto-game-room__gameprocess");
  let caskBlock = document.createElement("div");

  caskBlock.classList.add("loto-game-room__cask");
  caskBlock.innerHTML = cask;

  let caskNumberBlock = document.createElement("span");
  caskNumberBlock.innerHTML = caskNumber;
  caskNumberBlock.classList.add("cask-number");

  // убираем все бочки что старее 5
  if (gameprocessBlock.children.length > 5) {
    gameprocessBlock.removeChild(gameprocessBlock.children[0]);
  }
  // убираем все цвета с бочек
  gameprocessBlock.querySelectorAll(".loto-game-room__cask").forEach((cask) => {
    cask.style.background = "#fff";
  });
  // удаляем предидущик номера бочки
  let allOldCasks = document.querySelectorAll(".cask-number");
  allOldCasks.forEach((oldCaskNum) => {
    if (oldCaskNum) {
      oldCaskNum.remove();
    }
  });
  // Устанавливаем желтый цвет только для последней вставленной бочки
  caskBlock.style.background = "#cac832";
  caskBlock.appendChild(caskNumberBlock);
  gameprocessBlock.appendChild(caskBlock);

  // получаем состояние кнопки авто
  let buttonAuto = document.querySelector(".auto-play");
  if (buttonAuto) {
    if (buttonAuto.classList.contains("active")) {
      colorCask(cask, pastCasks);
    } else if (!buttonAuto.classList.contains("active")) {
      selectCaskByFinger(pastCasks);
    }
  }
}

function selectCaskByFinger(pastCasks) {
  let ticketsBody = document.querySelector(".loto-game-room__main");
  if (ticketsBody) {
    // удалить все евент листенеры с билетов
    let pastTickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
    
    let listeners = [];
    pastTickets.forEach((ticket, index) => {
      let ticketCells = ticket.querySelectorAll(".ticket-cell");
      ticketCells.forEach((cell) => {
      
        cell.removeEventListener("click", listeners[index]);
      });
    });

    // добавить новый евент листенер на билеты
    let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
    tickets.forEach((ticket) => {
      let ticketCells = ticket.querySelectorAll(".ticket-cell");
      ticketCells.forEach((cell) => {
        let listener = colorThisCask(cell, pastCasks);
        listeners.push(listener);
        cell.addEventListener("click", listener);
      });
    });
  }

  function colorThisCask(cell, pastCasks) {
    return function (event) {
      let thisCellNumber = Number(cell.innerHTML);
      if (pastCasks.includes(thisCellNumber)) {
        cell.classList.add("active");
        if (localStorage.getItem("cask-color")) {
          cell.style.background = localStorage.getItem("cask-color");
        }
      }
    };
  }
}

function colorCask(cask, pastCasks) {
  let ticketsBody = document.querySelector(".loto-game-room__main");
  if (ticketsBody) {
    let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
    // заполнение старых цифр которые сейчас не заполнены
    tickets.forEach((ticket) => {
      let ticketCells = ticket.querySelectorAll(".ticket-cell");
      ticketCells.forEach((cell) => {
        if (!cell.classList.contains("active")) {
          if (pastCasks.includes(Number(cell.innerHTML))) {
            cell.classList.add("active");
            if (localStorage.getItem("cask-color")) {
              cell.style.background = localStorage.getItem("cask-color");
            }
          }
        }
      });
    });

    // показ новой цифры
    tickets.forEach((ticket) => {
      let ticketCells = ticket.querySelectorAll(".ticket-cell");
      ticketCells.forEach((cell) => {
        if (cell.innerHTML == cask) {
          cell.classList.add("active");
          if (localStorage.getItem("cask-color")) {
            cell.style.background = localStorage.getItem("cask-color");
          }
        }
      });
    });
  }
}

export function checkWin(winners, bank, winnersAmount, ws, isJackpotWon) {
  let winnersIds = winners;
  let ticketsBody = document.querySelector(".loto-game-room__main");
  if (ticketsBody) {
    let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
    let winTickets = 0;
    tickets.forEach((ticket) => {
      let ticketId = ticket.getAttribute("id");
      if (winnersIds.includes(ticketId)) {
        winTickets++;
      }
    });

    const wonSum = (bank / winnersAmount) * winTickets;

    let jackpotWonMessage = "";
    if (isJackpotWon) {
      jackpotWonMessage = "Джекпот был выигран!";
    } else {
      jackpotWonMessage = "Джекпот не был выигран.";
    }

    if (winTickets > 0) {
      impPopup.open(
        `Общее количество победивших билетов ${winnersAmount}. Из них ваших ${winTickets}, сума выигрыша ${wonSum}. Поздравляем! \n${jackpotWonMessage}`,
        200,
        true,
        ws
      );
      return;
    } else {
      impPopup.open(
        `К сожалению вы не смогли выиграть попробуйте еще раз. \n${jackpotWonMessage}`,
        300,
        true,
        ws
      );
    }
  }
}

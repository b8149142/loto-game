import * as impHttp from "./http.js";
import * as impLotoGame from "./loto-game.js";
import * as impLotoNavigation from "./loto-navigation.js";
import * as impLeadersFunc from "./leaders.js";
import * as impSettingsFunc from "./settings.js";
import * as impProfileFunc from "./profile.js";
import * as impLotoNav from "./loto-navigation.js";

// let game = document.querySelector(".games");
// let lotoRooms = game.querySelectorAll(".loto-room");
// event listeners

export function addListeners(ws) {
  let game = document.querySelector(".games");
  let lotoRooms = game.querySelectorAll(".loto-room");

  lotoRooms.forEach((room) => {
    room.addEventListener("click", () => {
      const roomId = room.getAttribute("room");

      impLotoNavigation.openLotoRoom(ws, roomId);
    });
  });
}

export function redirectToMainPage(ws) {
  const main = document.querySelector("main");
  main.innerHTML = `
  <div class="main__container">
  <section class="games">
    <div class="games__container" id="loto">
      <a class="game loto-room loto-room-1" room="1">
        <div class="loto-room__body">
          <p class="game__title">Лото</p>
          <p>Онлайн: <span class="game__room-online">0</span></p>
          <p>Ставка: <span class="game__bet">0.20</span>М</p>
          <div class="game__until-start">
            <p>До начала:</p>
            <span class="game__until-start-timer">00:00</span>
          </div>
          <div class="game__until-finish">
            <p>До конца:</p>
            <span class="game__until-finish-timer">00:00</span>
          </div>
          <p class="game__room-bank">
            Общий банк: <span class="game__room-bank-sum">0</span>М
          </p>
          <p class="game__room-bank">
            Пред. банк: <span class="game__room-prevbank-sum">0</span>М
          </p>
          <p class="game__room-jackpot">
            Джекпот: <span class="game__room-jackpot-sum">0</span>М
          </p>
        </div>
      </a>
      <a class="game loto-room loto-room-2" room="2">
        <div class="loto-room__body">
          <p class="game__title">Лото</p>
          <p>Онлайн: <span class="game__room-online">0</span></p>
          <p>Ставка: <span class="game__bet">0.50</span>М</p>
          <p class="game__until-start">
            До начала: <span class="game__until-start-timer">00:00</span>
          </p>
          <div class="game__until-finish">
            <p>До конца:</p>
            <span class="game__until-finish-timer">00:00</span>
          </div>
          <p class="game__room-bank">
            Общий банк: <span class="game__room-bank-sum">0</span>М
          </p>
          <p class="game__room-bank">
            Пред. банк: <span class="game__room-prevbank-sum">0</span>М
          </p>
          <p class="game__room-jackpot">
            Джекпот: <span class="game__room-jackpot-sum">0</span>М
          </p>
        </div>
      </a>
      <a class="game loto-room loto-room-3" room="3">
        <div class="loto-room__body">
          <p class="game__title">Лото</p>
          <p>Онлайн: <span class="game__room-online">0</span></p>
          <p>Ставка: <span class="game__bet">1</span>М</p>
          <p class="game__until-start">
            До начала: <span class="game__until-start-timer">00:00</span>
          </p>
          <div class="game__until-finish">
            <p>До конца:</p>
            <span class="game__until-finish-timer">00:00</span>
          </div>
          <p class="game__room-bank">
            Общий банк: <span class="game__room-bank-sum">0</span>М
          </p>
          <p class="game__room-bank">
            Пред. банк: <span class="game__room-prevbank-sum">0</span>М
          </p>
          <p class="game__room-jackpot">
            Джекпот: <span class="game__room-jackpot-sum">0</span>М
          </p>
        </div>
      </a>
      <a class="game loto-room loto-room-4" room="4">
        <div class="loto-room__body">
          <p class="game__title">Лото</p>
          <p>Онлайн: <span class="game__room-online">0</span></p>
          <p>Ставка: <span class="game__bet">5</span>М</p>
          <p class="game__until-start">
            До начала: <span class="game__until-start-timer">00:00</span>
          </p>
          <div class="game__until-finish">
            <p>До конца:</p>
            <span class="game__until-finish-timer">00:00</span>
          </div>
          <p class="game__room-bank">
            Общий банк: <span class="game__room-bank-sum">0</span>М
          </p>
          <p class="game__room-bank">
            Пред. банк: <span class="game__room-prevbank-sum">0</span>М
          </p>
          <p class="game__room-jackpot">
            Джекпот: <span class="game__room-jackpot-sum">0</span>М
          </p>
        </div>
      </a>
      <a class="game loto-room loto-room-5" room="5">
        <div class="loto-room__body">
          <p class="game__title">Лото</p>
          <p>Онлайн: <span class="game__room-online">0</span></p>
          <p>Ставка: <span class="game__bet">10</span>М</p>
          <p class="game__until-start">
            До начала: <span class="game__until-start-timer">00:00</span>
          </p>
          <div class="game__until-finish">
            <p>До конца:</p>
            <span class="game__until-finish-timer">00:00</span>
          </div>
          <p class="game__room-bank">
            Общий банк: <span class="game__room-bank-sum">0</span>М
          </p>
          <p class="game__room-bank">
            Пред. банк: <span class="game__room-prevbank-sum">0</span>М
          </p>
          <p class="game__room-jackpot">
            Джекпот: <span class="game__room-jackpot-sum">0</span>М
          </p>
        </div>
      </a>
    </div>
  </section>
</div>
  `;
  addListeners(ws);
  // добавляем навигацию сайта
  let footer = document.querySelector("#footer");
  if (footer && footer.classList.contains("d-none")) {
    footer.classList.remove("d-none");
  }
}

export function pageNavigation(ws) {
  createPageNavBlock();
  let navMenu = document.querySelector(".menu-footer");
  if (navMenu) {
    let openGamesLobbyBtn = document.querySelector(".open-games-menu");
    let openLeadersMenuBtn = document.querySelector(".open-liders-menu");
    let openSettingsBtn = document.querySelector(".open-settings");
    let openProfileBtn = document.querySelector(".open-profile");

    // открытие страници лидеров
    openLeadersMenuBtn.addEventListener("click", function () {
      // ws.close();
      impLeadersFunc.openLeadersMenuPage();
    });

    // открытие страницы с играми
    openGamesLobbyBtn.addEventListener("click", function () {
      let isCurrGameMenuPage = document.querySelector(".games");
      if (!isCurrGameMenuPage) {
        ws.send(
          JSON.stringify({
            username: window.username,
            userId: window.userId,
            method: "getAllInfo",
          })
        );

        redirectToMainPage(ws);
        // pageNavigation(newWs);
      }
    });

    // открытие страницы с настройками
    openSettingsBtn.addEventListener("click", function () {
      // ws.close();
      impSettingsFunc.openSettingsPage();
    });

    // открытие страницы с профилем
    openProfileBtn.addEventListener("click", function () {
      // ws.close();
      impProfileFunc.openProfilePage();
    });
  }
}

export function createPageNavBlock() {
  let footer = document.querySelector("#footer");
  if (footer) {
    footer.innerHTML = `<div class="footer__container">
    <div class="foter__content">
      <div class="footer__menu menu-footer">
        <div class="menu-footer__item open-profile">Профиль</div>
        <div class="menu-footer__item">Чат</div>
        <div
          class="menu-footer__item menu-footer__main-item open-games-menu"
        >
          Игры
        </div>
        <div class="menu-footer__item open-liders-menu">Лидеры</div>
        <div class="menu-footer__item open-settings">Настройки</div>
      </div>
    </div>
  </div>`;
  }
}

export const updateBalance = (balance) => {
  balance = balance.toFixed(2);
  let balanceSpan = document.querySelector(".header__balance");
  if (balanceSpan) {
    balanceSpan.innerHTML = balance;
  }
};

export function openSettingsPage() {
  let main = document.querySelector("main");
  if (main) {
    main.innerHTML = `<div class="main__container">
      <section class="settings-page">
        <div class="settings-page-header">
          <h3 class="settings-page-header__title">Настройки</h3>
        </div>
        <div class="settings-page-main">
          <div class="settings-page-main__block settings-block">
            <div class="settings-block__item settings-item">
              <h4 class="settings-item__title">Цвет выпавших боченков</h4>
              <div class="settings-item__colors">
                <div
                  color="red"
                  color-code="#FF5F5F"
                  class="red active"
                ></div>
                <div color="purple" color-code="#C870FF" class="purple"></div>
                <div color="yellow" color-code="#FCFF51" class="yellow"></div>
              </div>
            </div>

            <div class="settings-block__item settings-item">
              <h4 class="settings-item__title">Звуки</h4>
              <div class="settings-item__sounds">
                <div class="settings-item__sounds-item">
                  <span>Игра</span>
                  <input type="checkbox" checked="true" />
                </div>
                <div class="settings-item__sounds-item">
                  <span>Меню</span>
                  <input type="checkbox" checked="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>`;
    addListeners();
  }
}

const addListeners = () => {
  const colors = document.querySelectorAll(".settings-item__colors div");
  colors.forEach((color) => {
    color.addEventListener("click", () => {
      colors.forEach((color) => color.classList.remove("active"));
      color.classList.add("active");
      localStorage.setItem("cask-color", color.getAttribute("color-code"));
    });
  });
};

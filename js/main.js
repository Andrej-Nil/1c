class Service {

  constructor() {
    this.POST = 'GET';
    this.GET = 'GET';
    this.token = this.getToken();

    this.categoriesApi = './../json/submenu.json'
  }

  getCategories = (id) => {
    const data = {
      id: id,
      _token: this.token
    }
    const formData = this.createFormData(data)
    return this.getResponse(this.POST, formData, this.categoriesApi);
  }

  getResponse = async (method, data, api) => {
    return await new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      let response = null
      xhr.open(method, api, true);
      xhr.send(data);
      xhr.onload = function () {
        if (xhr.status != 200) {
          console.log('Произошла ошибка ' + xhr.status);
          resolve({ error: 'Произошла ошибка ' + xhr.status });
          return;
        } else {
          response = JSON.parse(xhr.response);
          resolve(response);
        }
      };
      xhr.onerror = function () {
        reject(new Error("Network Error"))
        resolve({ error: 'Произошла ошибка ' + xhr.status });
      };
    })
  }

  createFormData = (data) => {
    const formData = new FormData()
    for (let key in data) {
      formData.append(`${key}`, data[key])
    }
    return formData;
  }

  getToken = () => {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  }
}

class Render {
  constructor() {

  }


  renderSidebarSubmenu = ($parent, list) => {
    if ($parent.dataset.content === 'only-link') {
      this._render($parent, this.getSidebarSubmenuLvl2Html, list);
    } else {
      this._render($parent, this.getSidebarSubmenuHtml, list);
    }

  }


  renderLoader = ($parent) => {
    this._render($parent, this.getLoaderHtml);
  }

  renderError = ($parent, massage) => {
    this._render($parent, this.getErrorHtml, massage);
  }



  getSidebarSubmenuHtml = (list) => {
    const itemList = this.getListHtml(this.getSidebarSubmenuListHtml, list);
    return /*html*/`
      <ul class="sidebar-submenu__list">
        ${itemList}
      </ul>
    `
  }


  getSidebarSubmenuLvl2Html = (list) => {
    const itemList = this.getListHtml(this.getSidebarSubmenuLink, list);
    return /*html*/`
      <ul class="sidebar-submenu__list">
        ${itemList}
      </ul>
    `
  }
  getSidebarSubmenuListHtml = (item) => {
    if (item.submenu) {
      return this.getSidebarSubmenuItem(item);
    } else {
      return this.getSidebarSubmenuLink(item);
    }
  }



  getSidebarSubmenuItem = (item) => {

    return /*html*/`
      <li class="sidebar-submenu__item">
        <span data-submenu-id="${item.id}" data-type="submenu-two" class="sidebar-submenu__link">
          <span class="sidebar-nav__label">
            ${item.label}
          </span>
          <i class="sidebar-nav__arrow"></i>
        </span>
      </li>
      `
  }

  getSidebarSubmenuLink = (item) => {
    return /*html*/`
      <li class="sidebar-submenu__item">
        <a href="${item.slug}" class="sidebar-submenu__link">
          <span class="sidebar-nav__label">
            ${item.label}
          </span>
        </a>
      </li>
      `
  }


  getLoaderHtml = () => {
    return /*html*/`
      <div class="loader">
        <img class="loader__spinner" src="./image/logo.png" alt="">
        <p class="loader__text">Загружаю</p>
    </div>
  `
  }

  getErrorHtml = (text) => {
    if (text === undefined) {
      text = 'Неудалось получить данные. Попробуйте обновить страницу.'
    }
    return /*html*/`
      <div class="error">
        <img src="./image/icon/oops.png" alt="" class="error__img">
        <p class="error__text">${text}</p>
      </div>
    `
  }

  getListHtml = (getHtmlFn, arr) => {
    let list = '';
    arr.forEach((item) => {

      list += getHtmlFn(item);
    })

    return list;
  }
  clearParent = ($parent = this.$parent) => {
    if (!$parent) {
      return;
    }
    $parent.innerHTML = '';
  }

  delete = (selector) => {
    const $el = this.$parent.querySelector(selector);
    $el.remove()
  }

  _render = ($parent, getHtmlMarkup, argument = false, array = false, where = 'beforeend') => {
    let markupAsStr = '';
    if (!$parent) {
      return;
    }
    if (array) {
      array.forEach((item) => {
        markupAsStr = markupAsStr + getHtmlMarkup(item);
      })
    }
    if (!array) {
      markupAsStr = getHtmlMarkup(argument);
    }
    $parent.insertAdjacentHTML(where, markupAsStr);
  }

}


class Sidebar {
  constructor(id) {
    this.$sidebar = document.querySelector(id);
    this.init();

  }


  init = () => {
    if (!this.$sidebar) return;
    this.$submenuOne = this.$sidebar.querySelector('#submenu');
    this.$submenuTwo = this.$sidebar.querySelector('#submenuTwo');
    this.listeners();
  }

  open($submemu) {
    $submemu.classList.add('open');
  }

  close($btn) {
    const type = $btn.dataset.close;
    if (type === 'submenu-one') {
      this.$submenuOne.classList.remove('open');
      this.$submenuTwo.classList.remove('open');
    }
    if (type === 'submenu-two') {
      this.$submenuTwo.classList.remove('open');
    }
  }

  createSubmenuContent = async ($submenu, id) => {
    const $submenuContent = $submenu.querySelector('[data-content]');
    render.clearParent($submenuContent);
    render.renderLoader($submenuContent);

    const response = await service.getCategories(id);
    if (response.error) {
      render.clearParent($submenuContent);
      render.renderError($submenuContent);
    }
    if (response.content) {
      render.clearParent($submenuContent);
      render.renderSidebarSubmenu($submenuContent, response.content);
    }

  }

  showSubmenuHadler = ($item) => {
    const id = $item.dataset.submenuId;
    const type = $item.dataset.type;
    if (type === 'submenu-one') {
      this.open(this.$submenuOne);
      this.createSubmenuContent(this.$submenuOne, id);
    }
    if (type === 'submenu-two') {
      this.open(this.$submenuTwo);
      this.createSubmenuContent(this.$submenuTwo, id);
    }
  }



  clickHandler = (e) => {
    if (e.target.closest('[data-submenu-id]')) {
      this.showSubmenuHadler(e.target.closest('[data-submenu-id]'));
    }
    if (e.target.closest('[data-close]')) {
      this.close(e.target.closest('[data-close]'));
    }
  }

  listeners = () => {
    this.$sidebar.addEventListener('click', this.clickHandler);
  }
}

const service = new Service();
const render = new Render();
const sidebar = new Sidebar('#sidebar');
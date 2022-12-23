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

  renderDropdown = ($parent, list) => {
    this._render($parent, this.getDropdownListHtml, list);
  }


  renderLoader = ($parent) => {
    this._render($parent, this.getLoaderHtml, true);
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
          <span class="submenu-nav__label">
            ${item.label}
          </span>
          <i class="submenu-nav__arrow"></i>
        </span>
      </li>
      `
  }

  getSidebarSubmenuLink = (item) => {
    return /*html*/`
      <li class="sidebar-submenu__item">
        <a href="${item.slug}" class="sidebar-submenu__link">
          <span class="submenu-nav__label">
            ${item.label}
          </span>
        </a>
      </li>
      `
  }

  getDropdownListHtml = (list) => {
    const itemList = this.getListHtml(this.getDropdownListItemsHtml, list);
    return /*html*/`
      <ul class="nav-list nav-list_sub">
        ${itemList}
      </ul>
    `
  }

  getDropdownListItemsHtml = (item) => {
    if (item.submenu) {
      return this.getDropdownItem(item);
    } else {
      return this.getDropdownLink(item);
    }
  }

  getDropdownItem = (item) => {
    return /*html*/`
      <li data-dropdown="${item.id}" class="nav-item">

        <div data-dropdown-btn="close" class="nav-item__title">
          <i data-dropdown-icon class="nav-item__indicator close"></i>
          <span class="nav-item__label">
            ${item.label}
          </span>
        </div>
        <div data-dropdown-content class="nav-item__sublist close">

        </div>
      </li>
    `
  }

  getDropdownLink = (item) => {
    return /*html*/`
    <li class="nav-item">
      <a href="${item.slug}" class="nav-item__title">
        <i class="nav-item__indicator file"></i>
        <span class="nav-item__label">
          ${item.label}
        </span>
      </a>
    </li>
  `
  }
  getLoaderHtml = (mini) => {
    const cls = ['loader']
    if (mini) cls.push('loader_mini')
    return /*html*/`
      <div class="${cls.join(' ')}" >
        <img class="loader__spinner" src="./image/logo.png" alt="">
        <p class="loader__text">Загружаю</p>
      </div>
    `
  }

  getErrorHtml = (text) => {
    if (!text) {
      text = 'Неудалось получить данные. Попробуйте обновить страницу.';
    }
    return /*html*/`
      <div div class="error" >
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
    this.$openBtn = this.$sidebar.querySelector('[data-open-sidebar]');
    this.$closeBtn = this.$sidebar.querySelector('[data-close-sidebar]');
    this.listeners();
  }

  openSubmenu($submemu) {
    this.$sidebar.classList.remove('sidebar_mini');
    $submemu.classList.add('open');
    this.openSidebar();
  }

  closeSubmenu($btn) {
    const type = $btn.dataset.close;
    if (type === 'submenu-one') {
      this.$submenuOne.classList.remove('open');
      this.$submenuTwo.classList.remove('open');
      this.toggleSidebar();
    }
    if (type === 'submenu-two') {
      this.$submenuTwo.classList.remove('open');
      //this.toggleSidebar();
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
      this.openSubmenu(this.$submenuOne);
      this.createSubmenuContent(this.$submenuOne, id);
    }
    if (type === 'submenu-two') {
      this.openSubmenu(this.$submenuTwo);
      this.createSubmenuContent(this.$submenuTwo, id);
    }
  }

  openSidebar = () => {
    this.$sidebar.dataset.status = "open";
    this.$sidebar.classList.remove('sidebar_mini');
  }

  closeSidebar = () => {
    this.$sidebar.dataset.status = "close";
    this.$sidebar.classList.add('sidebar_mini');
  }



  openSidebarMobile = () => {
    this.$sidebar.classList.add('sidebar_open');
    this.showBtn(this.$closeBtn);
    this.hideBtn(this.$openBtn);
  }
  closeSidebarMobile = () => {
    this.$sidebar.classList.remove('sidebar_open');
    this.showBtn(this.$openBtn);
    this.hideBtn(this.$closeBtn);

  }


  showBtn = ($btn) => {
    $btn.classList.add('show');
  }

  hideBtn = ($btn) => {
    $btn.classList.remove('show');
  }

  toggleSidebar = () => {
    if (this.$sidebar.hasAttribute('data-not-mini')) return;
    const sidebarStatus = this.$sidebar.dataset.status;
    if (sidebarStatus === 'open') {
      this.closeSidebar()
      return;
    }
    if (sidebarStatus === 'close') {
      this.openSidebar()
      return;
    }
  }

  clickHandler = (e) => {
    if (e.target.closest('[data-submenu-id]')) {
      this.showSubmenuHadler(e.target.closest('[data-submenu-id]'));
    }
    if (e.target.closest('[data-close]')) {
      this.closeSubmenu(e.target.closest('[data-close]'));
    }

    if (e.target.closest('[data-open-sidebar]')) {
      this.openSidebarMobile();
    }
    if (e.target.closest('[data-close-sidebar]')) {
      this.closeSidebarMobile();
    }
  }

  listeners = () => {
    this.$sidebar.addEventListener('click', this.clickHandler);
  }
}
class Dropdown {
  constructor() {
    this.$dropdown = null;
    this.$dropdownContent = null;
    this.$dropdownIcon = null;
    this.$btn = null;
    this.init();
  }

  init = () => {
    this.listeners();
  }

  open = () => {
    this.$btn.dataset.dropdownBtn = 'open';
    this.$dropdownContent.classList.remove('close');
    this.$dropdownIcon.classList.add('open');
    this.$dropdownIcon.classList.remove('close');
    if (this.$dropdownContent.querySelector('ul')) return
    render.renderLoader(this.$dropdownContent);
    this.createListHandler();
  }

  createListHandler = async () => {
    const id = this.$dropdown.dataset.dropdown;
    const response = await service.getCategories(id);

    if (response.error) {
      render.clearParent(this.$dropdownContent);
      render.renderError(this.$dropdownContent);
    }
    if (response.content) {
      render.clearParent(this.$dropdownContent);
      render.renderDropdown(this.$dropdownContent, response.content);
    }

  }

  close = () => {
    this.$btn.dataset.dropdownBtn = 'close';
    this.$dropdownIcon.classList.remove('open');
    this.$dropdownIcon.classList.add('close');
    this.$dropdownContent.classList.add('close');
  }

  toggleDropdown = ($targetEl) => {

    this.$btn = $targetEl;
    this.$dropdown = $targetEl.closest('[data-dropdown]');
    this.$dropdownContent = this.$dropdown.querySelector('[data-dropdown-content]');
    this.$dropdownIcon = this.$dropdown.querySelector('[data-dropdown-icon]');
    const status = this.$btn.dataset.dropdownBtn;
    if (status === 'open') {
      this.close();
      return;
    }

    if (status === 'close') {
      this.open();
      return;
    }
  }

  clickHandler = (e) => {
    if (e.target.closest('[data-dropdown-btn]')) {
      this.toggleDropdown(e.target.closest('[data-dropdown-btn]'));
    }
  }

  listeners = () => {
    document.addEventListener('click', this.clickHandler);
  }
}

class SidebarSearch {
  constructor(id) {
    this.$searchForm = document.querySelector(id)
    this.init();
  }

  init = () => {
    if (!this.$searchForm) return;
    this.$input = this.$searchForm.querySelector('[data-input]');
    this.$openBtn = this.$searchForm.querySelector('[data-input-open]');
    this.$closeBtn = this.$searchForm.querySelector('[data-input-close]');
    this.listeners();
  }

  open = () => {
    this.$searchForm.classList.add('search__form_active');
    this.showCloseBtn();
    this.showInput();
  }

  close = () => {
    this.$searchForm.classList.remove('search__form_active');
    this.hideCloseBtn();
    this.hideInput();
  }

  showCloseBtn = () => {
    this.$closeBtn.classList.add('show');
  }

  hideCloseBtn = () => {
    this.$closeBtn.classList.remove('show');
  }
  showInput = () => {
    this.$input.classList.add('show');
  }

  hideInput = () => {
    this.$input.classList.remove('show');
  }

  clickHandler = (e) => {
    if (e.target.closest('[data-input-open]')) {
      this.open()
    }
    if (e.target.closest('[data-input-close]')) {
      this.close()
    }
  }
  listeners = () => {
    this.$searchForm.addEventListener('click', this.clickHandler);
  }


}

class NavBlock {
  constructor(id) {
    this.$navBlock = document.querySelector(id);
    this.init();
  }
  init = () => {
    if (!this.$navBlock) return;
    this.$navBlockBtn = document.querySelector('navBlockBtn');
  }
}

class Navigation {
  constructor(id) {
    this.$nav = document.querySelector(id);
    this.$openBtn = document.querySelector('[data-mabile-menu-open]');
    this.$closeBtn = document.querySelector('[data-mabile-menu-close]');
    this.init();
  }

  init = () => {
    if (!this.$nav) return;
    this.listeners();
  }

  open = () => {
    this.$nav.classList.add('open');
  }

  close = () => {
    this.$nav.classList.remove('open');
  }

  listeners = () => {
    this.$openBtn.addEventListener('click', this.open);
    this.$closeBtn.addEventListener('click', this.close);
  }
}

const service = new Service();
const render = new Render();
const sidebar = new Sidebar('#sidebar');
const dropdown = new Dropdown();
const sidebarSearch = new SidebarSearch('#searchForm');
const navigation = new Navigation('#navigation');
const navBlock = new NavBlock('#navBlock');
class Service {

  constructor() {
    this.POST = 'GET';
    this.GET = 'GET';
    this.token = this.getToken();

    //this.categoriesApi = '/api/menu';
    //this.selectApi = '/api/category';

    this.categoriesApi = './../json/submenu.json';
    this.selectApi = './../json/submenu.json';
  }

  getCategories = (id) => {
    const data = {
      id: id,
      _token: this.token
    }
    const formData = this.createFormData(data);
    return this.getResponse(this.POST, formData, this.categoriesApi);
  }

  getSelectOptions = (id) => {
    const data = {
      id: id,
      _token: this.token
    }
    const formData = this.createFormData(data);
    return this.getResponse(this.POST, formData, this.selectApi);
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

  renderError = ($parent, message) => {
    this._render($parent, this.getErrorHtml, message);
  }

  renderPathItem = ($parent, data) => {
    this._render($parent, this.getPathItemHtml, data);
  }

  renderSelectOption = ($parent, list) => {
    this.clearParent($parent);
    list.unshift({ id: '0', label: 'Выбор' })
    this._render($parent, this.getSelectOptionHtml, false, list);
  }
  renderItemPathError($parent) {
    this.clearParent($parent);
    this._render($parent, this.getPathItemErrorHtml, true);
  }

  renderBigPicModal = ($parent, src) => {
    this._render($parent, this.getBigPicModalHtml, src);
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
          <span data-item-label class="submenu-nav__label">
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

  getPathItemHtml = (data) => {
    return /*html*/`
      <span data-selected-item class="selected-item" data-id="${data.id}">
        <span class="selected-item__label">${data.title}</span>
        <i data-delete-item class="selected-item__delete"></i>
      </span>
    `
  }

  getPathItemErrorHtml = () => {
    return /*html*/`
      <option value="error">Произошла ошибка</option>
    `
  }

  getSelectOptionHtml = (data) => {
    return /*html*/`
      <option value="${data.id}">${data.label}</option>
    `
  }

  getBigPicModalHtml = (data) => {

    return /*html*/`
      <div id="bigPictureModal" class="big-picture">
        <img class="big-picture__img"
          src="${data}" alt="">
        <i data-big-img-close class="big-picture__close"></i>
      </div>
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

  /**/

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

  deleteEl = ($el) => {
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

  changeSubmenuTitle = ($submenu, title) => {
    const $title = $submenu.querySelector('[data-submenu-title]');
    $title.innerHTML = title;
  }

  openSubmenu($submemu) {
    this.$sidebar.classList.remove('sidebar_mini');
    $submemu.classList.add('open');
    this.openSidebar();
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

  openSubmenuLvlOne = (id, submenuTitle) => {
    this.changeSubmenuTitle(this.$submenuOne, submenuTitle);
    this.openSubmenu(this.$submenuOne);
    this.closeSubmenuLvlTwo();
    this.createSubmenuContent(this.$submenuOne, id);
  }

  openSubmenuLvlTwo = (id, submenuTitle) => {
    this.changeSubmenuTitle(this.$submenuTwo, submenuTitle);
    this.openSubmenu(this.$submenuTwo);
    this.createSubmenuContent(this.$submenuTwo, id);
  }

  closeSubmenuLvlOne = () => {
    this.$submenuOne.classList.remove('open');
    this.$submenuTwo.classList.remove('open');
    this.toggleSidebar();
  }


  closeSubmenuLvlTwo = () => {
    this.$submenuTwo.classList.remove('open');
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

  showSubmenuHadler = ($item) => {
    const id = $item.dataset.submenuId;
    const type = $item.dataset.type;
    const $label = $item.querySelector('[data-item-label]');
    const submenuTitle = $label.innerHTML.trim();
    if (type === 'submenu-one') {
      this.openSubmenuLvlOne(id, submenuTitle);
    }
    if (type === 'submenu-two') {
      this.openSubmenuLvlTwo(id, submenuTitle);
    }
  }

  closeSubmenuHandler($btn) {
    const type = $btn.dataset.close;
    if (type === 'submenu-one') {
      this.closeSubmenuLvlOne();
    }
    if (type === 'submenu-two') {
      this.closeSubmenuLvlTwo();
    }
  }

  clickHandler = (e) => {
    if (e.target.closest('[data-submenu-id]')) {
      this.showSubmenuHadler(e.target.closest('[data-submenu-id]'));
    }
    if (e.target.closest('[data-close]')) {
      this.closeSubmenuHandler(e.target.closest('[data-close]'));
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
    if (this.$dropdownContent.querySelector('ul')) return;
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
    this.$navBlockBtn = document.querySelector(id);
    this.init();
  }
  init = () => {
    if (!this.$navBlockBtn) return;
    this.$navBlock = document.querySelector('#navBlock');
    this.$boardBlock = document.querySelector('#boardBlock');
    this.listeners();
  }

  openNavBlock = () => {
    this.$navBlock.classList.add('open')
  }

  closeNavBlock = () => {
    this.$navBlock.classList.remove('open')
  }

  shiftBoardBlock = () => {
    this.$boardBlock.classList.add('shifted');
  }

  unshiftBoardBlock = () => {
    this.$boardBlock.classList.remove('shifted');
  }
  turnBtnToLeft = () => {
    this.$navBlockBtn.classList.add('turned');
    this.$navBlockBtn.dataset.status = 'open';
  }

  turnBtnToRight = () => {
    this.$navBlockBtn.classList.remove('turned');
    this.$navBlockBtn.dataset.status = 'close';
  }

  expand = () => {
    this.turnBtnToLeft();
    this.openNavBlock();
    this.shiftBoardBlock();

  }

  narrow = () => {
    this.turnBtnToRight();
    this.closeNavBlock();
    this.unshiftBoardBlock();
  }



  toggleBlock = () => {

    const status = this.$navBlockBtn.dataset.status;
    if (status === 'close') {
      this.expand();

      return;
    }
    if (status === 'open') {
      this.narrow();

      return;
    }
  }
  listeners = () => {
    this.$navBlockBtn.addEventListener('click', this.toggleBlock);
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
class CategorySelect {
  constructor(id) {
    this.$select = document.querySelector(id);
    this.init();
  }

  init = () => {
    if (!this.$select) return;
    this.$formPath = document.querySelector('#formPath');
    this.$input = document.querySelector('[data-input-id]');
    this.id = '';
    this.$currentOptions = null;
    this.listeners()
  }

  addPathItem = () => {
    const $selectOption = this.getOptopn();
    const data = this.getOptionData($selectOption);
    this.$input.value = data.id;
    render.renderPathItem(this.$formPath, data);
  }

  removePathItems = ($selectItem) => {
    const idx = this.getSelectedOptionIdx($selectItem);
    this.cropPath(idx);
  }

  getSelectedOptionIdx = ($selectItem) => {
    const $selectItems = this.$formPath.querySelectorAll('[data-selected-item]');
    let index;
    $selectItems.forEach(($item, idx) => {
      if ($item === $selectItem) {
        index = idx;
      }
    })
    return index;
  }

  cropPath = (index) => {
    const $selectItems = this.$formPath.querySelectorAll('[data-selected-item]');
    $selectItems.forEach(($item, idx) => {
      if (index <= idx) {
        render.deleteEl($item);
      }
    })
  }

  removePathItemHandler = async ($btn) => {
    this.$select.disabled = true;
    const $selectedItem = $btn.closest('[data-selected-item]');
    this.removePathItems($selectedItem);
    this.prevCategoryId = this.getPrevCategoryId();
    this.$input.value = this.prevCategoryId;
    const response = await service.getSelectOptions(this.prevCategoryId);
    this.createSelectContent(response);
  }

  createSelectContent = (data) => {
    if (data.error) {
      render.renderItemPathError(this.$select);
    }
    if (data.content) {
      render.renderSelectOption(this.$select, data.content);
      this.$select.disabled = false;
    }
  }

  updateOptions = async () => {
    this.$select.disabled = true;

    const response = await service.getSelectOptions(this.id);
    this.createSelectContent(response);
    if (response.error) return true;
  }


  selectHandler = async () => {
    this.id = this.$select.value;
    this.$currentOptions = this.$select.querySelectorAll('option');
    const rez = await this.updateOptions();
    if (rez) return;
    this.addPathItem();
  }


  getPrevCategoryId = () => {
    const $selectedItems = this.$formPath.querySelectorAll('[data-selected-item]');
    if ($selectedItems.length === 0) return '';
    const idx = $selectedItems.length - 1;
    return $selectedItems[idx].dataset.id;
  }

  getOptopn = () => {
    for (let i = 0; i < this.$currentOptions.length; i++) {
      if (this.$currentOptions[i].value == this.id) {
        return this.$currentOptions[i];
      }
    }
  }

  getOptionData = ($option) => {
    return {
      id: $option.value,
      title: $option.innerHTML
    }
  }

  changeHandler = (e) => {
    if (e.target.id === 'categoriesSelect') {
      this.selectHandler();
    }

  }

  clickHandler = (e) => {
    if (e.target.closest('[data-delete-item]')) {
      this.removePathItemHandler(e.target.closest('[data-delete-item]'));
    }

  }

  listeners = () => {
    this.$select.addEventListener('input', this.changeHandler);
    document.addEventListener('click', this.clickHandler);
  }
}

class PictureLoupe {
  constructor(id) {
    this.$container = document.querySelector(id);
    this.init();
  }

  init = () => {
    if (!this.$container) return;
    this.$app = document.querySelector('#app');

    this.listeners()
  }

  showBigImg = (e) => {
    if (e.target.tagName !== 'IMG') return;
    const src = e.target.src;
    this.createBigPicModal(src);
  }

  deleteBigImgModal = () => {
    const $modal = document.querySelector('#bigPictureModal');
    render.deleteEl($modal);
  }


  createBigPicModal = (src) => {
    render.renderBigPicModal(this.$app, src);
  }

  clickHandler = (e) => {
    if (e.target.closest('[data-big-img-close]')) {
      this.deleteBigImgModal();
    }
  }
  listeners = () => {
    this.$container.addEventListener('click', this.showBigImg);
    document.addEventListener('click', this.clickHandler);
  }
}

const service = new Service();
const render = new Render();
const sidebar = new Sidebar('#sidebar');
const dropdown = new Dropdown();
const sidebarSearch = new SidebarSearch('#searchForm');
const navigation = new Navigation('#navigation');
const navBlock = new NavBlock('#navBlockBtn');
const categorySelect = new CategorySelect('#categoriesSelect');
const pictureLoupe = new PictureLoupe('#boardBlock');
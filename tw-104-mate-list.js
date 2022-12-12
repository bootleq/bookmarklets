'use strict';

// ==Bookmarklet==
// @name 104 職缺 忽略特定公司
// @author bootleq
// @style !loadOnce !inline ./tw-104-mate-list.css
// ==/Bookmarklet==

const storageKey = '_bookmarklet_blacklist';
const listContainer = document.querySelector('.mate-list__main');
const blacklist = JSON.parse(localStorage.getItem(storageKey) || '[]');

const delBtn = (() => {
  const tpl = document.createElement('template');
  tpl.innerHTML = '<button data-action="_bookmarklet_blacklist" title="加到忽視名單">✖</button>';
  const el = tpl.content.firstChild;
  return el;
})();

class Control {
  constructor(mountTo) {
    this.el = this.mount(mountTo);
    this.count = this.el.querySelector('var.count');
    this.items = blacklist;
    this.opened = false;
    this.render();

    this.addListeners();
  }

  renderItems() {
    const btnHTML = "<button type='button' data-action='_bookmarklet_restore'>✖</button>";
    const html = this.items.map(name => (`<li>${name}${btnHTML}</li>`)).join('');
    this.el.querySelector('ul').innerHTML = html;
  }

  render() {
    this.count.textContent = this.items.length;

    if (this.opened) {
      this.renderItems();
      this.el.classList.add('opened');
    } else {
      this.el.classList.remove('opened');
    }
  }

  flash() {
    this.count.classList.add('changing');
  }

  finishFlash() {
    this.count.classList.remove('changing');
  }

  addListeners() {
    this.el.addEventListener('click', e => {
      const { target } = e;

      switch (target.dataset?.action) {
      case '_bookmarklet_toggle':
        this.opened = !this.opened;
        this.render();
        break;
      case '_bookmarklet_restore':
        const name = target.closest('li').firstChild.textContent;
        this.items.splice(0, this.items.length, ...this.items.filter(i => i !== name));
        localStorage.setItem(storageKey, JSON.stringify(this.items));
        this.render();
        this.flash();
        listContainer.querySelectorAll('._bookmarklet_blacked').forEach(n => n.classList.remove('_bookmarklet_blacked'));
        Array.from(listContainer.children).slice(1).forEach(list => applyBlacked(list));
        break;
      }
    });

    this.count.addEventListener('animationend', this.finishFlash.bind(this));
  }

  mount(target) {
    const html = "<div id='_bookmarklet_control'><div><span data-action='_bookmarklet_toggle'>忽視名單</span>：<var class='count'>0</var></div><ul></ul></div>";
    const template = document.createElement('template');
    template.innerHTML = html;
    const el = template.content.firstChild;
    return target.appendChild(el);
  }
}

function addDelButtons(wrapperEl) {
  const wrapper = wrapperEl || document;
  wrapper.querySelectorAll('.info-company').forEach(n => {
    const btn = delBtn.cloneNode({deep: true});
    n.appendChild(btn);
  });
}

function applyBlacked(wrapperEl) {
  const wrapper = wrapperEl || document;
  wrapper.children.forEach(item => {
    const companyName = item.querySelector('.info-company__text')?.textContent;
    if (blacklist.includes(companyName)) {
      item.classList.add('_bookmarklet_blacked');
    }
  });
}

const observer = new MutationObserver((mutationList, obs) => {
  for (const mutation of mutationList) {
    if (mutation.type === 'childList') {
      const list = mutation.addedNodes;
      list.forEach(node => {
        applyBlacked(node);
        addDelButtons(node);
      });
    }
  }

  control.finishFlash();
});

if (listContainer.classList.contains('watching')) {
  console.log('Already watching.');
  return;
}

const control = new Control(document.querySelector('#app'));

Array.from(listContainer.children).slice(1).forEach(list => applyBlacked(list));
addDelButtons();

listContainer.addEventListener('click', e => {
  const { target } = e;

  if (target.dataset.action === '_bookmarklet_blacklist') {
    const row = target.closest('.job-list-container');
    const name = row?.querySelector('.info-company__text')?.textContent.trim();
    if (name) {
      if (blacklist.includes(name)) {
        console.log('Already have this item');
        return;
      }
      blacklist.push(name);
      localStorage.setItem(storageKey, JSON.stringify(blacklist));
      Array.from(listContainer.children).slice(1).forEach(list => applyBlacked(list));
      control.render();
      control.flash();
    } else {
      console.error("Can't parse company name.");
    }
  }
});

observer.observe(listContainer, {
  childList: true,
});

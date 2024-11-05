const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host([checked-status="unchecked"]) { 
      color: black;
    }

    :host([checked-status="partial_checked"]) {
      color: purple;
    }

    :host([checked-status="checked"]) {
      color: green;
    }
    
  </style>
  <img src="" alt="image">
  <span>State: </span>
`;


const images = {
  unchecked: '../img/unchecked.png',
  partial_checked: '../img/partial-checked.png',
  checked: '../img/checked.png'
};

class CheckboxCustom extends HTMLElement {
  static get observedAttributes() {
    return ['checked-status']
  }

  constructor() {
    super();
    this._checkedState = this.getAttribute('checked-status')
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template.content.cloneNode(true));
    this._internals = this.attachInternals();
    this.render()
  }

  get checkedState() {
    return this._checkedState;
  }

  set checkedState(value) {
    this._checkedState = value;
    this.setAttribute('checked-status', value);
    this.render()
    this._updateInternalsState();
  }

  changeStateOnClick() {
    switch (this.checkedState) {
      case 'unchecked':
        this.checkedState = 'partial_checked';
        break;
      case 'partial_checked':
        this.checkedState = 'checked';
        break;
      case 'checked':
        this.checkedState = 'unchecked';
        break;
    }
  }

  connectedCallback() {
    this.addEventListener('click', this.changeStateOnClick.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.changeStateOnClick.bind(this))
  }

  _updateInternalsState() {
    this._internals.states.clear();
    this._internals.states.add(this.checkedState);
  }

  render() {
    const img = this.shadowRoot.querySelector('img');
    img.src = images[this.checkedState];
    const span = this.shadowRoot.querySelector('span');
    span.textContent = `State: ${this.checkedState}`;
  }
}

customElements.define('checkbox-custom', CheckboxCustom);
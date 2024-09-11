class customGrid extends HTMLElement {
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.row = 1;
    this.col = 1;
    this.grid_template_columns = "1fr";
    this.grid_template_rows = "1fr";

    this.init();
    this.render();
  }

  static get observedAttributes() {
    return ["row", "col"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "row" && oldValue != newValue) {
      this.setRow(newValue);
    } else if (name === "col" && oldValue != newValue) {
      this.setCol(newValue);
    } else if (name === "template_columns") {
      this.grid_template_columns = newValue;
    } else if (name === "template_rows") {
      this.grid_template_rows = newValue;
    }
  }

  setRow(value) {
    this.row = value;
    this.render();
  }

  setCol(value) {
    this.col = value;
    this.render();
  }

  getCell(row, col) {
    const grid = this.shadow.querySelector("custom_grid");
    return grid.children[row * this.col + col];
  }

  setCell(row, col, dom) {
    const grid = this.shadow.querySelector("custom_grid");
    const cell = grid.children[row * this.col + col];

    while (cell?.firstChild) {
      cell.removeChild(this.shadow.firstChild);
    }

    cell.appendChild(dom);
  }

  init() {
    while (this.shadow?.firstChild) {
      this.shadow.removeChild(this.shadow.firstChild);
    }
    const style = document.createElement("style");

    let template_columns = this.grid_template_columns;
    let template_rows = this.grid_template_rows;

    if (this.grid_template_columns.split(" ").length != this.col) {
      template_columns = Array(parseInt(this.col)).fill("1fr").join(" ");
    }

    if (this.grid_template_rows.split(" ").length != this.row) {
      template_rows = Array(parseInt(this.row)).fill("1fr").join(" ");
    }
    style.textContent = `
      .custom_grid{
        width: inherit;
        border: 2px solid;
        display: grid;
        grid-template-columns: ${template_columns};
        grid-template-rows: ${template_rows};
        margin: 0 auto;
      }
      .custom_grid_cell, ::slotted(*){
        border: 1px solid grey;
        padding: 5px;
      }
        
    `;
    this.shadow.appendChild(style);
  }

  render() {
    this.init();
    const grid = document.createElement("div");
    this.shadow.appendChild(grid);
    grid.classList.add("custom_grid");

    for (let i = 0; i < this.col; i++) {
      for (let j = 0; j < this.row; j++) {
        const cell = document.createElement("slot");
        cell.classList.add("custom_grid_cell");
        cell.setAttribute("row", j);
        cell.setAttribute("col", i);

        grid.appendChild(cell);
      }
    }
  }
}
customElements.define("custom-grid", customGrid);

function clickCraeteMap() {
  const div = document.querySelector("#mine_main");
  let row = div.querySelectorAll("input")[0];
  let col = div.querySelectorAll("input")[1];
  let cnt = div.querySelectorAll("input")[2];

  row = !row.value ? row.placeholder : row.value;
  col = !col.value ? col.placeholder : col.value;
  cnt = !cnt.value ? cnt.placeholder : cnt.value;

  const area = document.getElementById("mine_game_area");
  area.innerHTML = "";
  area.appendChild(craeteMap(col, row, cnt));
}

function craeteMap(row, col, cnt = undefined) {
  if (cnt == undefined) {
    cnt = (row * col * 2) / 10;
  } else if (row * col < cnt / 2) {
    return;
  }
  const map = document.createElement("custom-grid");
  map.classList.add("mine_map");
  map.setAttribute("row", row);
  map.setAttribute("col", col);

  let index = 0;
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      const mine = document.createElement("div");
      mine.classList.add("mine_cell");
      mine.addEventListener("click", cellClick);
      mine.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (e.target.classList.contains("active")) return;
        if (e.target.classList.contains("flag"))
          e.target.classList.remove("flag");
        else e.target.classList.add("flag");
      });
      mine.setAttribute("index", index++);
      map.appendChild(mine);
    }
  }
  setMine(map, cnt);
  setCell(map);

  return map;
}

function setMine(map, cnt) {
  const randomValues = Random.getNumber(0, map.children.length - 1, cnt);

  for (let value of randomValues) {
    const m = map.children[value];
    m.classList.add("mine");
    m.addEventListener("click", mineClick);
  }
}

function isMine(cell) {
  return cell?.classList.contains("mine");
}

function mineClick(e) {
  const target = e.target;
  if (target.classList.contains("flag")) return;
  target.classList.add("active");
  MyToast.showToast("아악! 졌다!");
}

function cellClick(e) {
  const target = e.target;
  if (target.classList.contains("flag")) return;
  target.classList.add("active");
  if (target.innerText == 0 && !isMine(target)) {
    const map = document.querySelector(".mine_map");

    const up = getCell(map, target.getAttribute("index"), Arrow.Up);
    const down = getCell(map, target.getAttribute("index"), Arrow.Down);
    const left = getCell(map, target.getAttribute("index"), Arrow.Left);
    const right = getCell(map, target.getAttribute("index"), Arrow.Right);

    const cells = [up, down, left, right];
    for (let cell of cells) {
      if (cell && !cell?.classList.contains("active") && !isMine(cell)) {
        cell.click();
      }
    }
  }
}

function setCell(map) {
  for (let i = 0; i < map.children.length; i++) {
    const cell = map.children[i];
    if (isMine(cell)) continue;
    cell.innerText = getCellNumber(map, i);
  }
}

function getCellNumber(map, index) {
  let num = 0;
  const up = getCell(map, index, Arrow.Up);
  const down = getCell(map, index, Arrow.Down);
  const left = getCell(map, index, Arrow.Left);
  const right = getCell(map, index, Arrow.Right);

  const upLeft = getCell(map, up?.getAttribute("index"), Arrow.Left);
  const upRight = getCell(map, up?.getAttribute("index"), Arrow.Right);
  const downLeft = getCell(map, down?.getAttribute("index"), Arrow.Left);
  const downRight = getCell(map, down?.getAttribute("index"), Arrow.Right);

  const cells = [up, down, left, right, upLeft, upRight, downLeft, downRight];
  for (let cell of cells) {
    if (isMine(cell)) {
      num++;
      console.log(cell);
      debugger;
    }
  }
  return num == 0 ? "" : num;
}

function getCell(map, index, arrow) {
  if (index == undefined || index == null) return null;
  index = parseInt(index);
  try {
    switch (arrow) {
      case Arrow.Up:
        return map.children[index - parseInt(map.col)];
      case Arrow.Down:
        return map.children[index + parseInt(map.col)];
      case Arrow.Left:
        if (index % parseInt(map.col) == 0) return null;
        return map.children[index - 1];
      case Arrow.Right:
        if (index % parseInt(map.col) == parseInt(map.col) - 1) return null;
        return map.children[index + 1];
    }
  } catch {
    return null;
  }
}

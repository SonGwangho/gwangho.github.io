class Pokemon {
  static async getPokemons(url = undefined) {
    if (!url) {
      url = "https://pokeapi.co/api/v2/pokemon";
    }
    try {
      let response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  static async parsing(data) {
    if (!data) return null;
    const abilities = await Promise.all(
      data.abilities.map(async ({ ability: { url }, is_hidden }) => ({
        name: await this.changeLanguage(url),
        is_hidden,
      }))
    );

    const name = await this.changeLanguage(data.species.url);

    const stats = await Promise.all(
      data.stats.map(async ({ stat: { url }, base_stat }) => ({
        name: await this.changeLanguage(url),
        base_stat,
      }))
    );

    const types = await Promise.all(
      data.types.map(async ({ type: { url } }) => ({
        name: await this.changeLanguage(url),
      }))
    );

    const json = {
      id: data.id,
      abilities,
      name,
      sprites: data.sprites.other["official-artwork"],
      stats,
      types,
    };

    return json;
  }

  static async changeLanguage(url) {
    const response = await fetch(url);
    const data = await response.json();
    for (let name of data.names) {
      if (name.language.name == "ko") {
        return name.name;
      }
    }
  }
}

let loading = false;
async function loadPokemons() {
  loading = true;
  Modal.startLoading();

  const div = document.getElementById("pokemon");
  const ol = document.getElementById("poke_list");
  div.appendChild(ol);
  let cnt = ol.childElementCount;
  let url = `https://pokeapi.co/api/v2/pokemon?offset=${cnt}&limit=40`;
  const pokemons = await Pokemon.getPokemons(url);

  const promises = pokemons.results.map((pokemon) =>
    Pokemon.getPokemons(pokemon.url)
  );
  const pokemonData = await Promise.all(promises);
  const parsedPokemons = await Promise.all(
    pokemonData.map((data) => Pokemon.parsing(data))
  );

  const fragment = document.createDocumentFragment();
  let number = cnt;
  for (let parsed of parsedPokemons) {
    number++;
    if (!parsed) {
      MyToast.showToast(`No.${number} 는 여행을 떠나서 알 수 없어요..`);
      continue;
    }
    const li = document.createElement("div");
    li.classList.add("pokemon_outer_div");
    pokemonDiv = getPokemonDiv(parsed);
    li.appendChild(pokemonDiv);
    fragment.appendChild(li);
  }

  ol.appendChild(fragment);

  Modal.stopLoading();
  loading = false;
}

function handleScroll(entries, observer) {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const documentHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;

  if (scrollTop + windowHeight + 200 >= documentHeight) {
    if (!loading) {
      loadPokemons();
    }
  }
}

function getPokemonDiv(parsed) {
  const typeColor = {
    노말: "#949495",
    격투: "#E09C40",
    비행: "#A2C3E7",
    독: "#735198",
    땅: "#9C7743",
    바위: "#BFB889",
    벌레: "#9FA244",
    고스트: "#684870",
    강철: "#69A9C7",
    불꽃: "#E56C3E",
    물: "#5185C5",
    풀: "#66A945",
    전기: "#FCD533",
    에스퍼: "#DD6B7B",
    얼음: "#6DC8EB",
    드래곤: "#535CA8",
    악: "#4C4948",
    페어리: "#DAB4D4",
  };

  const pokemonDiv = document.createElement("div");

  const img = document.createElement("img");
  const infoDiv = document.createElement("div");
  const name = document.createElement("label");
  const types = document.createElement("div");
  const abilities = document.createElement("div");
  const stats = document.createElement("div");

  pokemonDiv.classList.add("pokemon_inner_div");

  img.src = parsed.sprites.front_default;
  img.classList.add("pokemon_img");

  infoDiv.classList.add("pokemon_info");

  name.innerText = `${parsed.name} No.${parsed.id.toString()}`;
  name.style.fontSize = "40px";
  name.style.fontWeight = "700";
  name.style.marginBottom = "15px";

  types.classList.add("pokemon_area");
  parsed.types.forEach((t) => {
    const type = document.createElement("label");
    type.innerText = t.name;
    type.style.color = typeColor[t.name];
    type.classList.add("pokemon_item");
    types.appendChild(type);
  });

  abilities.classList.add("pokemon_area");
  parsed.abilities.forEach((ab) => {
    const ability = document.createElement("label");
    ability.innerText = ab.name;
    ability.classList.add("pokemon_item");
    if (ab.is_hidden) {
      ability.classList.add("pokemon_hidden_ability");
    }
    abilities.appendChild(ability);
  });

  let allStatSum = 0;
  const statrow = [
    document.createElement("div"),
    document.createElement("div"),
  ];
  parsed.stats.forEach((s) => {
    const stat = document.createElement("div");
    const n = document.createElement("label");
    n.innerText = s.name + "  ";
    const bs = document.createElement("label");
    bs.innerText = s.base_stat;
    if (parseInt(s.base_stat) >= 130) {
      bs.style.color = "red";
    }
    allStatSum += parseInt(s.base_stat);
    stat.appendChild(n);
    stat.appendChild(bs);
    stat.classList.add("pokemon_item");
    if (statrow[0].childElementCount < 3) {
      statrow[0].appendChild(stat);
    } else {
      statrow[1].appendChild(stat);
    }
  });
  stats.appendChild(statrow[0]);
  statrow[0].classList.add("pokemon_area");
  stats.appendChild(statrow[1]);
  statrow[1].classList.add("pokemon_area");

  const sumStat = document.createElement("div");
  sumStat.style.textAlign = "center";
  const sumStatSpan = document.createElement("span");
  sumStatSpan.innerText = "종족값 : " + allStatSum.toString();
  sumStatSpan.style.display = "block";
  sumStatSpan.style.margin = "auto";
  sumStatSpan.style.fontSize = "30px";
  sumStatSpan.style.fontWeight = "700";
  sumStat.appendChild(sumStatSpan);

  pokemonDiv.appendChild(img);
  infoDiv.appendChild(name);
  infoDiv.appendChild(types);
  infoDiv.appendChild(abilities);
  infoDiv.appendChild(stats);
  pokemonDiv.appendChild(infoDiv);
  pokemonDiv.appendChild(sumStat);

  return pokemonDiv;
}

async function getPokemonJson() {
  if (!MyStorage.getSessionData("pokemon_ko")) {
    let response_ko = await fetch("./assets/pokemon_ko.json");
    let kson = await response_ko.json();
    MyStorage.saveSession("pokemon_ko", JSON.stringify(kson));
  }

  if (!MyStorage.getSessionData("pokemon_convert")) {
    let response_convert = await fetch("./assets/pokemon_convert.json");
    let cson = await response_convert.json();
    MyStorage.saveSession("pokemon_convert", JSON.stringify(cson));
  }

  if (!MyStorage.getSessionData("pokemon_chain")) {
    let response_ko = await fetch("./assets/pokemon_chain.json");
    let kson = await response_ko.json();
    MyStorage.saveSession("pokemon_chain", JSON.stringify(kson));
  }
}

function onInput(e) {
  try {
    const data = MyStorage.getSessionData("pokemon_ko");
    const resultDiv = document.getElementById("search_result_div");
    let value = e
      ? e.target.value
      : document.getElementsByClassName("search_input")[0].value;
    if (!value) resultDiv.style.display = "none";

    if (data[value]?.length < 1) return;
    let pokemons = data[value]?.slice(0, 5);
    while (resultDiv.childElementCount > 0) {
      resultDiv.removeChild(resultDiv.children[0]);
    }
    for (let pokemon of pokemons) {
      const div = document.createElement("div");
      div.classList.add("search_item");
      div.addEventListener("click", itemClick);
      const span = document.createElement("span");
      span.innerText = pokemon;

      div.appendChild(span);
      resultDiv.appendChild(div);
    }
    if (resultDiv.childElementCount > 0) resultDiv.style.display = "block";
  } catch (_) {}
}

function itemClick(e) {
  let value = e.target.innerText;

  if (!value) {
    value = document.getElementsByClassName("search_item_actived")[0].innerText;
  }

  document.getElementsByClassName("search_input")[0].value = value;

  //다지우고 자기자신만 남기기
  const resultDiv = document.getElementById("search_result_div");
  try {
    const backup = resultDiv.querySelector(".search_item_actived");
    while (resultDiv.childElementCount > 0) {
      resultDiv.removeChild(resultDiv.children[0]);
    }
    resultDiv.appendChild(backup);
  } catch (error) {
    console.log(error);
  }
}

async function search() {
  const text = document.getElementsByClassName("search_input")[0].value;
  const converter = MyStorage.getSessionData("pokemon_convert");
  if (converter[text]) {
    Modal.startLoading();
    const url = "https://pokeapi.co/api/v2/pokemon/" + converter[text];
    const pokemon = await Pokemon.getPokemons(url);
    const parsed = await Pokemon.parsing(pokemon);
    const pokeDiv = getPokemonDiv(parsed);

    const div = document.createElement("div");
    const chainDiv = document.createElement("div");
    chainDiv.classList.add("chain_div");
    div.appendChild(pokeDiv);
    div.appendChild(chainDiv);

    const chain = MyStorage.getSessionData("pokemon_chain");
    const tree = chain[converter[text]];
    try {
      const up = document.createElement("div");
      up.classList.add("poke_up");
      for (let item of tree.up) {
        if (item != "no") {
          const btn = document.createElement("button");
          btn.classList.add("pokemon_evolution_item");
          btn.innerText = converter[item];
          btn.onclick = function () {
            document.getElementsByClassName("search_input")[0].value =
              converter[item];
            search();
          };
          up.appendChild(btn);
        }
      }
      chainDiv.appendChild(up);
    } catch {}

    try {
      const down = document.createElement("div");
      down.classList.add("poke_down");
      for (let item of tree.down) {
        if (item != "no") {
          const btn = document.createElement("button");
          btn.classList.add("pokemon_evolution_item");
          btn.innerText = converter[item];
          btn.onclick = function () {
            document.getElementsByClassName("search_input")[0].value =
              converter[item];
            search();
          };
          down.appendChild(btn);
        }
      }
      chainDiv.appendChild(down);
    } catch {}

    Modal.stopLoading();
    Modal.showModal(div);
  } else {
    MyToast.showToast("그 포켓몬은 잘 모르겠어요...");
  }
}

function keyboardEvent(direction) {
  const resultDiv = document.getElementById("search_result_div");
  const cnt = resultDiv.childElementCount;
  let index = -1;
  let items = resultDiv.querySelectorAll(".search_item");
  for (let i = 0; i < items.length; i++) {
    if (items[i].classList.contains("search_item_actived")) index = i;
  }

  switch (direction) {
    case "up":
      if (index == -1) index = 5;
      index--;
      index = (cnt + index) % cnt;
      break;
    case "down":
      index++;
      index = index % cnt;
      break;
  }
  items = resultDiv.querySelectorAll(".search_item");
  for (let item of items) item.classList.remove("search_item_actived");
  items[index].classList.add("search_item_actived");
}

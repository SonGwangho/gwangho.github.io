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
      console.warn(e);
      return null;
    }
  }

  static async parsing(data, isMove = false) {
    if (!data) return null;
    const abilities = await Promise.all(
      data.abilities.map(async ({ ability: { url }, is_hidden }) => ({
        name: await this.changeLanguage(url),
        effect: await this.getTypeEffect(url),
        is_hidden,
      }))
    );

    const name = await this.changeLanguage(data.species.url);
    const desc = await this.getDesc(data.species.url);

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

    let imgSrc;
    if (isMove) {
      imgSrc = data.sprites.other.showdown;
    } else imgSrc = data.sprites.other["official-artwork"];

    const json = {
      id: data.id,
      abilities,
      name,
      desc,
      sprites: imgSrc.front_default
        ? imgSrc
        : data.sprites.other["official-artwork"],
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

  static async getDesc(url) {
    const response = await fetch(url);
    const data = await response.json();
    const descList = [];
    for (let flavor_text of data.flavor_text_entries) {
      if (flavor_text.language.name == "ko") {
        let text = flavor_text.flavor_text.replaceAll(".\n", "\t");
        text = text.replaceAll("\n", " ");
        text = text.replaceAll("\t", ".\n");
        descList.push(text);
      }
    }
    return descList;
  }

  static async getTypeEffect(url) {
    const response = await fetch(url);
    const data = await response.json();
    let text = "";
    for (let flavor_text of data.flavor_text_entries) {
      if (flavor_text.language.name == "ko") {
        text = flavor_text.flavor_text;
      }
    }
    return text;
  }

  static typeInfo = {
    type_list: [
      "노말",
      "격투",
      "비행",
      "독",
      "땅",
      "바위",
      "벌레",
      "고스트",
      "강철",
      "불꽃",
      "물",
      "풀",
      "전기",
      "에스퍼",
      "얼음",
      "드래곤",
      "악",
      "페어리",
    ],
    type_color: {
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
    },
    type_detail: {
      노말: {
        attack: {
          good: [],
          bad: ["바위", "강철"],
          no_effect: ["고스트"],
        },
        defence: {
          good: ["격투"],
          bad: [],
          no_effect: ["고스트"],
        },
      },
      불꽃: {
        attack: {
          good: ["풀", "얼음", "벌레", "강철"],
          bad: ["불꽃", "물", "바위", "드래곤"],
          no_effect: [],
        },
        defence: {
          good: ["물", "땅", "바위"],
          bad: ["불꽃", "풀", "얼음", "벌레", "강철", "페어리"],
          no_effect: [],
        },
      },
      물: {
        attack: {
          good: ["불꽃", "땅", "바위"],
          bad: ["물", "풀", "드래곤"],
          no_effect: [],
        },
        defence: {
          good: ["풀", "전기"],
          bad: ["불꽃", "물", "얼음", "강철"],
          no_effect: [],
        },
      },
      풀: {
        attack: {
          good: ["물", "땅", "바위"],
          bad: ["불꽃", "풀", "독", "비행", "벌레", "드래곤", "강철"],
          no_effect: [],
        },
        defence: {
          good: ["불꽃", "얼음", "독", "비행", "벌레"],
          bad: ["물", "풀", "전기", "땅"],
          no_effect: [],
        },
      },
      전기: {
        attack: {
          good: ["물", "비행"],
          bad: ["풀", "전기", "드래곤"],
          no_effect: ["땅"],
        },
        defence: {
          good: ["땅"],
          bad: ["전기", "비행", "강철"],
          no_effect: [],
        },
      },
      얼음: {
        attack: {
          good: ["풀", "땅", "비행", "드래곤"],
          bad: ["불꽃", "물", "얼음", "강철"],
          no_effect: [],
        },
        defence: {
          good: ["불꽃", "격투", "바위", "강철"],
          bad: ["얼음"],
          no_effect: [],
        },
      },
      격투: {
        attack: {
          good: ["노말", "얼음", "바위", "악", "강철"],
          bad: ["독", "비행", "에스퍼", "벌레", "페어리"],
          no_effect: ["고스트"],
        },
        defence: {
          good: ["비행", "에스퍼", "페어리"],
          bad: ["벌레", "바위", "악"],
          no_effect: [],
        },
      },
      독: {
        attack: {
          good: ["풀", "페어리"],
          bad: ["독", "땅", "바위", "고스트"],
          no_effect: ["강철"],
        },
        defence: {
          good: ["땅", "에스퍼"],
          bad: ["풀", "격투", "독", "벌레", "페어리"],
          no_effect: [],
        },
      },
      땅: {
        attack: {
          good: ["불꽃", "전기", "독", "바위", "강철"],
          bad: ["풀", "벌레"],
          no_effect: ["비행"],
        },
        defence: {
          good: ["물", "풀", "얼음"],
          bad: ["독", "바위"],
          no_effect: ["전기"],
        },
      },
      비행: {
        attack: {
          good: ["풀", "격투", "벌레"],
          bad: ["전기", "바위", "강철"],
          no_effect: [],
        },
        defence: {
          good: ["전기", "얼음", "바위"],
          bad: ["풀", "격투", "벌레"],
          no_effect: ["땅"],
        },
      },
      에스퍼: {
        attack: {
          good: ["격투", "독"],
          bad: ["에스퍼", "강철"],
          no_effect: ["악"],
        },
        defence: {
          good: ["벌레", "고스트", "악"],
          bad: ["격투", "에스퍼"],
          no_effect: [],
        },
      },
      벌레: {
        attack: {
          good: ["풀", "에스퍼", "악"],
          bad: ["불꽃", "격투", "독", "비행", "고스트", "강철", "페어리"],
          no_effect: [],
        },
        defence: {
          good: ["불꽃", "비행", "바위"],
          bad: ["풀", "격투", "땅 "],
          no_effect: [],
        },
      },
      바위: {
        attack: {
          good: ["불꽃", "얼음", "비행", "벌레"],
          bad: ["격투", "땅", "강철"],
          no_effect: [],
        },
        defence: {
          good: ["물", "풀", "격투", "땅", "강철"],
          bad: ["노말", "불꽃", "독", "비행"],
          no_effect: [],
        },
      },
      고스트: {
        attack: {
          good: ["에스퍼", "고스트"],
          bad: ["악"],
          no_effect: ["노말"],
        },
        defence: {
          good: ["고스트", "악"],
          bad: ["독", "벌레"],
          no_effect: ["노말", "격투"],
        },
      },
      드래곤: {
        attack: {
          good: ["드래곤"],
          bad: ["강철"],
          no_effect: ["페어리"],
        },
        defence: {
          good: ["얼음", "드래곤", "페어리"],
          bad: ["불꽃", "물", "풀", "전기"],
          no_effect: [],
        },
      },
      악: {
        attack: {
          good: ["에스퍼", "고스트"],
          bad: ["격투", "악", "페어리"],
          no_effect: [],
        },
        defence: {
          good: ["격투", "벌레", "페어리"],
          bad: ["고스트", "악"],
          no_effect: ["에스퍼"],
        },
      },
      강철: {
        attack: {
          good: ["얼음", "바위", "페어리"],
          bad: ["불꽃", "물", "전기", "강철"],
          no_effect: [],
        },
        defence: {
          good: ["불꽃", "격투", "땅"],
          bad: [
            "노말",
            "풀",
            "얼음",
            "비행",
            "에스퍼",
            "벌레",
            "바위",
            "드래곤",
            "강철",
            "페어리",
          ],
          no_effect: ["독"],
        },
      },
      페어리: {
        attack: {
          good: ["격투", "드래곤", "악"],
          bad: ["불꽃", "독", "강철"],
          no_effect: [],
        },
        defence: {
          good: ["독", "강철"],
          bad: ["격투", "벌레", "악"],
          no_effect: ["드래곤"],
        },
      },
    },
  };
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
    pokemonDiv.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementsByClassName("search_input")[0].value = parsed.name;
      search();
    });
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
  if (!parsed) {
    return;
  }
  const typeColor = Pokemon.typeInfo.type_color;

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
  if (img.src.indexOf(".gif") > -1) {
    img.style.maxWidth = "1000px";
    img.style.minHeight = "250px";
  }

  img.addEventListener("mouseover", (event) => {
    const typeList = Pokemon.typeInfo.type_list;
    const effectResult = pokemonDefenceEffect(
      Array.from(parsed.types, (t) => t.name).join("/")
    );

    const m = document.getElementsByClassName("pokemon_type_modal")[0];
    const title = m.querySelector(".pokemon_type_modal_title");
    title.innerHTML = "";
    for (let tp of Array.from(parsed.types, (t) => t.name)) {
      const titleSpan = document.createElement("span");
      titleSpan.innerText = tp;
      titleSpan.style.color = Pokemon.typeInfo.type_color[tp];
      title.appendChild(titleSpan);
    }

    const contents = m.querySelector(".pokemon_type_modal_contents");
    contents.innerHTML = "";

    const good = document.createElement("div");
    good.classList.add("pokemon_damage");
    good.classList.add("pokemon_damage_good");

    const quadruple = document.createElement("div");
    quadruple.classList.add("pokemon_quadruple");
    const quadrupleSpan = document.createElement("span");
    quadrupleSpan.innerText = "4배 -";
    quadruple.appendChild(quadrupleSpan);

    const double = document.createElement("div");
    double.classList.add("pokemon_double");
    const doubleSpan = document.createElement("span");
    doubleSpan.innerText = "2배 -";
    double.appendChild(doubleSpan);

    const soso = document.createElement("div");
    soso.classList.add("pokemon_damage");
    const sosoSpan = document.createElement("span");
    sosoSpan.innerText = "1배 -";
    soso.appendChild(sosoSpan);

    const bad = document.createElement("div");
    bad.classList.add("pokemon_damage");
    bad.classList.add("pokemon_damage_bad");

    const half = document.createElement("div");
    half.classList.add("pokemon_half");
    const halfSpan = document.createElement("span");
    halfSpan.innerText = "0.5배 -";
    half.appendChild(halfSpan);

    const quater = document.createElement("div");
    quater.classList.add("pokemon_quater");
    const quaterSpan = document.createElement("span");
    quaterSpan.innerText = "0.25배 -";
    quater.appendChild(quaterSpan);

    const noEffect = document.createElement("div");
    noEffect.classList.add("pokemon_noEffect");
    const noEffectSpan = document.createElement("span");
    noEffectSpan.innerText = "0배 -";
    noEffect.appendChild(noEffectSpan);

    for (let t of typeList) {
      switch (effectResult[t]) {
        case 4:
          const quadrupleType = document.createElement("span");
          quadrupleType.innerText = t;
          quadruple.appendChild(quadrupleType);
          break;
        case 2:
          const doubleType = document.createElement("span");
          doubleType.innerText = t;
          double.appendChild(doubleType);
          break;
        case 0.5:
          const halfType = document.createElement("span");
          halfType.innerText = t;
          half.appendChild(halfType);
          break;
        case 0.25:
          const quaterType = document.createElement("span");
          quaterType.innerText = t;
          quater.appendChild(quaterType);
          break;
        case 0:
          const noEffectType = document.createElement("span");
          noEffectType.innerText = t;
          noEffect.appendChild(noEffectType);
        default:
          const sosoType = document.createElement("span");
          sosoType.innerText = t;
          soso.appendChild(sosoType);
          break;
      }
    }

    if (quadruple.childElementCount > 1) good.appendChild(quadruple);
    if (double.childElementCount > 1) good.appendChild(double);
    if (half.childElementCount > 1) bad.appendChild(half);
    if (quater.childElementCount > 1) bad.appendChild(quater);
    if (noEffect.childElementCount > 1) bad.appendChild(noEffect);

    contents.appendChild(good);
    contents.appendChild(soso);
    contents.appendChild(bad);
    m.style.display = "block";
    m.style.left = event.pageX + "px";
    m.style.top = event.pageY + "px";
  });
  img.addEventListener("mouseout", (event) => {
    const m = document.getElementsByClassName("pokemon_type_modal")[0];
    m.style.display = "none";
  });

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
    type.addEventListener("mouseover", (event) => {
      const typeList = Pokemon.typeInfo.type_list;
      const effectResult = pokemonDefenceEffect(t.name);

      const m = document.getElementsByClassName("pokemon_type_modal")[0];
      const title = m.querySelector(".pokemon_type_modal_title");
      title.innerText = t.name;

      const contents = m.querySelector(".pokemon_type_modal_contents");
      contents.innerHTML = "";

      const good = document.createElement("div");
      good.classList.add("pokemon_damage");
      good.classList.add("pokemon_damage_good");

      const quadruple = document.createElement("div");
      quadruple.classList.add("pokemon_quadruple");
      const quadrupleSpan = document.createElement("span");
      quadrupleSpan.innerText = "4배 - ";
      quadruple.appendChild(quadrupleSpan);

      const double = document.createElement("div");
      double.classList.add("pokemon_double");
      const doubleSpan = document.createElement("span");
      doubleSpan.innerText = "2배 - ";
      double.appendChild(doubleSpan);

      const soso = document.createElement("div");
      soso.classList.add("pokemon_damage");
      const sosoSpan = document.createElement("span");
      sosoSpan.innerText = "1배 - ";
      soso.appendChild(sosoSpan);

      const bad = document.createElement("div");
      bad.classList.add("pokemon_damage");
      bad.classList.add("pokemon_damage_bad");

      const half = document.createElement("div");
      half.classList.add("pokemon_half");
      const halfSpan = document.createElement("span");
      halfSpan.innerText = "0.5배 - ";
      half.appendChild(halfSpan);

      const quater = document.createElement("div");
      quater.classList.add("pokemon_quater");
      const quaterSpan = document.createElement("span");
      quaterSpan.innerText = "0.25배 - ";
      quater.appendChild(quaterSpan);

      const noEffect = document.createElement("div");
      noEffect.classList.add("pokemon_noEffect");
      const noEffectSpan = document.createElement("span");
      noEffectSpan.innerText = "0배 - ";
      noEffect.appendChild(noEffectSpan);

      for (let t of typeList) {
        switch (effectResult[t]) {
          case 4:
            const quadrupleType = document.createElement("span");
            quadrupleType.innerText = t;
            quadruple.appendChild(quadrupleType);
            break;
          case 2:
            const doubleType = document.createElement("span");
            doubleType.innerText = t;
            double.appendChild(doubleType);
            break;
          case 0.5:
            const halfType = document.createElement("span");
            halfType.innerText = t;
            half.appendChild(halfType);
            break;
          case 0.25:
            const quaterType = document.createElement("span");
            quaterType.innerText = t;
            quater.appendChild(quaterType);
            break;
          case 0:
            const noEffectType = document.createElement("span");
            noEffectType.innerText = t;
            noEffect.appendChild(noEffectType);
          default:
            const sosoType = document.createElement("span");
            sosoType.innerText = t;
            soso.appendChild(sosoType);
            break;
        }
      }

      if (quadruple.childElementCount > 1) good.appendChild(quadruple);
      if (double.childElementCount > 1) good.appendChild(double);
      if (half.childElementCount > 1) bad.appendChild(half);
      if (quater.childElementCount > 1) bad.appendChild(quater);
      if (noEffect.childElementCount > 1) bad.appendChild(noEffect);

      contents.appendChild(good);
      contents.appendChild(soso);
      contents.appendChild(bad);
      m.style.display = "block";
      m.style.left = event.pageX + "px";
      m.style.top = event.pageY + "px";
    });
    type.addEventListener("mouseout", (event) => {
      const m = document.getElementsByClassName("pokemon_type_modal")[0];
      m.style.display = "none";
    });
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
    ability.addEventListener("mouseover", (event) => {
      const m = document.getElementsByClassName("pokemon_ability_modal")[0];
      const title = m.querySelector(".pokemon_ability_modal_title");
      title.innerText = ab.name;
      const contents = m.querySelector(".pokemon_ability_modal_contents");
      contents.innerText = ab.effect;
      m.style.display = "block";
      m.style.left = event.pageX + "px";
      m.style.top = event.pageY + "px";
    });
    ability.addEventListener("mouseout", (event) => {
      const m = document.getElementsByClassName("pokemon_ability_modal")[0];
      m.style.display = "none";
    });
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
  sumStat.style.margin = "0 0 70px 0 !important";
  const sumStatSpan = document.createElement("span");
  sumStatSpan.innerText = "종족값 : " + allStatSum.toString();
  if (allStatSum >= 600) {
    sumStatSpan.style.color = "red";
  }
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
  } else if (MyStorage.getSessionData("pokemon_ko")["복숭악동"]) {
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
    if (resultDiv.childElementCount == 0) resultDiv.style.display = "none";
    else if (resultDiv.childElementCount > 0) resultDiv.style.display = "block";
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
    console.warn(error);
  }
}

async function search() {
  const text = document.getElementsByClassName("search_input")[0].value;
  const converter = MyStorage.getSessionData("pokemon_convert");
  if (converter[text]) {
    Modal.startLoading();
    const url = "https://pokeapi.co/api/v2/pokemon/" + converter[text];
    const pokemon = await Pokemon.getPokemons(url);
    const parsed = await Pokemon.parsing(pokemon, true);
    const pokeDiv = getPokemonDiv(parsed);

    const div = document.createElement("div");
    const descTitle = document.createElement("span");
    descTitle.classList.add("pokemon_desc_title");
    descTitle.innerText = "도감 설명";
    const descDiv = document.createElement("div");
    descDiv.innerText = parsed.desc.join("\n\n");
    descDiv.classList.add("pokemon_desc");
    const chainDiv = document.createElement("div");
    chainDiv.classList.add("chain_div");

    const capture = document.createElement("button");
    capture.classList.add("pokemon_capture");
    capture.innerText = "캡처";
    capture.addEventListener("click", () => {
      html2canvas(pokeDiv, {
        allowTaint: true,
        useCORS: true,
        width: pokeDiv.offsetWidth,
        height: pokeDiv.offsetHeight,
        scale: 1,
      })
        .then(function (canvas) {
          const imageURL = canvas.toDataURL("image/jpeg");
          const link = document.createElement("a");
          link.href = imageURL;
          link.download = text;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(function (err) {
          console.warn(err);
        });
    });
    div.appendChild(capture);

    div.appendChild(pokeDiv);
    div.appendChild(chainDiv);
    div.appendChild(descTitle);
    div.appendChild(descDiv);

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

function pokemonDefenceEffect(type) {
  let types = [type];
  if (type.indexOf("/")) {
    types = type.split("/");
  }

  const typeResult = {};
  Pokemon.typeInfo.type_list.forEach((t) => (typeResult[t] = 1));

  const details = Pokemon.typeInfo.type_detail;
  for (let t of types) {
    const typeDetail = details[t];
    const defence = typeDetail.defence;

    for (let g of defence.good) {
      typeResult[g] *= 2;
    }
    for (let b of defence.bad) {
      typeResult[b] /= 2;
    }
    for (let n of defence.no_effect) {
      typeResult[n] = 0;
    }
  }

  return typeResult;
}

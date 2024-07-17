class Pokemon {
  static async getPokemons(url = undefined) {
    if (!url) {
      url = "https://pokeapi.co/api/v2/pokemon";
    }
    if (url == "https://pokeapi.co/api/v2/pokemon/218/") debugger;
    let data;
    let cnt = 0;
    while (cnt++ < 100) {
      try {
        let response = await fetch(url);
        data = await response.json();
        break;
      } catch (e) {
        console.log(e);
        console.log(url);
      }
    }
    return data;
  }

  static async parsing(data) {
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
  const ol = document.getElementById("pokeList");
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
    const li = document.createElement("div");
    const pokemonDiv = document.createElement("div");

    const img = document.createElement("img");
    const infoDiv = document.createElement("div");
    const name = document.createElement("label");
    const types = document.createElement("div");
    const abilities = document.createElement("div");
    const stats = document.createElement("div");

    li.classList.add("pokemon_outer_div");

    pokemonDiv.classList.add("pokemon_inner_div");

    img.src = parsed.sprites.front_default;
    img.classList.add("pokemon_img");

    infoDiv.classList.add("pokemon_info");

    name.innerText = `${parsed.name} No.${(++number).toString()}`;
    name.style.fontSize = "40px";
    name.style.fontWeight = "700";
    name.style.marginBottom = "15px";

    types.classList.add("pokemon_area");
    parsed.types.forEach((t) => {
      const type = document.createElement("label");
      type.innerText = t.name;
      type.classList.add("pokemon_item");
      types.appendChild(type);
    });

    abilities.classList.add("pokemon_area");
    parsed.abilities.forEach((ab) => {
      const ability = document.createElement("label");
      ability.innerText = ab.name;
      ability.classList.add("pokemon_item");
      abilities.appendChild(ability);
    });

    const statrow = [
      document.createElement("div"),
      document.createElement("div"),
    ];
    parsed.stats.forEach((s) => {
      const stat = document.createElement("div");
      const n = document.createElement("label");
      n.innerText = s.name;
      const bs = document.createElement("label");
      bs.innerText = s.base_stat;
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

    pokemonDiv.appendChild(img);
    infoDiv.appendChild(name);
    infoDiv.appendChild(types);
    infoDiv.appendChild(abilities);
    infoDiv.appendChild(stats);
    pokemonDiv.appendChild(infoDiv);
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

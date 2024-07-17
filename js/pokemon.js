class Pokemon {
  static async getPokemons(url = undefined) {
    if (!url) {
      url = "https://pokeapi.co/api/v2/pokemon";
    }
    const response = await fetch(url);
    if (url.indexOf("218")) debugger;
    const data = await response.json();
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
  let cnt = ol.childElementCount + 160;
  let url = `https://pokeapi.co/api/v2/pokemon?offset=${cnt}&limit=${cnt}`;
  const pokemons = await Pokemon.getPokemons(url);

  const promises = pokemons.results.map((pokemon) =>
    Pokemon.getPokemons(pokemon.url)
  );
  const pokemonData = await Promise.all(promises);
  const parsedPokemons = await Promise.all(
    pokemonData.map((data) => Pokemon.parsing(data))
  );

  const fragment = document.createDocumentFragment();
  for (let parsed of parsedPokemons) {
    const li = document.createElement("li");
    const pokemonDiv = document.createElement("div");

    const img = document.createElement("img");
    const name = document.createElement("label");
    const types = document.createElement("div");
    const abilities = document.createElement("div");
    const stats = document.createElement("div");

    img.src = parsed.sprites.front_default;
    name.innerText = parsed.name;

    parsed.types.forEach((t) => {
      const type = document.createElement("label");
      type.innerText = t.name;
      types.appendChild(type);
    });

    parsed.abilities.forEach((ab) => {
      const ability = document.createElement("label");
      ability.innerText = ab.name;
      abilities.appendChild(ability);
    });

    parsed.stats.forEach((s) => {
      const stat = document.createElement("div");
      const n = document.createElement("label");
      n.innerText = s.name;
      const bs = document.createElement("label");
      bs.innerText = s.base_stat;
      stat.appendChild(n);
      stat.appendChild(bs);
      stats.appendChild(stat);
    });

    pokemonDiv.appendChild(img);
    pokemonDiv.appendChild(name);
    pokemonDiv.appendChild(types);
    pokemonDiv.appendChild(abilities);
    pokemonDiv.appendChild(stats);
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

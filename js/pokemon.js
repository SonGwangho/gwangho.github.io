class Pokemon {
  static async getPokemons(url = undefined) {
    if (!url) {
      url = "https://pokeapi.co/api/v2/pokemon";
    }
    const response = await fetch(url);
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

async function loadPokemons() {
  const div = document.getElementById("pokemon");
  const ol = document.createElement("ol");
  let url = `https://pokeapi.co/api/v2/pokemon?offset=${ol.childElementCount}&limit=${ol.childElementCount}`;
  const pokemons = await Pokemon.getPokemons(url);

  div.appendChild(ol);
  for (let pokemon of pokemons.results) {
    url = pokemon.url;
    let data = await Pokemon.getPokemons(url);
    let parsed = await Pokemon.parsing(data);

    const li = document.createElement("li");
    const pokemonDiv = document.createElement("div");

    const img = document.createElement("img");
    const name = document.createElement("label");
    const types = document.createElement("div");
    const abilities = document.createElement("div");
    const stats = document.createElement("div");

    img.src = parsed.sprites.front_default;
    name.innerText = parsed.name;
    for (let t of parsed.types) {
      const type = document.createElement("label");
      type.innerText = t.name;
      types.appendChild(type);
    }
    for (let ab of parsed.abilities) {
      const ability = document.createElement("label");
      ability.innerText = ab.name;
      abilities.appendChild(ability);
    }
    for (let s of parsed.stats) {
      const stat = document.createElement("div");
      const n = document.createElement("label");
      n.innerText = s.name;
      const bs = document.createElement("label");
      bs.innerText = s.base_stat;
      stat.appendChild(n);
      stat.appendChild(bs);
      stats.appendChild(stat);
    }
    pokemonDiv.appendChild(img);
    pokemonDiv.appendChild(name);
    pokemonDiv.appendChild(types);
    pokemonDiv.appendChild(abilities);
    pokemonDiv.appendChild(stats);
    pokemonDiv.appendChild(img);
    pokemonDiv.appendChild(img);
    pokemonDiv.appendChild(img);
    pokemonDiv.appendChild(img);
    li.appendChild(pokemonDiv);
    ol.appendChild(li);
  }
}

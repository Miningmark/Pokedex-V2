const url = "https://pokeapi.co/api/v2/pokemon?limit=10&offset="

const previewCointainer = document.querySelector('.previewAllPokemons');
const MAX_PARALLEL_REQUESTS = 10; // Anzahl der maximal parallelen Fetch-Vorgänge
let currentRequests = 0; // Zählt die laufenden Fetch-Vorgänge

let pokemons = [];
let maxHP = 0;
let maxAttack = 0;
let maxDefense = 0;
let maxSpecialAttack = 0;
let maxSpecialDefense = 0;
let maxSpeed = 0;

for(let i = 0; i < 16; i++){
    await fetchData(url + (i * 10));
}
/*
for(let i = 0; i < pokemons.length; i++){
    await fetchPokemonStats(i);
    renderPreviewCard(i);
}
*/
fetchDataAndRender();


async function fetchDataAndRender() {
  // Erstellen Sie eine Queue für die Fetch-Vorgänge
  const fetchQueue = pokemons.map(async (pokemon, index) => {
    await processFetch(index);
  });

  // Führen Sie die Fetch-Vorgänge aus (bis zur maximalen Anzahl gleichzeitig)
  await Promise.all(fetchQueue.splice(0, MAX_PARALLEL_REQUESTS));
}

async function processFetch(index) {
  // Überprüfen Sie, ob die maximale Anzahl paralleler Anfragen erreicht ist
  while (currentRequests >= MAX_PARALLEL_REQUESTS) {
    // Warten Sie, bis ein Fetch-Vorgang abgeschlossen ist
    await delay(100);
  }

  // Inkrementieren Sie die Anzahl der laufenden Fetch-Vorgänge
  currentRequests++;

  // Führen Sie den Fetch-Vorgang durch
  await fetchPokemonStats(index);

  // Dekrementieren Sie die Anzahl der laufenden Fetch-Vorgänge
  currentRequests--;

  // Rendern Sie die Preview-Karte
  renderPreviewCard(index);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




async function fetchData(newURL){
    const response = await fetch(newURL);
    const json = await response.json();
    json.results.forEach(element => {
        pokemons.push(element);
    });
    //console.log(pokemons);
}

console.log(pokemons);


async function fetchPokemonStats(id){
    const response = await fetch(pokemons[id].url);
    const json = await response.json();
    //console.log(json);
    const hp = json.stats[0].base_stat;
    const attack = json.stats[1].base_stat;
    const defense = json.stats[2].base_stat;
    const specialAttack = json.stats[3].base_stat;
    const specialDefense = json.stats[4].base_stat;
    const speed = json.stats[5].base_stat;
    pokemons[id].name = firstLetterUpperCase(pokemons[id].name);
    maxHP = Math.max(maxHP, hp);
    maxAttack = Math.max(maxAttack, attack);
    maxDefense = Math.max(maxDefense, defense);
    maxSpecialAttack = Math.max(maxSpecialAttack, specialAttack);
    maxSpecialDefense = Math.max(maxSpecialDefense, specialDefense);
    maxSpeed = Math.max(maxSpeed,speed);
    pokemons[id].hp = hp;
    pokemons[id].attack = attack;
    pokemons[id].defense = defense;
    pokemons[id].specialAttack = specialAttack;
    pokemons[id].specialDefense = specialDefense;
    pokemons[id].speed = speed;
    pokemons[id].type = firstLetterUpperCase(json.types[0].type.name);
    pokemons[id].height = json.height/10,
    pokemons[id].weight = json.weight/10,
    pokemons[id].img = imageSelectNew(json);
    //console.log(pokemons[id]);

}

function firstLetterUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function imageSelectNew(data){
    let img = data.sprites.other.dream_world.front_default;
    if(img === null){
        img = data.sprites.front_default;
    }
    if(img === null){
        img = "../assets/images/Pokeball.png";
    }
    return img;
}

function renderPreviewCard(id){
    previewCointainer.innerHTML += (`
        <div class="pokemonPreviewCard ${pokemons[id].type}" id="pokemonPreviewCard${id}">
            <h1 class="pokemonName">${pokemons[id].name}</h1>
            <h4 class="pokemonElement">${pokemons[id].type}</h4>
            <img class="pokemonImage" src="${pokemons[id].img}">  
        </div>
    `);
}
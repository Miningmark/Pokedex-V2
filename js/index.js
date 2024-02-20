const url = "https://pokeapi.co/api/v2/pokemon?limit=10&offset="

const searchButton = document.getElementById("searchButton");
const searchbar = document.querySelector(".searchbar");
const serachInput = document.getElementById("searchInput");
const previewCointainer = document.getElementById('previewAll');
const searchCointainer = document.getElementById('previewSearch');
const pokemonStatsBackground = document.querySelector(".showPokemonStatsBackground");


const MAX_PARALLEL_REQUESTS = 10; // Anzahl der maximal parallelen Fetch-Vorgänge
let currentRequests = 0; // Zählt die laufenden Fetch-Vorgänge


searchButton.addEventListener("click", (event) => {
    searchbar.classList.toggle("hide");
    if(searchbar.classList.contains("hide")){
        previewCointainer.classList.remove("hide");
        searchCointainer.classList.add("hide");
    }else{
        serachInput.value = "";
        serachInput.focus();
    }
});

serachInput.addEventListener("input", (event) => {
    const inputText = event.target.value.toLowerCase();
    //console.log(inputText);
    if(inputText.length > 0){
        previewCointainer.classList.add("hide");
        searchCointainer.classList.remove("hide");
        const output = pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(inputText));
        //console.log(output);
        searchCointainer.innerHTML = "";
        console.log("length", output.length);
        if(output.length != 0){
            output.forEach((element) => {
                //console.log(pokemons.findIndex(pokemon => pokemon.name === element.name));
                renderSeachCard(pokemons.findIndex(pokemon => pokemon.name === element.name));
            });
        }else{
            searchCointainer. innerHTML = `<p id="searchError">No matches found for ${inputText} !</p>`
        }
    }else{
        previewCointainer.classList.remove("hide");
        searchCointainer.classList.add("hide");
    }
});

previewCointainer.addEventListener("click", handlePokemonClick);
searchCointainer.addEventListener("click", handlePokemonClick);

function handlePokemonClick(event){
    const clickedElement = event.target.closest('.pokemonPreviewCard');
    if (clickedElement) {
        const id = clickedElement.id.replace("pokemonPreviewCard", "");
        console.log("Clicked Pokemon ID:", id);
        showPokemonStats(id);
    }
}

pokemonStatsBackground.addEventListener("click", handleBackgroundClick);

function handleBackgroundClick(event){
    const clickedElement = event.target.closest('.showPokemonStatsBackground');
    if(clickedElement){
        document.querySelector(".showPokemonStatsBackground").classList.toggle("hide");
        //previewCointainer.classList.toggle("noScroll");
    }
    
}


let pokemons = [];
let maxHP = 0;
let maxAttack = 0;
let maxDefense = 0;
let maxSpecialAttack = 0;
let maxSpecialDefense = 0;
let maxSpeed = 0;

for(let i = 0; i < 16; i++){                //max 130
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
}

//console.log(pokemons);

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
function renderSeachCard(id){
    searchCointainer.innerHTML += (`
        <div class="pokemonPreviewCard ${pokemons[id].type}" id="pokemonPreviewCard${id}">
            <h1 class="pokemonName">${pokemons[id].name}</h1>
            <h4 class="pokemonElement">${pokemons[id].type}</h4>
            <img class="pokemonImage" src="${pokemons[id].img}">  
        </div>
    `);
}

function showPokemonStats(id){
    document.querySelector(".showPokemonName").textContent = pokemons[id].name;
    document.querySelector(".showPokemonType").textContent = pokemons[id].type;
    document.querySelector(".showPokemonHeight").textContent = pokemons[id].height;
    document.querySelector(".showPokemonWeight").textContent = pokemons[id].weight;
    document.querySelector(".pokemonStatsImage").src = pokemons[id].img;
    document.querySelector(".showPokemonStats").classList = "showPokemonStats";
    document.querySelector(".showPokemonStats").classList.add(pokemons[id].type);

    document.querySelector(".hpValue").style.height = `${100 - (pokemons[id].hp / maxHP * 100)}%`;
    document.querySelector(".attackValue").style.height = `${100 - (pokemons[id].attack / maxAttack * 100)}%`;
    document.querySelector(".defenseValue").style.height = `${100 - (pokemons[id].defense / maxDefense * 100)}%`;
    document.querySelector(".specialAttackValue").style.height = `${100 - (pokemons[id].specialAttack / maxSpecialAttack * 100)}%`;
    document.querySelector(".specialDefenseValue").style.height = `${100 - (pokemons[id].specialDefense / maxSpecialDefense * 100)}%`;
    document.querySelector(".speedValue").style.height = `${100 - (pokemons[id].speed / maxSpeed * 100)}%`;

    document.querySelector(".showPokemonStatsBackground").classList.toggle("hide");
}
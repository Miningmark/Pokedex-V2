const url = "https://pokeapi.co/api/v2/pokemon"

const searchCancel = document.getElementById("searchCancel");
const searchbar = document.querySelector(".searchbar");
const serachInput = document.getElementById("searchInput");
const previewCointainer = document.getElementById('previewAll');
const searchCointainer = document.getElementById('previewSearch');
const pokemonStatsBackground = document.querySelector(".showPokemonStatsBackground");

/*
const MAX_PARALLEL_REQUESTS = 10; // Anzahl der maximal parallelen Fetch-Vorgänge
let currentRequests = 0; // Zählt die laufenden Fetch-Vorgänge
*/

let maxPokemonLoads = 151;


searchCancel.addEventListener("click", () => {
    previewCointainer.classList.remove("hide");
    searchCointainer.classList.add("hide");
    serachInput.value = "";
    serachInput.focus();
});

serachInput.addEventListener("input", (event) => {
    const inputText = event.target.value.toLowerCase();
    if(inputText.length > 0){
        previewCointainer.classList.add("hide");
        searchCointainer.classList.remove("hide");
        const output = pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(inputText));
        searchCointainer.innerHTML = "";
        if(output.length != 0){
            output.forEach((element) => {
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
        const id = Number(clickedElement.id.replace("pokemonPreviewCard", ""));
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
/*
for(let i = 0; i < 16; i++){                //max 130
    await fetchData(url + (i * 10));
}
*/
await fetchData(`${url}?limit=${maxPokemonLoads}`);

for(let i = 0; i < pokemons.length; i++){
    renderPreviewCard(i);
}




//fetchDataAndRender();


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

async function fetchPokemonStats(id){
    const response = await fetch(pokemons[id].url);
    const json = await response.json();
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
    //console.log(hp)
    pokemons[id].hp = hp;
    pokemons[id].attack = attack;
    pokemons[id].defense = defense;
    pokemons[id].specialAttack = specialAttack;
    pokemons[id].specialDefense = specialDefense;
    pokemons[id].speed = speed;
    pokemons[id].type = firstLetterUpperCase(json.types[0].type.name);
    pokemons[id].height = json.height/10;
    pokemons[id].weight = json.weight/10;
    //console.log(pokemons[id]);
}

function firstLetterUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function renderPreviewCard(id){         // <div class="pokemonPreviewCard ${pokemons[id].type}" id="pokemonPreviewCard${id}"> 
    previewCointainer.innerHTML += (`
        <div class="pokemonPreviewCard " id="pokemonPreviewCard${id}">      
            <h1 class="pokemonName">${pokemons[id].name}</h1>
            <h5 class="pokemonElement">#${id+1}</h5>
            <img class="pokemonImage" src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${id+1}.svg" alt="${pokemons[id].name}">  
        </div>
    `);
}
function renderSeachCard(id){
    searchCointainer.innerHTML += (`
        <div class="pokemonPreviewCard ${pokemons[id].type}" id="pokemonPreviewCard${id}">
            <h1 class="pokemonName">${pokemons[id].name}</h1>
            <h4 class="pokemonElement">${pokemons[id].type}</h4>
            <img class="pokemonImage" src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${id+1}.svg" alt="${pokemons[id].name}">   
        </div>
    `);
}

async function showPokemonStats(id){
    const response = await fetch(url + "/" + (id+1));
    const json = await response.json();

    document.querySelector(".showPokemonName").textContent = pokemons[id].name;
    document.querySelector(".showPokemonType").textContent = firstLetterUpperCase(json.types[0].type.name);
    document.querySelector(".showPokemonHeight").textContent = json.height/10;
    document.querySelector(".showPokemonWeight").textContent = json.weight/10;
    document.querySelector(".pokemonStatsImage").src = `https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${id+1}.svg`;
    document.querySelector(".pokemonStatsImage").alt = `${pokemons[id].name}`;
    document.querySelector(".showPokemonStats").classList = "showPokemonStats";
    document.querySelector(".showPokemonStats").classList.add(firstLetterUpperCase(json.types[0].type.name));

    document.querySelector(".hpValue").style.height = `${100 - (json.stats[0].base_stat / 200 * 100)}%`;
    document.querySelector(".attackValue").style.height = `${100 - (json.stats[1].base_stat / 200 * 100)}%`;
    document.querySelector(".defenseValue").style.height = `${100 - (json.stats[2].base_stat / 200 * 100)}%`;
    document.querySelector(".specialAttackValue").style.height = `${100 - (json.stats[3].base_stat / 200 * 100)}%`;
    document.querySelector(".specialDefenseValue").style.height = `${100 - (json.stats[4].base_stat / 200 * 100)}%`;
    document.querySelector(".speedValue").style.height = `${100 - (json.stats[5].base_stat / 200 * 100)}%`;

    document.querySelector(".showPokemonStatsBackground").classList.toggle("hide");
}
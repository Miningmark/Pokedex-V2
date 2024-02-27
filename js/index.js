const url = "https://pokeapi.co/api/v2/pokemon"

const searchCancel = document.getElementById("searchCancel");
const searchbar = document.querySelector(".searchbar");
const serachInput = document.getElementById("searchInput");
const previewCointainer = document.getElementById('previewAll');
const searchCointainer = document.getElementById('previewSearch');
const pokemonStatsBackground = document.querySelector(".showPokemonStatsBackground");

let pokemons = [];
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
        showPokemonStats(id);
    }
}

pokemonStatsBackground.addEventListener("click", handleBackgroundClick);

function handleBackgroundClick(event){
    const clickedElement = event.target.closest('.showPokemonStatsBackground');
    if(clickedElement){
        document.querySelector(".showPokemonStatsBackground").classList.toggle("hide");
    }
}


await fetchData(`${url}?limit=${maxPokemonLoads}`);

for(let i = 0; i < pokemons.length; i++){
    renderPreviewCard(i);
}

async function fetchData(newURL){
    const response = await fetch(newURL);
    const json = await response.json();
    json.results.forEach(element => {
        pokemons.push(element);
    });
}

function firstLetterUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderPreviewCard(id){       
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
    <div class="pokemonPreviewCard " id="pokemonPreviewCard${id}">      
        <h1 class="pokemonName">${pokemons[id].name}</h1>
        <h5 class="pokemonElement">#${id+1}</h5>
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

    document.querySelector(".hpValue").style.height = `${100 - (json.stats[0].base_stat / 150 * 100)}%`;
    document.querySelector(".attackValue").style.height = `${100 - (json.stats[1].base_stat / 150 * 100)}%`;
    document.querySelector(".defenseValue").style.height = `${100 - (json.stats[2].base_stat / 150 * 100)}%`;
    document.querySelector(".specialAttackValue").style.height = `${100 - (json.stats[3].base_stat / 150 * 100)}%`;
    document.querySelector(".specialDefenseValue").style.height = `${100 - (json.stats[4].base_stat / 150 * 100)}%`;
    document.querySelector(".speedValue").style.height = `${100 - (json.stats[5].base_stat / 150 * 100)}%`;

    document.querySelector(".showPokemonStatsBackground").classList.toggle("hide");
}
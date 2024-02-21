# Pokedex

## 1.Description

The Pokedex website is a visualization of a Pokemon database in which all Pokemons are stored with their name, type, stats and image. The website should look good on the desktop browser as well as on the smartphone. A search function should also be integrated.


## 2.Layout

### Desktop Version
![Desktop Version](./Doku/Pokedex%20Desktop%20Version.png)

### Mobile Version
![Mobile Version](./Doku/Pokedex%20Mobile%20Version.png)

## 3.More information and technical structure

The website receives the data from https://pokeapi.co/api/v2/. From there, the page first receives a list of all Pokemon names and the URL for the respective Pokemon data set. In the next step, the URLs for the individual Pokemons are loaded in a fetch queue, sometimes simultaneously, and then rendered directly. If you click on one of the Pokemon objects, a detailed view of the respective Pokemon appears with its values in e.g. HP, Attack,... The bar is a percentage display of the value of this Pokemon in relation to the strongest. In addition, its size and weight are also displayed. The background color of the window is determined by the type of the respective Pokemon.


## 4.Finished website

![Desktop Version]()
![Mobile Version]()
import { countries } from "./services/countriesService.js";
import { createCardsList } from "./services/domService.js";

createCardsList(countries);

console.log(countries);
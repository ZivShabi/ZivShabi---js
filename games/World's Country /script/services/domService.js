import { countries, reset, search } from "./countriesService.js";
import { getData, likedCountries, updateData } from "./storageService.js";

const cards = document.getElementById('cards');
const searchInput = document.getElementById('search');
let likedCountriesList = [];

searchInput.addEventListener('keyup', (e) => {
    const searchTerm = e.target.value;
    if (searchTerm) {
        search(searchTerm);
        if (countries.length > 0) {
            cards.innerHTML = '';
            createCardsList(countries);
        } else {
            cards.innerHTML = '<p>No results found.</p>';
        }
    } else {
        reset();
        cards.innerHTML = '';
        createCardsList(countries);
    }
});

const createCard = (country) => {
    const card = document.createElement('div');
    card.className = 'card shadow m-2 col-md-3 col-sm-12';
    card.classList.add('divcard');

    const cardImg = document.createElement('img');
    cardImg.className = 'card-img-top p-2 mt-2 border rounded shadow';
    cardImg.src = country.flags.png;

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = country.name.common;

    const population = document.createElement('p');
    population.className = 'card-text';
    population.textContent = `Population: ${country.population}`;

    const region = document.createElement('p');
    region.className = 'card-text';
    region.textContent = `Region: ${country.region}`;

    const capital = document.createElement('p');
    capital.className = 'card-text';
    capital.textContent = `Capital: ${country.capital}`;

    const area = document.createElement('p');
    area.className = 'card-text';
    area.textContent = `Area: ${country.area} km²`;

    let languagesText = 'Languages: N/A';
    if (country.languages) {
        languagesText = `Languages: ${Object.values(country.languages).join(', ')}`;
    }
    const languages = document.createElement('p');
    languages.className = 'card-text';
    languages.textContent = languagesText;

    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer d-flex justify-content-center mb-2';

    let heart = document.createElement('i');

    heart.addEventListener('click', () => {
        updateData(country.name.common);
        heart.classList.toggle('text-danger');
        heart.classList.toggle('text-dark');
    });

    let isLiked = likedCountriesList.includes(country.name.common);
    heart.className = `fa fa-heart ${isLiked ? 'text-danger' : 'text-dark'}`;

    card.appendChild(cardImg);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(population);
    cardBody.appendChild(region);
    cardBody.appendChild(capital);
    cardBody.appendChild(area);
    cardBody.appendChild(languages);
    cardFooter.appendChild(heart);

    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    cards.appendChild(card);
}

const createCardsList = (list) => {
    cards.innerHTML = '';
    list.forEach((item) => {
        createCard(item);
    });
}

export { createCardsList };
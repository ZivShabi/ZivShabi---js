const getCountries = async () => {
    const res = await fetch('https://restcountries.com/v3.1/all');
    const data = await res.json();
    return data;
}

const countriesFull = await getCountries();
let countries = [...countriesFull];

const search = (searchInput) => {
    countries = countriesFull.filter((item) => {
        return item.name.common.toLowerCase().includes(searchInput.toLowerCase());
    });
}

const reset = () => {
    countries = [...countriesFull];
}

export { countries, search, reset };
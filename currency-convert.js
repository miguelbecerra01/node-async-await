//http://data.fixer.io/api/latest?access_key=6e5f1497640339b66ce3e0bc7b76fe24&format=1
const axios = require('axios');

const urlCurrencyRate = 'http://data.fixer.io/api/latest?access_key=6e5f1497640339b66ce3e0bc7b76fe24&format=1';

const urlCountryInfo = (currencyCode) => {
    return `https://restcountries.eu/rest/v2/currency/${currencyCode}`;
};

//callback version
const getExchangeRate = (from, to) => {
    return axios.get(urlCurrencyRate).then((response) => {
        const euro = 1 / response.data.rates[from];
        const rate = euro * response.data.rates[to];
        return rate; //chain a then statement
    });
};

const getCountries = (currencyCode) => {
    return axios.get(urlCountryInfo(currencyCode)).then((response) => {

        // return response.data.map((country) =>{
        //     return country.name;
        // });
        //crear un array con solo los nombres de los paises extraidos de la llamada a la api.
        return response.data.map((country) => country.name);
    });
};


// getExchangeRate('USD', 'CLP').then((rate) => {
//     console.log(rate);
// });

const convertCurrency = (from, to, amount) => {
    let convertedAmount;
    return getExchangeRate(from, to).then((rate) => {
        convertedAmount = (amount * rate).toFixed(2);
        return getCountries(to);
    }).then((countries) => {
        return `${amount} ${from} is worth ${convertedAmount} ${to}. You can spend it in the following countries: ${countries.join(', ')}`;
    });
};


//async await version
const getExchangeRateAsync = async (from, to) => {
    try {
        const response = await axios.get(urlCurrencyRate);
        const euro = 1 / response.data.rates[from];
        const rate = euro * response.data.rates[to];

        if (isNaN(rate)) {
            throw new Error();
        }
        return rate;
    } catch (e) {
        if (e.code === 'ENOTFOUND') {
            throw new Error(`Unable to call ${urlCurrencyRate} \n ${e}`);
        }

        throw new Error(`Unable to get exchange rate for ${from} and ${to}.`);
    }
};

const getCountriesAsync = async (currencyCode) => {
    try {
        const response = await axios.get(urlCountryInfo(currencyCode));
        return response.data.map((country) => country.name);
    } catch (e) {
        if (e.code === 'ENOTFOUND') {
            throw new Error(`Unable to call ${urlCountryInfo(currencyCode)} \n ${e}`);
        }
        throw new Error(`Unable to get countries that use ${currencyCode}`);
    }

};

const convertCurrencyAsync = async (from, to, amount) => {
    const rate = await getExchangeRateAsync(from, to);
    const countries = await getCountriesAsync(to);
    const convertedAmount = (amount * rate).toFixed(2);
    return `${amount} ${from} is worth ${convertedAmount} ${to}. You can spend it in the following countries: ${countries.join(', ')}`;
};

convertCurrencyAsync('USD', 'CLP', 30).then((message) => {
    console.log(message);
}).catch((e) => {
    console.log(e.message);
});




const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

const fetchNumbers = async(url) => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        return data.numbers || [];
    } catch (error) {
        console.log(`Error fetching numbers from ${url}: ${error.message}`);
        return [];
    }
};

const mergeAndSortNumbers = async(urls) => {
    const uniqueNumbers = new Set();
    const promises = urls.map(url => fetchNumbers(url));
    const numbersArrays = await Promise.all(promises);

    numbersArrays.forEach(numbers => {
        numbers.forEach(number => uniqueNumbers.add(number));
    });

    const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);
    return sortedNumbers;
};

app.get('/numbers', async(req, res) => {
    try {
        const urlsList = req.query.url || '';
        const urls = Array.isArray(urlsList) ? urlsList : [urlsList];
        const sortedNumbers = await mergeAndSortNumbers(urls);
        res.json({ numbers: sortedNumbers });
    } catch (error) {
        console.error("An error occurred:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
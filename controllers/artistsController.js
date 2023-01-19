const axios = require("axios");
const dotenv = require('dotenv');
const fs = require('fs')
const json2csv = require('json-2-csv')
dotenv.config({
    path: './.env'
});

exports.getArtist = async (req, res) => {

    try {

        const {
            artistname
        } = req.body;
        const response = await axios.get(
            `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artistname}&api_key=${process.env.LAST_FM}&format=json`
        );

        const artistSearch = await response.data;

        //Filter the results to only include the artist informationZ
        const filtredArtistSearch = artistSearch.results.artistmatches.artist;

        // Only return a subset of the data    
        const subsetFields = filtredArtistSearch.map(item => {
            return {
                name: item.name,
                mbid: item.mbid,
                url: item.url,
                image_small: item.image[0]['#text'],
                image: item.image[1]['#text']
            }
        });
        console.log(subsetFields);

        // convert JSON array to CSV string
        json2csv
            .json2csvAsync(subsetFields)
            .then(csv => {
                res.send("FILE SAVED")

                // write CSV to a file
                fs.writeFileSync('artistdata.csv', csv)
            })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
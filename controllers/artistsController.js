const axios = require("axios");
const dotenv = require('dotenv');
const fs = require('fs')
const {readFile} = require('fs');
const path = './random.json';

const json2csv = require('json-2-csv');
dotenv.config({ path: './.env'});

exports.getArtist = async (req, res) => {

    try {
        //Function to convert json to csv
        function jsonTOcsv(file) {
            json2csv
                .json2csvAsync(file)
                .then(csv => {
                    res.send("FILE SAVED")

                    // write CSV to a file
                    fs.writeFileSync('artistdata.csv', csv)
                })
        }

        const {artistname} = req.body;
        const response = await axios.get(
            `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artistname}&api_key=${process.env.LAST_FM}&format=json`
        );

        const artistSearch = await response.data;

        //Filter the results to only include the artist informationZ
        const filtredArtistSearch = artistSearch.results.artistmatches.artist;
        const numberOfArtists = JSON.parse(JSON.stringify(filtredArtistSearch)).length
        if (numberOfArtists != 0) {
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

            // convert JSON array to CSV string
            jsonTOcsv(subsetFields)

        } else { //Look for the artist in the random file and check their existence
            readFile(path, (error, data) => {
                if (error) {
                    console.log(error);
                    return;
                }
                data = JSON.parse(data);
                const artist = data.find(artist => artist.name === artistname);
                artist ? jsonTOcsv(artist) :
                    res.send("Artist not found in random file")
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

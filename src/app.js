const path = require('path');
const express = require('express')
const hbs = require('hbs')
var geocoder = require('geocoder');
var request = require('request');

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3001

//define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlers engine and views location
app.set('view engine', 'hbs') //tell express what type of template engine you use.
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static files
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    console.log('starting page loaded')
    res.render('index', {
        title: 'Weather',
        name: 'Kabinad Teshager'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Kabinad Teshager'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address && (!req.query.lat && !req.query.long)) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    if (req.query.lat && req.query.long) {
        const lat = req.query.lat
        const long = req.query.long

        forecast(req.query.lat, req.query.long, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            const APIKEY = process.env.GEOCODE_API_KEY
            const uriString = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${APIKEY}`

            request(uriString, function (error, response, body) {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                var obj = JSON.parse(body);
                //console.log(obj.results[0])
                const location = obj.results[0].formatted_address
         
                res.send({
                    forecast: forecastData,
                    location,
                    address: req.query.address
                })
            });
           
        })
    }
    else { // finding forcast based on address
        geocode(req.query.address, (error, { latitude, longitude, location }) => {
            if (error) {
                return res.send({ error })
            }

            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({ error })
                }

                res.send({
                    forecast: forecastData,
                    location,
                    address: req.query.address
                })
            })
        })
    }



})

app.get('/weather', (req, res) => {
    if (!req.query.long) {
        return res.send({
            error: 'You must provide long'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location }) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })

})
app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Kabinad Teshager'
    })
})


app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Help article not found.'
    })
})



app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    })
})
// app.get('/weather', (req, res) => {
//     res.send({
//         forecast: 'It is snowing',
//         location: 'Philadelphia'
//     })
// })

app.get('*', (req, res) => {
    res.send('My 404 page')
})


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
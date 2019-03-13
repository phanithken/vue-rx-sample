var express = require('express')
var app = express()

app.get('/', (req, res, next) => {
    res.json([
        'a', 'b', 'c'
    ])
})

app.listen(3000, () => {
    console.log('server running on port 3000')
})
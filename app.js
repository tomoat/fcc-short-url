const express = require("express")
const path = require("path")

const app = express()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/api/whoami', (req, res) => {
    // console.log(req)
    const ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress
     const info = {
         'ipaddress': ip,
         'language': req.headers["accept-language"].split(',')[0],
         'software': req.headers['user-agent'].split(') ')[0].split(' (')[1]
     }
    // res.send(info);
    res.json(info)
})


app.listen(8080)
const express = require('express');
const fs = require('fs');

//adding express functionality
const app = express(); 

//enable server
const PORT = process.env.PORT || 7777;

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.sendFile(__dirname +'/public/index.html');
});

app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
});

app.get('/api/notes', (req,res) => {
    res.sendFile(__dirname + './db/db.json');
});

app.post ('/api/notes', (req,req) => {
    let {title, text} = req.body;
    if (title && text) {
        let newNote = {title, text};
        fs.readFile(__dirname + '/db/db.json', 'utf8', (err,data) => {
            if (err) throw err;
            data = JSON.parse(data);
            newNote.id = data.length;
            data.push(newNote);
            fs.writeFile(__dirname + '/db/db.json', JSON.stringify(data), err =>{
                if (err) throw err;
                console.log("this works")
            });
        })
        //res.send(newNote);
    }
    else {
        throw new Error ('it does not work')
    }
})

app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
  });
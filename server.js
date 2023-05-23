const express = require('express');
const fs = require('fs');

//adding express functionality
const app = express(); 

//enable server
const PORT = process.env.PORT || 7777;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req,res) => {
    res.sendFile(__dirname +'/public/index.html');
});

app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
});

app.get('/api/notes', (req,res) => {
    res.sendFile(__dirname + './db/db.json');
});

app.post ('/api/notes', (req,res) => {
    let {title, text} = req.body;
    if (title && text) {
        let newNote = {title, text};
        fs.readFile(__dirname + '/db/db.json', 'utf8', (err,data) => {
            if (err) throw err;
            let newData = JSON.parse(data);
            newNote.id = newData.length;
            newData.push(newNote);
            fs.writeFile('./db/db.json', JSON.stringify(newData), err =>{
                if (err) throw err;
                console.log("this works")
            });
        })
    }
    else {
        throw new Error ('it does not work')
    }
})

app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
  });
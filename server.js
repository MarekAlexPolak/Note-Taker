const express = require('express');
const fs = require('fs');

//adding express functionality
const app = express(); 

//enable server
const PORT = process.env.PORT || 5004;

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
    res.sendFile(__dirname + '/db/db.json');
});

app.post ('/api/notes', (req,res) => {
    let {title, text} = req.body;
    if (title && text) {
        let newNote = {title, text};
        fs.readFile('./db/db.json', 'utf-8', (err,data) => {
            if (err) throw err;
            let newData = JSON.parse(data);
            newNote.id = newData.length;
            console.log(newNote);
            newData.push(newNote);
            fs.writeFile('./db/db.json', JSON.stringify(newData), err =>{
                if (err) throw err;
                console.log("this works")
            });
            res.send(newData);
        })
    }
    else {
        res.status(500).json('it does not work');
    }
})

app.delete('/api/notes/:id', (req, res) => {
    // Get the id of the note being deleted
    const id = req.params.id;
    fs.readFile('./db/db.json', 'utf-8', (err, notes) => {
        if (err) throw err;
    
        delNotes = JSON.parse(notes);

        for (let i = 0; i < delNotes.length; i++) {
            if (delNotes[i].id === parseInt(id)) {
                delNotes.splice(i, 1);
            }
        }
        fs.writeFile('./db/db.json', JSON.stringify(delNotes), err => {
            if (err) throw err;
            console.log(id);
        });
        res.send(delNotes);
    });
})

app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
  });
//import required libraries
const express = require('express');
const fs = require('fs');

//adding express functionality
const app = express(); 

//enable server port
const PORT = process.env.PORT || 5009;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//get index html
app.get('/', (req,res) => {
    res.sendFile(__dirname +'/public/index.html');
});
//get notes html
app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
});
//get existing notes files saved in the server
app.get('/api/notes', (req,res) => {
    res.sendFile(__dirname + '/db/db.json');
});


app.post ('/api/notes', (req,res) => {
    //save the give title and text of the note in their own variables
    let {title, text} = req.body;
    //once both have been inputed
    if (title && text) {
        let newNote = {title, text};
        //reads the existing db.json to get saved information
        fs.readFile('./db/db.json', 'utf-8', (err,data) => {
            if (err) throw err;
            //saves original data in the new data variable
            let newData = JSON.parse(data);
            newNote.id = newData.length;
            console.log(newNote);
            //appends the newData array with the newly inputed information
            newData.push(newNote);
            //rewrites the db.json file to include new inputed data
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
    //get information from db.json
    fs.readFile('./db/db.json', 'utf-8', (err, notes) => {
        if (err) throw err;
        //store information in an array
        delNotes = JSON.parse(notes);
        //indexing could have been done better by using something like a hashtable
        for (let i = 0; i < delNotes.length; i++) {
            if (delNotes[i].id === parseInt(id)) {
                delNotes.splice(i, 1);
                for (let x = i; x < delNotes.length; x++){
                    delNotes[x].id--;
                }
                break;
            }
        }
        //writes the new array without the deleted entry
        fs.writeFile('./db/db.json', JSON.stringify(delNotes), err => {
            if (err) throw err;
            console.log(id);
        });
        res.send(delNotes);
    });
})
//listen to the port specified
app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
  });
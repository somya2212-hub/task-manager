
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    fs.readdir('./files', function (err, files) {
        if (err) return res.status(500).send(err.message);

        res.render('index', { files: files });
    });
});

app.get('/file/:filename', function (req, res) {
    fs.readFile(
        `./files/${req.params.filename}`,
        'utf-8',
        function (err, filedata) {
            if (err) return res.status(404).send('File not found');

            res.send(filedata);
        }
    );
});

app.post('/create', function (req, res) {
    const filename = req.body.title.split(' ').join('') + '.txt';

    fs.writeFile(
        `./files/${filename}`,
        req.body.details,
        function (err) {
            if (err) return res.status(500).send(err.message);

            res.redirect('/');
        }
    );
});

app.listen(3000, function () {
    console.log('Server running on port 3000');
});

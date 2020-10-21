const express = require('express');
const hbs = require('hbs');
const multer = require('multer');

const listFiles = require('./folder');

const app = express();

const upload = multer({ dest: 'files/' });
// set up storage and rename upload files
let maxSize = 1 * 1000 * 1000;
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
  onFileUploadStart: function (file, req, res) {
    if (req.files.file.lenght > maxSize) {
      return false;
    }
  },
});

// using static upload files
app.use(express.static(__dirname));
// set up the multerstorage from input filedate in html
app.use(
  multer({ storage: storageConfig, limits: { fileSize: maxSize } }).single(
    'filedate'
  )
);
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partial/');

app.get('/', (req, res) => {
  let links = listFiles.getFiles('./files/');
  res.render('index', {
    title: 'Main page',
    description: 'List of your links',
    links: links,
  });
});

app.get('/upload', (req, res) => {
  res.render('upload', {
    title: 'Upload page',
    description: 'Put your links here',
    downbutton: 'Download files',
  });
});

app.post('/upload', upload.single('filedate'), (req, res, next) => {
  let filedate = req.file;
  if (filedate) {
    console.log('success');
    res.redirect('/');
  } else {
    console.log('fail');
    res.send('Error was occured');
  }
  next();
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => {
  console.log('starting on 3000...');
});

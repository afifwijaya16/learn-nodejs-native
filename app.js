const express = require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express();

//connection database mysql
const mysql = require('mysql');
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'db_nodejs_crud'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
});

//set view file 
app.set("views", __dirname + "/views/");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/script-adminlte",
  express.static(path.join(__dirname, "/node_modules/admin-lte/"))
);
// app.use(function (req, res, next) {
//   res.locals.stuff = {
//     url: req.originalUrl
//   }
//   next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.get('/',( req, res) => {
    // res.send('CRUD Operaton using Node JS/ Express JS/ MYSQL');
    let sql = "SELECT * FROM students";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('student_index', {
            title : 'Crude Operation using nodejs, express and mysql',
            breadcrumb : 'Student',
            students : rows
        });
    });
});

app.get('/add',(req, res) => {
    res.render('student_add', {
        title : 'Crude Operation using nodejs, express and mysql',
        breadcrumb : 'Student',
        breadcrumb_data : 'Add Student'
    });
});

app.post('/save', (req, res) => {
    let data = {
        name : req.body.name,
        email: req.body.email,
        phone_no: req.body.phone_no
    };
    let sql = "INSERT INTO students SET ?"
    let query = connection.query(sql, data, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.get('/edit/:studentId',(req, res) => {
    const studentId = req.params.studentId;
    let sql = `SELECT * From students where id = ${studentId}`;
    let query = connection.query(sql, (err, result) => {
        if(err) throw err;
        res.render('student_edit', {
            title : 'Crude Operation using nodejs, express and mysql',
            breadcrumb : 'Student',
            breadcrumb_data : 'Edit Student',
            students : result[0]
        }); 
    });
});

app.post('/update', (req, res) => {
    const studentId = req.body.id;
    let sql = "UPDATE students SET name='"+req.body.name+"', email='"+req.body.email+"', phone_no='"+req.body.phone_no+"' where id =" +studentId;
    let query = connection.query(sql,(err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.get('/delete/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    let sql = `delete from students where id = ${studentId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});
//server running
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server starts http://localhost:${port}`));
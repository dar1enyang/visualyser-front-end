var express = require("express");
var cors = require('cors')
var app = express();

const color_list = ['#44fda4',
    '#cefd1a',
    '#fde536',
    '#fd8e28',
    '#fd8e86',
    '#fd4297',
];

app.use(cors());

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "reactdb"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

// API for testing
app.get("/test", (req, res, next) => {
    res.send({data : "PPPPPPPPPPPPPPP"});
});

// API for passenger list
app.get("/list",function(req,res){

    con.query('SELECT * from passenger', function(err, rows, fields) {
        //con.end();
        if (!err)
            //console.log('The solution is: ', rows);
            console.log('The solution is: ');
        else
            console.log('Error while performing Query.');

        res.json(rows);
    });

});

// API for counting Males, Females
app.get("/males",function(req,res){

    let all = 0, males = 0, females = 0;
    con.query('SELECT count(*) as count from passenger', function(err, rows, fields) {
        //con.end();
        if (!err)
        //console.log('The solution is: ', rows);
            console.log('males query successful.');
        else
            console.log('Error while performing Query.');

        console.log(rows[0]['count']);
        all = rows[0]['count'];
    });

    con.query("SELECT count(*) as count from passenger where sex='M'", function(err, rows, fields) {
        //con.end();
        if (!err)
        //console.log('The solution is: ', rows);
            console.log('males query successful.');
        else
            console.log('Error while performing Query.');

        males = rows[0]['count'];
    });

    con.query("SELECT count(*) as count from passenger where sex='F'", function(err, rows, fields) {
        //con.end();
        if (!err)
        //console.log('The solution is: ', rows);
            console.log('males query successful.');
        else
            console.log('Error while performing Query.');

        females = rows[0]['count'];
        console.log(all,males,females)
        res.json({'persons':all, 'males':males, 'females':females});
    });

});


// For pclass count api
app.get("/pclass",function(req,res){
    let sex = "M";
    if (req.query.male === 'M')
        sex = "M";
    else if (req.query.male === 'F')
        sex = "F";

    con.query("SELECT pclass, count(*) as count from passenger where sex='" + sex + "' group by pclass", function(err, rows, fields) {
        //con.end();
        if (!err)
        //console.log('The solution is: ', rows);
            console.log('males query successful.');
        else
            console.log('Error while performing Query.');

        let pie_result = [];
        let bar_result = [];
        let index = 0;
        rows.forEach(function(row) {
            pie_result.push({title:'Pclass '+row['pclass'], value:row['count'], color:color_list[index % color_list.length]});
            bar_result.push({x:(index+1) * 10, y:row['count']});
            index++;
        });
        console.log(bar_result);
        res.json({pie_pclass:pie_result, bar_pclass:bar_result});
    });

});


var path = require("path");
const bodyParser = require("body-parser");
var mysql = require('mysql');

const db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password: '123456',
  database: 'db'
});

db.connect((err) => {
  if (err) return err;
  console.log("My sql connected");
});

module.exports = (app) => {
    app.use(bodyParser.urlencoded({extended: true}));

    var p = path.join(__dirname, "..\\public\\htmlfiles");

    app.get('/', (req, res) => {
        res.sendFile(path.join(p, "\\index.html"));
    });

    app.post('/add', (req, res) => {
      var values = Array(14).fill("");
      if (JSON.stringify(req.body) == "{}"){
        return res.render('add', {values});
      }
      var a = req.body.add;
      var errors = [];
      if (a == "Add Cab"){
        values[0] = req.body.driver_name;
        values[1] = req.body.cities_City_Name;
        values[2] = req.body.phone_number;
        if (!req.body.driver_name){
          errors.push("Enter your name");
        }
        if (!req.body.cities_City_Name){
          errors.push("Enter your working location");
        }
        if (!req.body.phone_number){
          errors.push("Enter your phone number");
        }
      }else if(a == "Add Hotel"){
        values[3] = req.body.hotel_name;
        values[4] = req.body.cities_City_Name;
        values[5] = req.body.phone_number;
        values[6] = req.body.average_user_review;
        if (!req.body.hotel_name){
          errors.push("Enter your hotel name");
        }
        if (!req.body.cities_City_Name){
          errors.push("Enter your hotel location");
        }
        if (!req.body.phone_number){
          errors.push("Enter your hotel phone number");
        }
        if (!req.body.average_user_review){
          errors.push("Enter average rating of your hotel");
        }
      }else if(a == "Add Restaurant"){
        values[7] = req.body.restaurant_name;
        values[8] = req.body.cities_City_Name;
        values[9] = req.body.is_vegetarian;
        values[10] = req.body.phone_number;
        values[11] = req.body.opening_time;
        values[12] = req.body.closing_time;
        values[13] = req.body.average_user_review_restaurants;
        if (!req.body.restaurant_name){
          errors.push("Enter your restaurant name");
        }
        if (!req.body.cities_City_Name){
          errors.push("Enter your restaurant location");
        }
        if (!req.body.is_vegetarian){
          errors.push("Enter whether your restaurant is vegetarian or not");
        }
        if (!req.body.phone_number){
          errors.push("Enter your restaurant phone number");
        }
        if (!req.body.opening_time){
          errors.push("Enter your restaurant opening time");
        }
        if (!req.body.closing_time){
          errors.push("Enter your restaurant closing time");
        }
        if (!req.body.average_user_review_restaurants){
          errors.push("Enter average rating of your restaurant");
        }
      }
      if(errors.length!=0){
        console.log(errors);
        res.render("add", {errors, a, values});
      }else{
        if (a == "Add Cab"){
          let post = {phone_number: req.body.phone_number, driver_name: req.body.driver_name, cities_City_Name: req.body.cities_City_Name};
          let sql = 'INSERT INTO taxis SET ?';
          let query = db.query(sql, post, (err, results) => {
            if(err) throw err;
            res.sendFile(path.join(p, "\\index.html"));
        });
        }else if(a == "Add Hotel"){
          let post = {hotel_name: req.body.hotel_name, phone_number: req.body.phone_number, average_user_review: req.body.average_user_review, cities_City_Name: req.body.cities_City_Name};
          let sql = 'INSERT INTO hotels SET ?';
          let query = db.query(sql, post, (err, results) => {
            if(err) throw err;
            res.sendFile(path.join(p, "\\index.html"));
        });
        }else if(a == "Add Restaurant"){
          let post = {restaurant_name: req.body.restaurant_name, phone_number: req.body.phone_number, average_user_review_restaurants: req.body.average_user_review_restaurants, cities_City_Name: req.body.cities_City_Name, is_vegetarian: req.body.is_vegetarian, opening_time: req.body.opening_time, closing_time: req.body.closing_time};
          let sql = 'INSERT INTO restaurants SET ?';
          let query = db.query(sql, post, (err, results) => {
            if(err) throw err;
            res.sendFile(path.join(p, "\\index.html"));
        });
        }
      }
    });

    app.post('/cabs', (req, res) => {
      let sql = 'SELECT DISTINCT cities_City_Name FROM taxis';
      let query = db.query(sql, (err, results) => {
          if(err) throw err;
          res.render('cabs', {results});
      });
    });

    app.post('/hotel', (req, res) => {
      let sql = 'SELECT DISTINCT cities_City_Name FROM hotels';
      let query = db.query(sql, (err, results) => {
          if(err) throw err;
          res.render('hotel', {results});
      });
    });

    app.post('/trains', (req, res) => {
      let sql = 'SELECT DISTINCT starting_state FROM trains_has_states';
      let query = db.query(sql, (err, results) => {
          if(err) throw err;
          res.render('trains', {results});
      });
    });

    app.post('/restaurants', (req, res) => {
      let sql = 'SELECT DISTINCT cities_City_Name FROM restaurants';
      let query = db.query(sql, (err, results) => {
          if(err) throw err;
          res.render('restaurants', {results});
      });
    });

    app.post('/tourist', (req, res) => {
      let sql = 'SELECT DISTINCT cities_City_Name FROM tourist_attractions';
      let query = db.query(sql, (err, results) => {
          if(err) throw err;
          res.render('tourist', {results});
      });
    });

    app.post('/cabs_list', (req, res) => {
      let sql = `SELECT * FROM taxis WHERE cities_City_Name = "${req.body.from}"`;
      let query = db.query(sql, (err, results) => {
          if(err) throw err;
          res.render('cabs_list', {results});
      });
    });

    app.post('/trains_list', (req, res) => {
      let sql = `SELECT * FROM trains_has_states WHERE starting_state = "${req.body.from}" AND ending_state = "${req.body.to}"`;
      let query = db.query(sql, (err, results) => {
          if(err) throw err;
          res.render('trains_list', {results});
      });
    });

    app.post('/hotel_list', (req, res) => {
      let sql = `SELECT * FROM hotels WHERE cities_City_Name = "${req.body.from}"`;
      let query = db.query(sql, (err, results) => {
          if(err) throw err;
          res.render('hotel_list', {results});
      });
    });

    app.post('/restaurants_list', (req, res) => {
      let sql = `SELECT * FROM restaurants WHERE cities_City_Name = "${req.body.from}"`;
      let query = db.query(sql, (err, results) => {
          if(err) throw err;
          res.render('restaurant_list', {results});
      });
    });

    app.post('/tourist_list', (req, res) => {
      let sql = `SELECT * FROM tourist_attractions WHERE cities_City_Name = "${req.body.from}"`;
      let query = db.query(sql, (err, results) => {
          if(err) throw err;
          res.render('tourist_list', {results});
      });
    });
};

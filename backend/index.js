const express = require("express");
const sql = require("mysql2");
const app = express();
const router = express.Router();
const { Client } = require("pg");
var cors = require("cors");
const bodyParser = require("body-parser");
let connectionRequest = require("./connectionRequest");
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Create a MySQL connection
// const connection = sql.createConnection({
//   host: "sql.freedb.tech",
//   user: "freedb_bibhav",
//   password: "jkX&QZQA88guy7y",
//   database: "freedb_redsan_user",
// });

//Establish the connection on this request
connection = connectionRequest();

//Run the query
connection.query("SELECT * FROM user", function (err, result, fields) {
  if (err) {
    // If an error occurred, send a generic server failure
    console.log(`not successful! ${err}`);
    connection.end();
  } else {
    //If successful, inform as such
    console.log(`Query was successful, ${result}`);

    // //send json file to end user if using an API
    // res.json(result);

    //destroy the connection thread
    connection.end();
  }
});

// Connect to the MySQL database
// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database: " + err.stack);
//     return;
//   }
//   console.log("Connected to the database as ID " + connection.threadId);
// });
// const userid = localStorage.getItem("uid");
// const couponDesc = localStorage.getItem("coupon");
// //select all coupons

// connection.query(
//   `SELECT * FROM coupons where uid=${userid}`,
//   function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   }
// );

function addCoupon(uid, coupon, response) {
  connection = connectionRequest();
  connection.query(
    `INSERT INTO coupons(uid,cdesc) VALUES(${uid},${coupon})`,
    function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      console.log(result.insertId);
      response.json({
        status: 201,
        message: "Coupon Added added Successfully.",
        cid: result.insertId,
      });
    }
  );
}

function checkUser(fullname, phone, email, response) {
  //establishing connection
  connection = connectionRequest();
  //cheeck if already registered
  connection.query(
    `SELECT * from user where phone=${phone} `,
    function (err, res) {
      if (err) {
        console.error("An error occurred:", err.message);
        response.json({
          status: 500,
          message: "An error occurred: " + err.message,
        });
      } else {
        if (res.length) {
          console.log("User found Successfully.");
          console.log(res[0].uid);
          response.json({
            status: 200,
            message: "User found successfully.",
            uid: res[0].uid,
          });
        } else {
          console.log("User not found.");
          //add user if user not found
          addUser(fullname, phone, email, response);
        }
      }
    }
  );
}

function addUser(fullname, phone, email, response) {
  //establishing connection
  connection = connectionRequest();

  connection.query(
    `INSERT INTO user(uname,phone,email) VALUES(${JSON.stringify(
      fullname
    )},${phone},${JSON.stringify(email)})`,
    function (err, result, fields) {
      if (err) throw err;
      console.log(result.insertId);
      response.json({
        status: 201,
        message: "User added Successfully.",
        uid: result.insertId,
      });
    }
  );
}

app.post("/addcoupon", (request, response) => {
  const { uid, coupon } = request.body; //object destructuring
  console.log(request.body);
  addCoupon(uid, coupon, response);

  //using conn end instead of destroy because of some sql2 reeoe on  connecion protocol
  connection.end();
});

app.post("/login", (request, response) => {
  const { fullname, phone, email } = request.body; //object destructuring
  console.log(request.body);
  checkUser(fullname, phone, email, response);

  //using conn end instead of destroy because of some sql2 reeoe on  connecion protocol
  connection.end();
});
app.get("/user", (request, response) => {
  const { phone } = request.body; //object destructuring
  console.log(request.body);

  //using conn end instead of destroy because of some sql2 reeoe on  connecion protocol
  connection.end();
});
// Start the server on port 3000
app.listen(3007, () => {
  console.log("Listening on port 3007...");
});

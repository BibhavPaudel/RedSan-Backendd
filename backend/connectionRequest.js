module.exports = function () {
  let mysql = require("mysql2");

  //Establish Connection to the DB
  let connection = mysql.createConnection({
    host: "sql.freedb.tech",
    user: "freedb_bibhav",
    password: "jkX&QZQA88guy7y",
    database: "freedb_redsan_user",
  });

  //Instantiate the connection
  connection.connect(function (err) {
    if (err) {
      console.log(`connectionRequest Failed ${err.stack}`);
    } else {
      console.log(`DB connectionRequest Successful ${connection.threadId}`);
    }
  });

  //return connection object
  return connection;
};

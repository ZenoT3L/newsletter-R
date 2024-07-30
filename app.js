const express = require("express");

const https = require("https");

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/signup.html");
});

app.post("/", function (req, res) {
  const fName = req.body.fsName;
  const lName = req.body.lsName;
  const email = req.body.eMail;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };

  let json = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/20a2d5c1cf";

  const options = {
    method: "POST",
    auth: "rhema:67a0d8afbf9964408fe8998449eddd02-us17",
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      const error = JSON.parse(data);
      console.log(JSON.parse(data));
      console.log(error.error_count);
      if (response.statusCode === 200 && error.error_count === 0) {
        res.sendFile(__dirname + "/public/success.html");
      } else {
        res.sendFile(__dirname + "/public/failure.html");
      }
    });
  });

  request.write(json);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});

//67a0d8afbf9964408fe8998449eddd02-us17
// 20a2d5c1cf

const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
let { response } = require("express");
require('dotenv').config()



const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.listen(3000, function () {
  console.log("server is up and running.");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {

  console.log("successfully submitted form");
  mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.SERVER
  });
  console.log(process.env.SERVER);

  const listId = "a134b1d466";
  const subscribingUser = {
    firstName: req.body.nombre,
    lastName: req.body.apellido,
    email: req.body.correo,
  };

  async function run() {

    console.log("run() is running");

    try {
      response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      });
      console.log(
        `Successfully added contact as an audience member. The contact's id is ${response.id}.`
      );
      res.sendFile(__dirname + "/success.html");
    }

    catch (error) {
      console.error(error);
      res.sendFile(__dirname + "/failure.html");
    }

  }
  run();

});


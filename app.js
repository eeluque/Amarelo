const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { response } = require("express");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, function () {
  console.log("server is up and running.");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  mailchimp.setConfig({
    apiKey: "f64799ed769a06e959399e523eebd28f",
    server: "us21",
  });

  const listId = "a134b1d466";
  const subscribingUser = {
    firstName: req.body.nombre,
    lastName: req.body.apellido,
    email: req.body.correo,
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
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
    console.log(response.properties.status.example);
  }

  run();

  // if (response.status != "400") {
  //   res.sendFile(__dirname + "/success.html");
  // } else {
  //   res.sendFile(__dirname + "/failure.html");
  // }
});

//f64799ed769a06e959399e523eebd28f-us21
//audience ID a134b1d466

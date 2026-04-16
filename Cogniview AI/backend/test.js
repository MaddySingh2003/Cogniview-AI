const fetch = require("node-fetch");

fetch(`https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY`)
  .then(res => res.json())
  .then(data => console.log(data));
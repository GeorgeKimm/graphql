const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("../schema/schema.js");
const mongoose = require("mongoose");

const app = express();
const PORT = 3005;
const password = "0000";

mongoose.connect(
  `mongodb+srv://stady:${password}@cluster0.nehn5.mongodb.net/graphqlTutorial?retryWrites=true&w=majority`
);

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`connection error: ${err}`));
dbConnection.once("open", () => console.log(`connection to Db`));

// graphqlHTTP это пакет котораый позволяет express серверу использовать graphql API
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, (err) => {
  err ? console.log(error) : console.log("server started");
});

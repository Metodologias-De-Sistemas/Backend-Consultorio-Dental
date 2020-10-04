const app = require('./app');
const { PORT, MONGODB_URI } = require('./utils/config');
const mongoose = require('mongoose');

console.log(`Connecting to: ${MONGODB_URI}`);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
.then((_res) => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error(`error connecting to MongoDB service: ${err.message}`);
});


app.listen(PORT, () => {
  console.log(`App listening in port: ${PORT}`);
})
const express = require('express');
const app = express();
const User_Rout = require('./routs/user.rout.js');
require('./db.js');

app.set('json spaces', 2);
app.use(express.json());

app.use('/user', User_Rout);

let port = 8080;
if(process.env.PORT) {
    port = process.env.PORT;
}
app.listen(port, () => {
    console.log('server is running on port:' + port);
});
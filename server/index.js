const express = require('express');
const app = express();

let port = 8080;
if(process.env.PORT) {
    port = process.env.PORT;
}
app.listen(port, () => {
    console.log('server is running on port:' + port);
});
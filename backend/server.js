const app = require('./src/app')
const connectdb = require('./src/db/db');
connectdb();
const port = process.env.PORT || 4000;

app.listen(port, function(){
    console.log('server is running on port 3000')
})
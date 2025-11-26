const app = require('./src/app')
const connectdb = require('./src/db/db')

app.listen(3000,function(){
    console.log('server is running on port 3000')
})

connectdb()
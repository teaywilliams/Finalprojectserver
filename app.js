require('dotenv').config();
let express = require('express');
let app = express();
let sequelize = require('./db');

let user = require('./controllers/usercontroller');
let profile = require('./controllers/profilecontroller');
let subscription = require('./controllers/subscriptioncontroller');

sequelize.sync();
app.use(express.json());
app.use(require('./middleware/headers'));

app.use('/user', user)

app.use(require('./middleware/validate-session'));
app.use('/profile', profile);
app.use('/subscription', subscription);



app.listen(process.env.PORT, () => {console.log(`App is listening on port ${process.env.PORT}`) ;
})
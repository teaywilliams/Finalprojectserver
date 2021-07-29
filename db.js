const Sequelize = require('sequelize');
// const sequelize = new Sequelize('server', 'postgres', 'password', {
//     host: 'localhost',
//     dialect: 'postgres'
// });

// const Sequelize = require('sequelize')


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: !process.env.DATABASE_URL.includes('localhost')
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false, // fixing unhandled rejection
        },
      }
    : {},
})

sequelize.authenticate().then(
    function() {
        console.log('connected to server postgres database');
    },
    function(err){
        console.log(err);
    }
);

const User = sequelize.import('./models/user');
const Profile = sequelize.import('./models/profile');
const Subscription = sequelize.import('./models/subscription');

User.hasMany(Profile);
Profile.belongsTo(User);


User.hasOne(Subscription);
Subscription.belongsTo(User);


module.exports = sequelize;
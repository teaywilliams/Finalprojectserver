module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define('subscription', {
        streetAddress1: {
            type: DataTypes.STRING,
            allowNull: false
        },
        streetAddress2: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        zip: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        entryId: {
            type: DataTypes.INTEGER,
            unique: true
        }
    })
    return Subscription;
};
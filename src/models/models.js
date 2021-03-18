const { DataTypes, Sequelize } = require('sequelize');

const sequelize = require('./sequelize');
const context = sequelize.context;

//! Models

const User = context.define(
  'user',
  {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: true },
    confirmed: { type: DataTypes.BOOLEAN, allowNull: false },
    admin: { type: DataTypes.BOOLEAN, allowNull: false }, // (1) - Admin, (0) - User
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  { freezeTableName: true, paranoid: true }
);

const List = context.define(
  'list',
  {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    default: { type: DataTypes.BOOLEAN, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  { freezeTableName: true, paranoid: true }
);

const Video = context.define(
  'video',
  {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    poster: { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.STRING, allowNull: false },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  { freezeTableName: true, paranoid: true }
);

//! Relations

List.Videos = List.hasMany(Video);
Video.List = Video.belongsTo(List);

User.belongsToMany(List, { through: 'user_list' });
List.belongsToMany(User, { through: 'user_list' });

//! Sync
sequelize.syncCompleteModel();

//! Exports

module.exports = {
  UserModel: User,
  ListModel: List,
  VideoModel: Video
};

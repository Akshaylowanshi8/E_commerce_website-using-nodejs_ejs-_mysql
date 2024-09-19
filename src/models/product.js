'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category);
      Product.hasMany(models.Cart, {
        foreignKey: 'productId',
      });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    description: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    brandName: DataTypes.STRING,
    categoryId: DataTypes.INTEGER
  },
  {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};
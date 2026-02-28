'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StaticPages extends Model {
    static associate(models) { }
  }

  StaticPages.init(
    {
      static_page_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      excerpt: DataTypes.TEXT,
      content: DataTypes.TEXT('long'),
      metaTitle: DataTypes.STRING,
      metaDescription: DataTypes.STRING,
      metaKeywords: DataTypes.STRING,
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'static_pages'
    }
  );

  return StaticPages;
};

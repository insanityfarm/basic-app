import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database';

class Item extends Model {
  public id!: number;
  public name!: string;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'items',
  }
);

export default Item;


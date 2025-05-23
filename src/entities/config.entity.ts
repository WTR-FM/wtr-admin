import {
    Column,
    Model,
    Table,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

@Table({
    tableName: 'configs',
    paranoid: false,
    indexes: [
        { unique: true, fields: ['key'] },
    ],
})
export class Config extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare key: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare value: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare description: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare category: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;
}

export type ConfigAttributes = Omit<Config, 'id'>; 
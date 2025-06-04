import {
    Column,
    Model,
    Table,
    DataType,
    CreatedAt,
    UpdatedAt,
    BeforeCreate,
    BeforeUpdate,
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
    
    @BeforeCreate
    @BeforeUpdate
    static async validateConfigValues(instance: Config) {
        // Only run validation for MaxSongsPerTeam
        if (instance.key === 'MaxSongsPerTeam') {
            // Check if MaxSongsPerRoster exists
            const maxSongsPerRoster = await Config.findOne({
                where: { key: 'MaxSongsPerRoster' }
            });

            if (!maxSongsPerRoster) {
                throw new Error('Roster size configuration (MaxSongsPerRoster) is not set. Please add that first before setting the team size configuration (MaxSongsPerTeam).');
            }
            
            // If MaxSongsPerRoster exists, ensure MaxSongsPerTeam doesn't exceed it
            if (instance.value > maxSongsPerRoster.value) {
                throw new Error(`MaxSongsPerTeam (${instance.value}) cannot exceed MaxSongsPerRoster (${maxSongsPerRoster.value})`);
            }
        }
        
        // Also validate if setting MaxSongsPerRoster below existing MaxSongsPerTeam
        if (instance.key === 'MaxSongsPerRoster') {
            // Check if MaxSongsPerTeam exists
            const maxSongsPerTeam = await Config.findOne({
                where: { key: 'MaxSongsPerTeam' }
            });
            
            // If MaxSongsPerTeam exists, ensure MaxSongsPerRoster isn't set below it
            if (maxSongsPerTeam && instance.value < maxSongsPerTeam.value) {
                throw new Error(`MaxSongsPerRoster (${instance.value}) cannot be less than MaxSongsPerTeam (${maxSongsPerTeam.value})`);
            }
        }
    }
}

export type ConfigAttributes = Omit<Config, 'id'>; 
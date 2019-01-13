'use strict';

module.exports = function (sequelize, DataTypes) {
    const kindergarten = sequelize.define('kindergarten', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        unique_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        year: {
            type: DataTypes.INTEGER(4),
            allowNull: false
        },
        nvusc: {
            type: DataTypes.ENUM('Hl. m. Praha','Středočeský kraj','Jihočeský kraj','Plzeňský kraj','Karlovarský kraj','Ústecký kraj','Liberecký kraj','Královéhradecký kraj','Pardubický kraj','Kraj Vysočina','Jihomoravský kraj','Olomoucký kraj','Zlínský kraj','Moravskoslezský kraj'),
            allowNull: false,
        },
        vusc: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        red_izo: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        zriz_kod: {
            type: DataTypes.INTEGER(4),
            allowNull: false
        },
        red_pln: {
            type: DataTypes.STRING(2048),
            allowNull: false,
        },
        red_nazev: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        red_ulice: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        red_misto: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        red_psc: {
            type: DataTypes.INTEGER(4),
            allowNull: false
        },
        www: {
            type: DataTypes.STRING(2048),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        izo: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        zar_naz: {
            type: DataTypes.STRING(2048),
            allowNull: true,
        },
        ruian_code: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        zuj: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        sp_school: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        children_zz: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            defaultValue: 0,
        },
        children_indiv_integr: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            defaultValue: 0,
        },
        children_total_attendance: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            defaultValue: 0,
        },
        children_total_capacity: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            defaultValue: 0,
        },
        children_special_class: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            defaultValue: 0,
        },
        children_normal_class: {
            type: DataTypes.INTEGER(5),
            allowNull: false,
            defaultValue: 0,
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        longitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
    }, {
        tableName: 'kindergarten',
        freezeTableName: true,
        timestamps: false
    });
    return kindergarten;
};

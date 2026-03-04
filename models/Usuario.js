import { DataTypes} from "sequelize";
import db from "../config/db.js"
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const Usuario = db.define('Usuario', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type:DataTypes.STRING(100),
      allowNull:false,
      validate: 
        { 
          notEmpty: {
          msg: 'El nombre no pueder ser vacío' }
        }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: 'El email ya está registrado'
      },
       validate: {
        isEmail: {
          msg: 'Debe proporcionar un email válido'
        },
        notEmpty: {
          msg: 'El email no puede estar vacío'
        }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La contraseña no puede estar vacía'
        },
        len: {
          args: [8, 100],
          msg: 'La contraseña debe tener al menos 6 caracteres'
        }
      }
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, 
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'token'
    },
    tokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'token_expiration'
    },
    regStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'reg_status'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login'
    }
  }, {
    tableName: 'tb_users',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    hooks: {
      // Hash de contraseña antes de crear
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
      
      // Hash de contraseña antes dez actualizar (si cambió)
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }
    }
  });

  /*
  // Métodos de instancia
  Usuario.prototype.validarPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  Usuario.prototype.generarTokenRecuperacion = function() {
    // Generar token aleatorio
    const token = crypto.randomBytes(20).toString('hex');
    this.tokenRecuperacion = token;
    // Token válido por 1 hora
    this.tokenExpiracion = new Date(Date.now() + 3600000);
    return token;
  };

  Usuario.prototype.validarTokenRecuperacion = function(token) {
    return this.tokenRecuperacion === token && 
           this.tokenExpiracion > new Date();
  };

  Usuario.prototype.limpiarTokenRecuperacion = function() {
    this.tokenRecuperacion = null;
    this.tokenExpiracion = null;
  };

  // Métodos estáticos
  Usuario.findByEmail = function(email) {
    return this.findOne({ 
      where: { 
        email: email,
        regStatus: true 
      } 
    });
  };

  Usuario.findByTokenRecuperacion = function(token) {
    return this.findOne({
      where: {
        tokenRecuperacion: token,
        tokenExpiracion: { [sequelize.Sequelize.Op.gt]: new Date() },
        regStatus: true
      }
    });
  };*/

  export default Usuario;

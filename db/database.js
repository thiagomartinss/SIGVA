const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

class Database {

    #conexao;

    get conexao() { return this.#conexao;} 
    set conexao(conexao) { this.#conexao = conexao; }

    constructor() {
        dotenv.config();//carrega variavel de ambiente
        this.#conexao = mysql.createPool({
            host: process.env.host || 'localhost', 
            database: process.env.database, 
            user: process.env.user, 
            password: process.env.password,
            waitForConnections: true,
            connectionLimit: 2, 
            queueLimit: 0 
        });
    }

    async beginTransaction() {
        const connection = await this.#conexao.getConnection(); 
        await connection.beginTransaction();
        return connection;
    }

    async commit(connection) {
        await connection.commit();
        connection.release();
    }

    async rollback(connection) {
        await connection.rollback();
        connection.release();
    }


    async ExecutaComando(sql, valores = [], connection = null) {
        if (connection) {
            const [rows] = await connection.query(sql, valores);
            return rows;
        } else {
            const [rows] = await this.#conexao.query(sql, valores);
            return rows;
        }
    }
    
    async ExecutaComandoNonQuery(sql, valores = [], connection = null) {
        if (connection) {
            const [result] = await connection.query(sql, valores);
            return result;
        } else {
            const [result] = await this.#conexao.query(sql, valores);
            return result; 
        }
    }

    async ExecutaComandoLastInserted(sql, valores = [], connection = null) {
        if (connection) {
            const [result] = await connection.query(sql, valores);
            return result.insertId;
        } else {
            const [result] = await this.#conexao.query(sql, valores);
            return result.insertId;
        }
    }
}

module.exports = Database;
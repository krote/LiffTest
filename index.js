const express = require('express');
const app = express();
const line = require('@line/bot-sdk');
const { Client } = require('pg');
const PORT = process.env.PORT || 5000;

// Postgresへの接続
const connection = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
connection.connect();

// usersテーブル作成クエリ
const create_query = {
    text: 'CREATE TABLE IF NOT EXISTS users(id SERIAL NOT NULL, line_uid VARCHAR(50), name VARCHAR(20), age SMALLINT);'
};

// CREATE 実行
connection.query(create_query)
    .then(()=>console.log('usersテーブル作成成功'))
    .catch(e=>console.log(e));


express()
    .listen(PORT, ()=>console.log('Listening on ${PORT}'));



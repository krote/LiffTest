const express = require('express');
const { Client } = require('pg');
const line = require('@line/bot-sdk');

//Postgresへの接続
const connection = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
connection.connect();

//usersテーブル作成クエリ
const create_query = {
    text: 'CREATE TABLE IF NOT EXISTS users (id SERIAL NOT NULL, line_uid VARCHAR(50), name VARCHAR(20), age SMALLINT);'
};

//CREATEクエリ実行
connection.query(create_query)
    .then(() => console.log('usersテーブル作成成功！！'))
    .catch(e => console.log(e));

const PORT = process.env.PORT || 5000;

const config = {
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};

console.log(config);
const client = new line.Client(config);

//express
express()
    .use(express.static('public'))
//    .post('/hook', line.middleware(config), (req, res) => lineBot(req, res))
    .use(express.json()) //これが/apiルーティングの前にこないと、ダメ
    .use(express.urlencoded({ extended: true })) //これが/apiルーティングの前にこないと、ダメ
    .post('/api', (req, res) => getUserInfo(req, res))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const lineBot = (req, res) => {
    res.status(200).end();
    const events = req.body.events;
    const promises = [];
    console.log("linebot");
    for (let i = 0; i < events.length; i++) {
        const ev = events[i];
        console.log(ev.type);
        switch (ev.type) {
            case 'follow':
                promises.push(greeting_follow(ev));
                break;
            case 'unfollow':
                console.log('unfollow');
                break;
            case 'message':
                console.log('message');
                break;
        }
    }
    Promise
        .all(promises)
        .then(console.log('all promises passed'))
        .catch(e => console.error(e.stack));
}

//フォローしたら挨拶を返し、更にテーブルへユーザー情報を格納する
const greeting_follow = async (ev) => {
    const profile = await client.getProfile(ev.source.userId);
    const insert_query = {
        text: `INSERT INTO users (line_uid,name,age) VALUES($1,$2,$3);`,
        values: [ev.source.userId, profile.displayName, 33]
    };
    connection.query(insert_query)
        .then(() => {
            return client.replyMessage(ev.replyToken, {
                "type": "text",
                "text": `${profile.displayName}さん、フォローありがとうございます\uDBC0\uDC04`
            });
        })
        .catch(e => console.log(e));
}

const getUserInfo = (req, res) => {
    const data = req.body;
    console.log('id_token:', data.id_token);
}
const mysql = require('mysql')

// 接続先のMySQLサーバ情報
const mysql_host = "<RDSのエンドポイント名>"
const mysql_user = "<ユーザー名>"
const mysql_dbname = "<DB名>"
const mysql_password = "<パスワード>"

let connection = null

function createSingleConnection() {
    connection = mysql.createConnection({
        host     : mysql_host,
        user     : mysql_user,
        password : mysql_password,
        database : mysql_dbname
    })

    connection.on('error', (err) => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            // サーバがコネクションを切った場合は再接続
            createSingleConnection()
            console.log(`Reconnected`)
        } else {
            throw err
        }
    })
}

// MySQLデータベースへの接続 ここで接続することでコネクションを使いまわせる
createSingleConnection()

exports.handler = function(event, context){
    // 実行するSQL文
    var sql ="SELECT * FROM information_schema.PROCESSLIST"

    console.log("MySQL Server Name: " + mysql_host)
    console.log("MySQL User Name: " + mysql_user)
    console.log("MySQL Database Name: " + mysql_dbname)
    console.log("MySQL Exec SQL: " + sql)

    // MySQLデータベースでSQL実行
    connection.query(sql, function(err, rows, fields) {
        if (err) {
            console.log("MySQL Select Error")
            context.fail(err)
            throw err
        } else {
            console.log("MySQL Select Success")
            console.log(rows)
        }
        context.done()
    })

    console.log('end')
}

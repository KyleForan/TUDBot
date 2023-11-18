const sqlite3 = require("sqlite3");
const dbName = './main.db'
let sql

const logErr = (err) => {
    if (err) return console.error(err.message)
}

// * ------------------------
// * Async DataBase Functions
// * ------------------------

const db_all = (query, params) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) return reject(err)
            resolve(rows)
        })
    })
}

const db_run = query => {
    return new Promise((resolve, reject) => {
        db.run(query, err => {
            if (err) return reject(err)
            resolve(true)
        })
    })
}

// * --------------
// * Init Functions
// * --------------

let db = new sqlite3.Database(dbName, sqlite3.OPEN_READWRITE, err => {
    if (err?.code == 'SQLITE_CANTOPEN') {
        return initDatabase()
    } else if (err) {
        return console.error(err.message)
    }
})

const initDatabase = async () => {
    db = new sqlite3.Database(dbName, logErr)

    // * Creates Table
    sql = 'CREATE Table users(id INTEGER PRIMARY KEY, username, balance, daily)'
    await db_run(sql).catch(logErr)

    console.log(`Database ${dbName} was created`)
}

// * ----------------
// * Export Functions
// * ----------------
// TODO: Fix updateBal and updateDaily

module.exports = {
    // * get data from table
    async getData(user) {
        
        sql = 'SELECT * FROM users WHERE id = ?'
        const rows = await db_all(sql, [user.id]).catch(logErr)
    
        if (rows.length == 0) return insertRow(user)
        else data = rows[0]
    
        return data
    
    },
    async updateBal(user, bal) {
        sql = 'UPDATE users SET balance = ? WHERE id = ?'
        await db_run(sql, [bal, user.id]).catch(logErr)
        return [bal, user]
    },
    async updateDaily(user) {
        sql = 'UPDATE users SET daily = ? WHERE id = ?'
        await db_run(sql, [Date.now(), user.id]).catch(logErr)
        return [user, Date.now()]
    }
    
}

// * Insert row into table
const insertRow = user => {
    sql = 'INSERT INTO users(id, username, balance, daily) VALUES (?,?,?,?)'
    const data = [user.id, user.username, '0', null]

    db.run(sql, data, logErr)

    return data
}


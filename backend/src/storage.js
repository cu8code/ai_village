export const readSpecificSenderStat = async (db, sender) => {
    const sql = `select * from stat where (sender='${sender}')`
    const d = await db.all(sql)
    console.log("RUNNING:", sql);
    return d
}

export function updateOrCreateStatEntry(db, food, happy, sender) {
    const sql = `INSERT OR REPLACE INTO stat (food, happy, sender) VALUES (${food}, ${happy}, "${sender}")`
    db.run(
        sql
    );
    console.log("RUNNING:",sql);
}


export const writeToChatDB = (db, sender, receiver, content) => {
    const sql = `insert into chat (sender,receiver,content) values ('${sender}','${receiver}','${content}')`
    db.run(sql)
    console.log("RUNNING:",sql);

}

export const readFormChatDB = async (db, sender, receiver) => {
    const sql = `select * from chat where (sender='${sender}' AND receiver='${receiver}') or (sender='${receiver}' AND receiver='${sender}') order by time asc;`
    console.log("RUNNING:", sql);
    const d = await db.all(sql);
    return d
}



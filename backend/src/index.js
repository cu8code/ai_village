import express from "express";
import Replicate from "replicate";
import { readFormChatDB, readSpecificSenderStat, updateOrCreateStatEntry, writeToChatDB } from "./storage.js";
import { AsyncDatabase } from "promised-sqlite3";
import sqlite3 from "sqlite3";

(async () => {
    let story =""
    const app = express()
    const REPLICATE_API_TOKEN = "r8_XarCoZsjFN8ybPyFFi0QUJwImPYj7ml3sRyRV"
    const replicate = new Replicate({
        auth: REPLICATE_API_TOKEN,
    });

    app.use(express.json())

    const cook = async (sender_name, receiver_name, about_reciver, reciver_food, reciver_happy, history, prompt) => {
        let f = ``
        history.forEach(e => {
            f = `${f}\n${e.sender}: ${atob(e.content)}\n\n\n`
        })

        console.log(new Date());

        const s = `
Do not generate code only give plain text. Do not give extra text strictly follow the pattern provided. This is game, there is 3 things the player can control. food (0-1) happy (0-1) go-to (none | park | jail | school| collage | while house | bar) love (0-1) the higher the number the better. Their is a importatnt relationship between quesiton field and go-to field in the json, when question is a string the go-to file will alawasys be none. Do not talk about food level or happy level in reply. Genreate content as you fell.
here is a story ${story}
The name of the player: "${receiver_name}"
About: ${about_reciver}
food: ${reciver_food}
happy: ${reciver_happy}

Here is history of ${receiver_name} conversion with ${sender_name}.
${f}
${prompt}

Write what will be reply of ${receiver_name} in the format of
\`\`\`json
{
reply: "some string",
food: number,
happy: number,
go-to: "string",
}
\`\`\`
`
        const input = {
            debug: false,
            top_k: 50,
            top_p: 0.9,
            prompt: s,
            temperature: 0.8,
            max_new_tokens: 512,
            min_new_tokens: -1,
            prompt_template: "<s>[INST] {prompt} [/INST] ",
            repetition_penalty: 1.15,
        };

        console.log("LOG:",input)

        return await replicate.run("mistralai/mistral-7b-instruct-v0.2", { input })
    }

    let db
    try {
        db = await AsyncDatabase.open('chat.db', sqlite3.OPEN_READWRITE)
    } catch (e) {
        console.log("LOG: FAILED TO OPEN SO CREATING A NEW DB");
        db = await AsyncDatabase.open('chat.db');
    }

    await db.run(`
            CREATE TABLE IF NOT EXISTS chat (
                sender TEXT NOT NULL,
                receiver TEXT NOT NULL,
                content TEXT NOT NULL,
                time DATETIME DEFAULT (strftime('%s', 'now', 'utc'))
            );`
    )

    await db.run(`
            CREATE TABLE IF NOT EXISTS stat (
                food number NOT NULL,
                happy number NOT NULL,
                sender text NOT NULL
            );`
    )

    // writeToChatDB(db,"ankan","sam","question: how are you bro?")
    // writeToChatDB(db,"sam","ankan","reply: nice")
    // writeToChatDB(db,"ankan","sam","reply: how is your work going on bro?")

    // updateOrCreateStatEntry(db,0.1,0.2,"ankan")
    // updateOrCreateStatEntry(db,0.5,0.6,"sam")

    // console.log(await readFormChatDB(db,"ankan","sam"))
    // console.log(await readSpecificSenderStat(db,"ankan"))



    app.post("/", async (req, res) => {
        console.log("LOG: starting LOG CYCLE ==================================================================================");
        const sender = req.body.sender
        const receiver = req.body.receiver
        const prompt = req.body.prompt
        const about = req.body.about
        const story = req.body.story

        const stat = await readSpecificSenderStat(db, sender)
        const history = await readFormChatDB(db, sender, receiver)
        console.log(history,stat);

        const f = await cook(sender, receiver, about, stat?.food || Math.random(), stat?.happy || Math.random(), history, prompt,story)
        const output = await f.join("")
        const lines = output.split("\n")
        lines.shift(); // Remove the first line
        lines.pop();   // Remove the last line
        const modifiedString = lines.join('\n');
        try {
            const js = JSON.parse(modifiedString)
            console.log("LOG: sending json",js);
            writeToChatDB(db, sender, receiver, `${btoa(js.reply)}`)
            res.send(JSON.stringify(js))
        } catch (e) {
            console.log("ERROR:",output);
        }
        console.log("LOG: end LOG CYCLE ======================================================================================");
        console.log("\n");

    })

    app.get("/",(req,res) => {
        res.send(
            JSON.stringify(
                {
                    "mess": "the network is up"
                }
            )
        )
    })


    app.post("/story",(req,res) => {
        story = req.body.mess
        console.log(story);
        res.send(
            JSON.stringify({
                "mess" : "sucess"
            })
        )
        
    })

    app.listen(8080, async () => {
        console.log(`http://localhost:${8080}`);
    })

})()





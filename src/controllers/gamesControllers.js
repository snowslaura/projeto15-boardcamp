import db from "./../app/db.js"
import joi from "joi"

export async function getGames (req,res){
    try{
        const games = await db.query(`SELECT * FROM games`)
        if(games.rows.length===0){
            res.status(404).send("Ainda não há registros")
            return
        }
        res.send(games.rows)
    }catch(e){
        console.error(e)
    }
}

export async function postGames (req,res){
    const body = req.body
    const gameSchema = joi.object({
        name: joi.string().required(),
        image: joi.string().uri().required(),
        stockTotal: joi.number().min(1).required(),
        categoryId: joi.number().required(),
        pricePerDay: joi.number().min(1).required(),
    })
    const {error} = gameSchema.validate(body)
    if(error){
        console.log(error)
        res.status(403).send("Insira os dados corretamente")
        return
    }
    try{
        const verifyGame = await db.query(`SELECT FROM games WHERE "categoryId"=$1`,[body.categoryId])
        if(verifyGame.rows.length!==0){
            res.status(409).send("Game já existente")
            return
        }
        await db.query(`INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5)`,[body.name,body.image,body.stockTotal,body.categoryId,body.pricePerDay])
        res.sendStatus(201)        
    }catch(e){
        console.error(e)
    }
}
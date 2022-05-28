import db from "./../app/db.js";
import joi from "joi";

export async function getCathegories(req,res){
    try{
        const cathegories = await db.query(`SELECT * FROM categories`)
        if(cathegories.rows.length===0){
            res.status(404).send("Ainda não há registros")
            return
        }
        res.status(200).send(cathegories)
    }catch(e){
        console.log(e)
        res.status(500)
    }
}

export async function postCathegories(req,res){
    const {name} = req.body;
    const cathegorySchema = joi.string().required(); 
    const {error} = cathegorySchema.validate(name)
    if(error){
        res.status(400).send("Digite um nome para a categoria")
        return
    }
    try{
    const verifyCathegory = await db.query(`SELECT FROM categories WHERE "name"=$1`,[name])
    if(verifyCathegory.rows.length!==0){
        res.status(409).send("Categoria já existente");
        return
    }
    await db.query(`INSERT INTO categories (name) VALUES ($1)`,[name]);
    res.sendStatus(201);
    }catch(e){
        console.log(e)
        res.status(500)
    }
}
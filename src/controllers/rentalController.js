import db from "./../app/db.js"
import joi from "joi"

export async function getRentals(req,res){
    const {id, gameId} = req.query
    
    try{
        if(id){
            console.log("teste" , id)
            const rentals = await db.query(`SELECT * FROM rentals WHERE id=$1`,[id]) 
            if(rentals.rows.length===0){
            console.log("teste2" , id)
            res.status(404).send("Usuário não encontrado")
            return
            }
            res.send(rentals.rows)
            return
        }else if(gameId){
            const games = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1`,[gameId])
            if(rentals.rows.length===0){
            res.status(404).send("Jogo não encontrado")
            return   
            }
            res.send(games.rows)
            return
        }else{
            const allRentals = await db.query(`SELECT * FROM rentals`)
            if(allRentals.rows.length===0){
                res.status(404).send("Ainda não há registros de aluguel")
                return
            }
            res.status(200)
        }         
        
    }catch(e){        
        console.log(e)
        res.status(500)
    }
}

export async function postRentals(req,res){ //toFIX: RentalDate format
    const {customerId, gameId, daysRented} = req.body; 

    const rentalSchema = joi.object({
        customerId: joi.number().required(),
        gameId: joi.number().required(),
        daysRented: joi.number().min(1).required()
    })
    const {error} = rentalSchema.validate({customerId, gameId, daysRented})
    if(error){
        res.status(403).send("Insira os dados corretamente")
        return
    }  
        
    try{
        const verifyClient = await db.query(`SELECT * FROM customers WHERE id=$1`,[customerId])
        if(verifyClient.rows.length===0){
            res.status(400).send("Cliente não registrado")
            return
        }
        const verifyGame = await db.query(`SELECT * FROM games WHERE id=$1`,[gameId])
        if(verifyGame.rows.length===0){
            res.status(400).send("Jogo não registrado")
            return
        }
        const verifyGameAvailability = await db.query(`SELECT "stockTotal" FROM games WHERE id=$1`, [gameId])
        if(verifyGameAvailability.rows[0].stockTotal<1){
            res.status(400).send("Não há esse jogo no estoque")
            return
        }
        const rentDate = new Date()
        console.log(rentDate)
        const pricePerDay = await db.query(`SELECT "pricePerDay" FROM games WHERE id=$1`,[gameId])
        const originalPrice = (pricePerDay.rows[0].pricePerDay)*daysRented   
        await db.query(`INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") VALUES ($1,$2,'$3',$4,'$5',$6,$7)`,[customerId, gameId,rentDate, daysRented,null,originalPrice,null])
        
    }catch(e){
        console.error(e)
        res.status(500)        
    }
}

export async function finishRental(req,res){
    const id = parseInt(req.params.id)
    try{
        const verifyRental = await db.query(`SELECT * FROM rentals WHERE id=$1`,[id])        
        if(verifyRental.rows.length===0 || verifyRental.rows[0].returnDate!==null){
            res.status(400).send("Erro")
            return
        }
        const verifyGame = await db.query(
            `SELECT rentals.*,games."pricePerDay" FROM rentals
            JOIN games
            ON rentals."gameId" = games.id`).rows[0];
        const returnDate = new Date();
        const realReturnDate = (verifyGame.rentDate)+(verifyGame.daysRented);
        const delayDays = (realReturnDate)-(returnDate);
        const delayFee = delayDays*(verifyGame.pricePerDay);
        await db.query(`INSERT INTO rental ("returnDate","delayFee") VALUES ($1,$2)  WHERE id=$3`,[returnDate,delayFee,id])
        res.sendStatus(200)    
    }catch(e){
        console.error(e)
        res.sendStatus(500)
    }

}

export async function deleteRental(req,res){
    const {id} = req.body    
    try{
        const verifyRental = await db.query(`SELECT * FROM rental WHERE id=$1`,[id])
        if(verifyRental.rows.length===0 || verifyRental.rows[0].returnDate!==null ){
            res.status(400).send("Aluguel já finalizado ou inexistente")
            return
        }

        await db.query(`DELETE * FROM rentals WHERE id=$1`,[id])
        res.sendStatus(200)
    }catch(e){
        console.error(e)
        res.sendStatus(500)
    }
}
const sharp = require('sharp')
const path = require('path')
const fs = require ('fs/promises')

const pool = require('../config/db')

exports.updateParkImage = async (req, res) => {
    try{
        const { id } = req.params

        if(!req.file){
            return res.status(400).json({message: 'Image not found'})
        }

        const park = await pool.query(
            'SELECT id, img FROM parks WHERE id = $1',
            [id]
        )
        
    } catch(err){
        console.error(err)
        res.status(500).json({ message: 'Error while modifying the image'})
    }
}
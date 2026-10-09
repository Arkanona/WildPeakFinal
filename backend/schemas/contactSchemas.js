'use strict'

const { z } = require('zod')

const sendMessageSchema = z.object({
    firstname: z
        .string()
        .trim()
        .min(2, {error: 'Le prénom doit contenir au moins 2 caractères'})
        .max(50, {error: 'Le prénom ne peut pas dépasser 50 caractères'}),

    lastname: z
        .string()
        .trim()
        .min(2, {error: 'Le nom doit contenir au moins 2 caractères'})
        .max(50, {error: 'Le nom ne peut pas dépasser 50 caractères'}),

    email: z
        .email({error: 'Adresse email invalide'})
        .trim()
        .toLowerCase(),

    message: z
        .string()
        .min(10, {error: 'Le message doit contenir au moins 10 caractères'})
        .max(500, {error: 'Le message ne peut pas dépasser 500 caractères'})
}).strict()

module.exports = { sendMessageSchema }
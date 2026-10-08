// Active le mode strict de JS pour détecter les erreurs courrantes et interdire les syntaxes non sécurisés
'use strict'

const { z } = require('zod')

const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, {error: 'Le nom doit contenir au moins 2 caractères'})
        .max(50, {error: 'Le nom ne peut pas dépasser 50 caractères'}),

    email: z
        .email({error: 'Adresse email invalide'})
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(7, {error: 'Le mot de passe doit contenir au moins 7 caractères'})
        .regex(/[A-Z]/, {error: 'Le mot de passe doit contenir une majuscule'})
        .regex(/[0-9]/, {error: 'Le mot de passe doit contenir un chiffre'})
        .regex(/[^a-zA-Z0-9]/, {error: 'Le mot de passe doit contenir un caractère spécial'})
}).strict() // Interdit tout champs supplémentaire non défini dans l'objet pour éviter le mass assignement

const loginSchema = z.object({
    email: z
        .email({error: 'Adresse email invalide'})
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(7, {error: 'Le mot de passe doit contenir au moins 7 caractères'})
        .regex(/[A-Z]/, {error: 'Le mot de passe doit contenir une majuscule'})
        .regex(/[0-9]/, {error: 'Le mot de passe doit contenir un chiffre'})
        .regex(/[^a-zA-Z0-9]/, {error: 'Le mot de passe doit contenir un caractère spécial'})
}).strict()

/* 
                    null        undefined/absent
.nullable()         Oui         Non
.optional()         Non         Oui
.nullish()          Oui         Oui
*/


module.exports = { registerSchema, loginSchema }
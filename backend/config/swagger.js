
const ref = (name) => ({
    $ref: `#/components/schemas/${name}`
})

const jsonResponse = (description, schema, example) => ({
    description,
    content: {
        'application/json': {
            schema: typeof schema === 'string'
                ? ref(schema)
                : schema,
            ...(example === undefined ? {} : { example })
        }
    }
})

const response = (description) => ({ description })

const requestBody = (
    schemaName,
    mediaType = 'application/json'
) => ({
    required: true,
    content: {
        [mediaType]: {
            schema: ref(schemaName)
        }
    }
})

const bearerAuth = [{ bearerAuth: [] }]

const swaggerDocument = {
    openapi: '3.0.3',

    info: {
        title: 'WildPeak API',
        version: '1.0.0',
        description: "Documentation de l'API REST WildPeak : authentification, parcs, attractions, favoris et administration."
    },

    servers: [
        {
            url: 'http://localhost:3000/api/v1',
            description: 'Développement local'
        },
        {
            url: 'https://wildpeak-api.onrender.com/api/v1',
            description: 'Production'
        }
    ],

    tags: [
        {
            name: 'Authentification',
            description: 'Inscription, connexion et mots de passe'
        },
        {
            name: 'Parcs',
            description: 'Consultation des parcs'
        },
        {
            name: 'Attractions',
            description: 'Consultation des attractions'
        },
        {
            name: 'Profil',
            description: 'Favoris et suppression du compte'
        },
        {
            name: 'Administration',
            description: 'Gestion des parcs et attractions'
        }
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },

        schemas: {

            // ====================================
            // UTILISATEUR
            // ====================================

            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        example: 1
                    },
                    name: {
                        type: 'string',
                        example: 'Utilisateur Test'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'test@example.com'
                    },
                    role: {
                        type: 'string',
                        example: 'user'
                    }
                }
            },

            AuthResponse: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string'
                    },
                    status: {
                        type: 'integer'
                    },
                    token: {
                        type: 'string',
                        description: 'Token JWT valide pendant 30 jours'
                    },
                    user: ref('User')
                }
            },

            // ====================================
            // REQUETES AUTHENTIFICATION
            // ====================================

            RegisterRequest: {
                type: 'object',
                additionalProperties: false,
                required: ['name', 'email', 'password'],

                properties: {
                    name: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 50,
                        example: 'Utilisateur Test'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'test@example.com'
                    },
                    password: {
                        type: 'string',
                        format: 'password',
                        minLength: 7,
                        description: 'Au moins 7 caractères, une majuscule, un chiffre et un caractère spécial.',
                        example: 'Exemple123!'
                    }
                }
            },

            LoginRequest: {
                type: 'object',
                additionalProperties: false,
                required: ['email', 'password'],

                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'test@example.com'
                    },
                    password: {
                        type: 'string',
                        format: 'password',
                        minLength: 7,
                        description: 'Au moins 7 caractères, une majuscule, un chiffre et un caractère spécial.',
                        example: 'Exemple123!'
                    }
                }
            },

            ForgotPasswordRequest: {
                type: 'object',
                additionalProperties: false,
                required: ['email'],

                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'test@example.com'
                    }
                }
            },

            ResetPasswordRequest: {
                type: 'object',
                required: ['password'],

                properties: {
                    password: {
                        type: 'string',
                        format: 'password',
                        minLength: 7,
                        description: 'Au moins 7 caractères, une majuscule, un chiffre et un caractère spécial.',
                        example: 'Nouveau123!'
                    }
                }
            },

            // ====================================
            // PARCS
            // ====================================

            Park: {
                type: 'object',
                additionalProperties: true,

                properties: {
                    id_park: {
                        type: 'integer',
                        example: 1
                    },
                    name_park: {
                        type: 'string',
                        example: 'Disneyland Paris'
                    },
                    slug_park: {
                        type: 'string',
                        example: 'disneyland-paris'
                    },
                    country_park: {
                        type: 'string',
                        example: 'France'
                    },
                    place_park: {
                        type: 'string',
                        example: 'Chessy'
                    },
                    opening_year_park: {
                        type: 'integer',
                        nullable: true,
                        example: 1992
                    },
                    description_park: {
                        type: 'string',
                        nullable: true
                    },
                    img_park: {
                        type: 'string',
                        nullable: true,
                        description: 'URL image carte'
                    },
                    imgbg_park: {
                        type: 'string',
                        nullable: true,
                        description: 'URL image de fond'
                    }
                }
            },

            ParkRequest: {
                type: 'object',
                required: ['name_park'],

                properties: {
                    name_park: {
                        type: 'string',
                        minLength: 1,
                        example: 'Disneyland Paris',
                        description: 'Nom obligatoire, ne pouvant pas contenir uniquement des espaces.'
                    },
                    country_park: {
                        type: 'string',
                        example: 'France'
                    },
                    place_park: {
                        type: 'string',
                        example: 'Chessy'
                    },
                    opening_year_park: {
                        type: 'integer',
                        nullable: true,
                        example: 1992
                    },
                    description_park: {
                        type: 'string',
                        example: 'Description du parc'
                    },
                    image: {
                        type: 'string',
                        format: 'binary',
                        description: 'Image facultative'
                    }
                }
            },

            ParkResponse: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string'
                    },
                    status: {
                        type: 'integer'
                    },
                    park: ref('Park')
                }
            },

            // ====================================
            // ATTRACTIONS
            // ====================================

            Attraction: {
                type: 'object',
                additionalProperties: true,

                properties: {
                    id_attraction: {
                        type: 'integer',
                        example: 1
                    },
                    name_attraction: {
                        type: 'string',
                        example: 'Blue Fire Megacoaster'
                    },
                    slug_attraction: {
                        type: 'string',
                        example: 'blue-fire-megacoaster'
                    },
                    id_park: {
                        type: 'integer',
                        example: 1
                    },
                    type_attraction: {
                        type: 'string',
                        example: 'Montagnes russes'
                    },
                    alt_attraction: {
                        type: 'string',
                        example: "Vue de l'attraction Blue Fire Megacoaster à Europa-Park"
                    },
                    speed_max_kmh_attraction: {
                        type: 'number',
                        nullable: true,
                        example: 100
                    },
                    height_m_attraction: {
                        type: 'number',
                        nullable: true,
                        example: 38
                    },
                    length_m_attraction: {
                        type: 'number',
                        nullable: true,
                        example: 1056
                    },
                    duration_min_attraction: {
                        type: 'number',
                        nullable: true,
                        example: 2.5
                    },
                    inversion_attraction: {
                        type: 'integer',
                        nullable: true,
                        example: 4
                    },
                    minimum_height_cm_attraction: {
                        type: 'integer',
                        nullable: true,
                        example: 130
                    },
                    opening_year_attraction: {
                        type: 'integer',
                        nullable: true,
                        example: 2009
                    },
                    description_attraction: {
                        type: 'string',
                        nullable: true
                    },
                    parc_zone_attraction: {
                        type: 'string',
                        nullable: true,
                        example: 'Islande'
                    },
                    intensity_level_attraction: {
                        type: 'string',
                        nullable: true,
                        example: 'Forte'
                    },
                    family_friendly_attraction: {
                        type: 'boolean',
                        example: false
                    },
                    short_description_attraction: {
                        type: 'string',
                        nullable: true
                    },
                    img_attraction: {
                        type: 'string',
                        nullable: true,
                        description: 'URL image carte'
                    },
                    imgbg_attraction: {
                        type: 'string',
                        nullable: true,
                        description: 'URL image de fond'
                    }
                }
            },

            AttractionRequest: {
                type: 'object',
                required: [
                    'name_attraction',
                    'id_park'
                ],

                properties: {
                    name_attraction: {
                        type: 'string',
                        minLength: 1,
                        example: 'Blue Fire Megacoaster'
                    },
                    id_park: {
                        type: 'integer',
                        example: 1,
                        description: "Identifiant d'un parc existant"
                    },
                    type_attraction: {
                        type: 'string',
                        example: 'Montagnes russes'
                    },
                    speed_max_kmh_attraction: {
                        type: 'number',
                        example: 100
                    },
                    height_m_attraction: {
                        type: 'number',
                        example: 38
                    },
                    length_m_attraction: {
                        type: 'number',
                        example: 1056
                    },
                    duration_min_attraction: {
                        type: 'number',
                        example: 2.5
                    },
                    inversion_attraction: {
                        type: 'integer',
                        example: 4
                    },
                    minimum_height_cm_attraction: {
                        type: 'integer',
                        example: 130
                    },
                    opening_year_attraction: {
                        type: 'integer',
                        example: 2009
                    },
                    description_attraction: {
                        type: 'string',
                        example: 'Description complète'
                    },
                    parc_zone_attraction: {
                        type: 'string',
                        example: 'Islande'
                    },
                    intensity_level_attraction: {
                        type: 'string',
                        example: 'Forte'
                    },
                    family_friendly_attraction: {
                        type: 'string',
                        enum: ['true', 'false'],
                        example: 'false',
                        description: "Envoyer la chaîne 'true' ou 'false'."
                    },
                    short_description_attraction: {
                        type: 'string',
                        example: 'Attraction à sensations fortes'
                    },
                    image: {
                        type: 'string',
                        format: 'binary',
                        description: 'Image facultative'
                    }
                }
            },

            AttractionResponse: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string'
                    },
                    status: {
                        type: 'integer'
                    },
                    attraction: ref('Attraction')
                }
            },

            // ====================================
            // FAVORIS
            // ====================================

            FavoriteRecord: {
                type: 'object',
                nullable: true,
                additionalProperties: true,

                description: "Enregistrement des favoris. Peut être null si aucun changement n'a été effectué.",

                properties: {
                    id_favorite: {
                        type: 'integer',
                        example: 1
                    },
                    id_user: {
                        type: 'integer',
                        example: 1
                    },
                    id_attraction: {
                        type: 'integer',
                        example: 5
                    }
                }
            },

            FavoriteResponse: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string'
                    },
                    status: {
                        type: 'integer'
                    },
                    favorite: ref('FavoriteRecord')
                }
            },

            // ====================================
            // SUPPRESSION DE COMPTE
            // ====================================

            DeleteAccountRequest: {
                type: 'object',
                required: ['password'],

                properties: {
                    password: {
                        type: 'string',
                        format: 'password',
                        example: 'Exemple123!',
                        description: 'Mot de passe actuel'
                    }
                }
            },

            // ====================================
            // REPONSES GENERALES
            // ====================================

            MessageResponse: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string'
                    },
                    status: {
                        type: 'integer'
                    }
                }
            },

            ErrorResponse: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string'
                    },
                    status: {
                        type: 'integer'
                    },
                    detail: {
                        type: 'string'
                    },
                    message: {
                        type: 'string'
                    },
                    error: {
                        type: 'string'
                    }
                }
            }
        }
    },

    paths: {

        // ====================================
        // AUTHENTIFICATION
        // ====================================

        '/auth/register': {
            post: {
                tags: ['Authentification'],
                summary: 'Créer un compte',
                description: 'Créer un utilisateur et renvoyer un JWT valable 30 jours.',

                requestBody: requestBody('RegisterRequest'),

                responses: {
                    201: jsonResponse(
                        'Compte créé',
                        'AuthResponse',
                        {
                            title: 'Utilisateur enregistré avec succès',
                            status: 201,
                            token: 'jwt-exemple',
                            user: {
                                id: 1,
                                name: 'Utilisateur Test',
                                email: 'test@example.com',
                                role: 'user'
                            }
                        }
                    ),

                    409: jsonResponse(
                        'Adresse e-mail déjà utilisée',
                        'ErrorResponse',
                        {
                            title: 'Vous ne pouvez pas vous inscrire avec ce mail',
                            status: 409,
                            detail: 'Ce mail ne peut pas être utilisé'
                        }
                    ),

                    500: jsonResponse(
                        "Erreur serveur pendant l'inscription",
                        'ErrorResponse'
                    )
                }
            }
        },

        '/auth/login': {
            post: {
                tags: ['Authentification'],
                summary: 'Se connecter',
                description: 'Vérifier les identifiants et renvoyer un JWT.',

                requestBody: requestBody('LoginRequest'),

                responses: {
                    200: jsonResponse(
                        'Connexion réussie',
                        'AuthResponse',
                        {
                            title: 'Utilisateur connecter avec succès',
                            status: 200,
                            token: 'jwt-exemple',
                            user: {
                                id: 1,
                                name: 'Utilisateur Test',
                                email: 'test@example.com',
                                role: 'user'
                            }
                        }
                    ),

                    401: jsonResponse(
                        'Identifiants incorrects',
                        'ErrorResponse',
                        {
                            title: 'Identifiant incorrect',
                            status: 401,
                            detail: 'Les identifiants ne sont pas correctes'
                        }
                    ),

                    500: jsonResponse(
                        'Erreur serveur pendant la connexion',
                        'ErrorResponse'
                    )
                }
            }
        },

        '/auth/forgot-password': {
            post: {
                tags: ['Authentification'],
                summary: 'Demander une réinitialisation de mot de passe',

                description: 'Répond sans révéler si le compte existe. Le lien envoyé expire après 15 minutes.',

                requestBody: requestBody('ForgotPasswordRequest'),

                responses: {
                    200: jsonResponse(
                        'Demande traitée',
                        'MessageResponse',
                        {
                            title: 'Si un compte existe avec cette adresse, un lien de réinitialisation a été envoyé.',
                            status: 200
                        }
                    ),

                    400: jsonResponse(
                        'Adresse e-mail obligatoire',
                        'ErrorResponse',
                        {
                            title: "L'adresse e-mail est obligatoire.",
                            status: 400
                        }
                    ),

                    500: jsonResponse(
                        'Erreur serveur lors de la demande',
                        'ErrorResponse'
                    )
                }
            }
        },

        '/auth/reset-password/{token}': {
            post: {
                tags: ['Authentification'],
                summary: 'Réinitialiser le mot de passe',

                parameters: [
                    {
                        name: 'token',
                        in: 'path',
                        required: true,
                        description: 'Token reçu par e-mail, valable 15 minutes',
                        schema: {
                            type: 'string'
                        }
                    }
                ],

                requestBody: requestBody('ResetPasswordRequest'),

                responses: {
                    200: jsonResponse(
                        'Mot de passe modifié',
                        'MessageResponse',
                        {
                            title: 'Votre mot de passe a bien été réinitialisé.',
                            status: 200
                        }
                    ),

                    400: jsonResponse(
                        'Lien invalide ou expiré',
                        'ErrorResponse',
                        {
                            title: 'Le lien de réinitialisation est invalide ou expiré.',
                            status: 400
                        }
                    ),

                    500: jsonResponse(
                        'Erreur serveur lors de la réinitialisation',
                        'ErrorResponse'
                    )
                }
            }
        },

        // ====================================
        // PARCS - CONSULTATION
        // ====================================

        '/parcs': {
            get: {
                tags: ['Parcs'],
                summary: 'Lister tous les parcs',
                description: 'Retourne les parcs triés par id_park croissant.',

                responses: {
                    200: jsonResponse(
                        'Liste des parcs',
                        {
                            type: 'array',
                            items: ref('Park')
                        }
                    ),

                    500: jsonResponse(
                        'Erreur de récupération des parcs',
                        'ErrorResponse',
                        {
                            title: 'Erreur lors de la récupération des parcs',
                            status: 500
                        }
                    )
                }
            }
        },

        // ====================================
        // ATTRACTIONS - CONSULTATION
        // ====================================

        '/attractions': {
            get: {
                tags: ['Attractions'],
                summary: 'Lister toutes les attractions',
                description: 'Retourne les attractions triées par id_attraction croissant.',

                responses: {
                    200: jsonResponse(
                        'Liste des attractions',
                        {
                            type: 'array',
                            items: ref('Attraction')
                        }
                    ),

                    500: jsonResponse(
                        'Erreur de récupération des attractions',
                        'ErrorResponse',
                        {
                            title: "Erreur de récupération de l'attraction",
                            status: 500
                        }
                    )
                }
            }
        },

        // ====================================
        // ADMINISTRATION - PARCS
        // ====================================

        '/admin-wild/parcs': {
            post: {
                tags: ['Administration'],
                summary: 'Ajouter un parc',

                description: 'Accès administrateur. Le slug est généré automatiquement depuis le nom du parc.',

                security: bearerAuth,

                requestBody: requestBody(
                    'ParkRequest',
                    'multipart/form-data'
                ),

                responses: {
                    201: jsonResponse(
                        'Parc ajouté',
                        'ParkResponse',
                        {
                            title: 'Parc ajouté avec succès',
                            status: 201,
                            park: {
                                id_park: 1,
                                name_park: 'Disneyland Paris',
                                slug_park: 'disneyland-paris'
                            }
                        }
                    ),

                    400: jsonResponse(
                        'Nom du parc obligatoire',
                        'ErrorResponse',
                        {
                            title: 'Le nom du parc est obligatoire',
                            status: 400
                        }
                    ),

                    401: response('Authentification requise'),

                    403: response('Droits administrateur requis'),

                    500: jsonResponse(
                        "Erreur lors de l'ajout du parc",
                        'ErrorResponse'
                    )
                }
            }
        },

        '/admin-wild/parcs/{id}': {
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'Identifiant du parc',

                    schema: {
                        type: 'integer',
                        example: 1
                    }
                }
            ],

            patch: {
                tags: ['Administration'],
                summary: 'Modifier un parc',

                description: 'Modifier un parc existant. Le nom reste obligatoire et une image peut être envoyée.',

                security: bearerAuth,

                requestBody: requestBody(
                    'ParkRequest',
                    'multipart/form-data'
                ),

                responses: {
                    200: jsonResponse(
                        'Parc modifié',
                        'ParkResponse',
                        {
                            title: 'Parc modifié avec succès',
                            status: 200,
                            park: {
                                id_park: 1,
                                name_park: 'Disneyland Paris',
                                slug_park: 'disneyland-paris'
                            }
                        }
                    ),

                    400: jsonResponse(
                        'Nom du parc obligatoire',
                        'ErrorResponse',
                        {
                            title: 'Le nom du parc est obligatoire',
                            status: 400
                        }
                    ),

                    401: response('Authentification requise'),

                    403: response('Droits administrateur requis'),

                    404: jsonResponse(
                        'Parc introuvable',
                        'ErrorResponse',
                        {
                            title: 'Parc introuvable',
                            status: 404
                        }
                    ),

                    500: jsonResponse(
                        'Erreur lors de la modification du parc',
                        'ErrorResponse'
                    )
                }
            },

            delete: {
                tags: ['Administration'],
                summary: 'Supprimer un parc',

                description: 'Supprimer un parc et ses images. Suppression refusée si le parc contient encore des attractions.',

                security: bearerAuth,

                responses: {
                    200: jsonResponse(
                        'Parc supprimé',
                        'ParkResponse',
                        {
                            title: 'Parc supprimé avec succès',
                            status: 200,
                            park: {
                                id_park: 1,
                                name_park: 'Disneyland Paris'
                            }
                        }
                    ),

                    401: response('Authentification requise'),

                    403: response('Droits administrateur requis'),

                    404: jsonResponse(
                        'Parc introuvable',
                        'ErrorResponse',
                        {
                            title: 'Parc introuvable',
                            status: 404
                        }
                    ),

                    409: jsonResponse(
                        'Parc contenant encore des attractions',
                        'ErrorResponse',
                        {
                            title: 'Impossible de supprimer ce parc',
                            message: 'Ce parc contient encore des attractions.',
                            status: 409
                        }
                    ),

                    500: jsonResponse(
                        'Erreur lors de la suppression du parc',
                        'ErrorResponse'
                    )
                }
            }
        },

        // ====================================
        // ADMINISTRATION - ATTRACTIONS
        // ====================================

        '/admin-wild/attractions': {
            post: {
                tags: ['Administration'],
                summary: 'Ajouter une attraction',

                description: 'Créer une attraction associée à un parc. Accès administrateur. Image facultative.',

                security: bearerAuth,

                requestBody: requestBody(
                    'AttractionRequest',
                    'multipart/form-data'
                ),

                responses: {
                    201: jsonResponse(
                        'Attraction ajoutée',
                        'AttractionResponse',
                        {
                            title: 'Attraction ajoutée avec succès',
                            status: 201,
                            attraction: {
                                id_attraction: 1,
                                name_attraction: 'Blue Fire Megacoaster',
                                id_park: 1
                            }
                        }
                    ),

                    401: response('Authentification requise'),

                    403: response('Droits administrateur requis'),

                    500: jsonResponse(
                        "Erreur lors de l'ajout de l'attraction",
                        'ErrorResponse',
                        {
                            title: "Erreur lors de l'ajout de l'attraction",
                            status: 500
                        }
                    )
                }
            }
        },

        '/admin-wild/attractions/{id}': {
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: "Identifiant de l'attraction",

                    schema: {
                        type: 'integer',
                        example: 1
                    }
                }
            ],

            patch: {
                tags: ['Administration'],
                summary: 'Modifier une attraction',

                description: "Modifier une attraction existante et éventuellement remplacer son image. Le nom et le parc restent nécessaires dans le controller actuel.",

                security: bearerAuth,

                requestBody: requestBody(
                    'AttractionRequest',
                    'multipart/form-data'
                ),

                responses: {
                    200: jsonResponse(
                        'Attraction modifiée',
                        'AttractionResponse',
                        {
                            title: 'Attraction modifiée avec succès',
                            status: 200,
                            attraction: {
                                id_attraction: 1,
                                name_attraction: 'Blue Fire Megacoaster',
                                id_park: 1
                            }
                        }
                    ),

                    401: response('Authentification requise'),

                    403: response('Droits administrateur requis'),

                    404: jsonResponse(
                        'Attraction introuvable',
                        'ErrorResponse',
                        {
                            title: 'Attraction introuvable',
                            status: 404
                        }
                    ),

                    500: jsonResponse(
                        "Erreur lors de la modification de l'attraction",
                        'ErrorResponse',
                        {
                            title: "Erreur lors de la modification de l'attraction",
                            status: 500
                        }
                    )
                }
            },

            delete: {
                tags: ['Administration'],
                summary: 'Supprimer une attraction',

                description: "Supprimer une attraction de la base de données à partir de son identifiant.",

                security: bearerAuth,

                responses: {
                    200: jsonResponse(
                        'Attraction supprimée',
                        'AttractionResponse',
                        {
                            title: 'Attraction supprimée',
                            status: 200,
                            attraction: {
                                id_attraction: 1,
                                name_attraction: 'Blue Fire Megacoaster'
                            }
                        }
                    ),

                    401: response('Authentification requise'),

                    403: response('Droits administrateur requis'),

                    404: jsonResponse(
                        'Attraction introuvable',
                        'ErrorResponse',
                        {
                            title: 'Attraction introuvable',
                            status: 404
                        }
                    ),

                    500: jsonResponse(
                        "Erreur lors de la suppression de l'attraction",
                        'ErrorResponse',
                        {
                            title: 'Erreur lors de la suppression',
                            status: 500
                        }
                    )
                }
            }
        },

        // ====================================
        // PROFIL ET FAVORIS
        // ====================================

        '/profile': {
            get: {
                tags: ['Profil'],
                summary: 'Récupérer mes favoris',

                description: "Retourne les attractions favorites de l'utilisateur connecté, triées de la plus récente à la plus ancienne.",

                security: bearerAuth,

                responses: {
                    200: jsonResponse(
                        'Liste des attractions favorites',
                        {
                            type: 'array',
                            items: ref('Attraction')
                        }
                    ),

                    401: response('Authentification requise'),

                    500: jsonResponse(
                        'Erreur lors de la récupération des favoris',
                        'ErrorResponse',
                        {
                            title: 'Erreur lors de la récupération des favoris',
                            status: 500
                        }
                    )
                }
            }
        },

        '/profile/{idAttraction}': {
            parameters: [
                {
                    name: 'idAttraction',
                    in: 'path',
                    required: true,
                    description: "Identifiant de l'attraction",

                    schema: {
                        type: 'integer',
                        example: 5
                    }
                }
            ],

            post: {
                tags: ['Profil'],
                summary: 'Ajouter aux favoris',

                description: "Ajouter une attraction aux favoris. Si elle existe déjà dans les favoris, aucun doublon n'est créé et favorite vaut null.",

                security: bearerAuth,

                responses: {
                    201: jsonResponse(
                        "Demande d'ajout traitée",
                        'FavoriteResponse',
                        {
                            title: 'Attraction ajoutée aux favoris',
                            status: 201,
                            favorite: {
                                id_favorite: 1,
                                id_user: 1,
                                id_attraction: 5
                            }
                        }
                    ),

                    401: response('Authentification requise'),

                    500: jsonResponse(
                        "Erreur lors de l'ajout aux favoris",
                        'ErrorResponse',
                        {
                            title: "Erreur lors de l'ajout aux favoris",
                            status: 500
                        }
                    )
                }
            },

            delete: {
                tags: ['Profil'],
                summary: 'Retirer des favoris',

                description: "Supprimer une attraction des favoris. Si le favori n'existait pas, favorite vaut null.",

                security: bearerAuth,

                responses: {
                    200: jsonResponse(
                        'Demande de suppression traitée',
                        'FavoriteResponse',
                        {
                            title: 'Attraction supprimée des favoris',
                            status: 200,
                            favorite: {
                                id_favorite: 1,
                                id_user: 1,
                                id_attraction: 5
                            }
                        }
                    ),

                    401: response('Authentification requise'),

                    500: jsonResponse(
                        'Erreur lors de la suppression du favori',
                        'ErrorResponse',
                        {
                            title: 'Erreur lors de la suppression du favori',
                            status: 500
                        }
                    )
                }
            }
        },

        // ====================================
        // SUPPRESSION DE COMPTE
        // ====================================

        '/profile/account': {
            delete: {
                tags: ['Profil'],
                summary: 'Supprimer définitivement mon compte',

                description: "Vérifier le mot de passe actuel, supprimer les favoris puis supprimer le compte utilisateur.",

                security: bearerAuth,

                requestBody: requestBody('DeleteAccountRequest'),

                responses: {
                    200: jsonResponse(
                        'Compte supprimé',
                        'MessageResponse',
                        {
                            title: 'Votre compte a été supprimé avec succès',
                            status: 200
                        }
                    ),

                    400: jsonResponse(
                        'Mot de passe obligatoire',
                        'ErrorResponse',
                        {
                            title: 'Mot de passe obligatoire'
                        }
                    ),

                    401: jsonResponse(
                        'Utilisateur non authentifié',
                        'ErrorResponse',
                        {
                            title: 'Utilisateur non authentifié'
                        }
                    ),

                    403: jsonResponse(
                        'Mot de passe incorrect',
                        'ErrorResponse',
                        {
                            title: 'Mot de passe incorrect'
                        }
                    ),

                    404: jsonResponse(
                        'Compte introuvable',
                        'ErrorResponse',
                        {
                            title: 'Compte introuvable'
                        }
                    ),

                    500: jsonResponse(
                        'Erreur lors de la suppression du compte',
                        'ErrorResponse',
                        {
                            title: 'Erreur lors de la suppression du compte',
                            status: 500
                        }
                    )
                }
            }
        }
    }
}

module.exports = swaggerDocument

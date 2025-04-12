import Mongoose from 'mongoose'
// import MongooseFieldEncryption from 'mongoose-field-encryption'
// import * as crypto from 'crypto'
// import { SchemaUtils } from './utils/schema.utils'

require('dotenv').config()

interface IUserModel extends Mongoose.Document {
}

// const summaryInfoSpecies: any = {
//     total: Number,
//     male: Number,
//     female: Number,
//     neutered: Number,
//     not_neutered: Number,
//     female_neutered: Number,
//     female_not_neutered: Number,
//     male_neutered: Number,
//     male_not_neutered: Number
// }

const userSchema = new Mongoose.Schema(
    {
        // Parameters for all users.
        name: String,
        contact_personal: String,
        last_login: Date,
        type: String,
        password_reset_token: String,

        // employee params
        role: String,
        avaliable: Boolean,
        responsible_admin: Mongoose.Schema.Types.ObjectId,

        // Login parameters
        email: String,
        password: String,

        // Admin parameters
        protected: { type: Boolean, default: false },

        // is active
        active: { type: Boolean, default: true },

        // is authorized
        is_authorized: { type: Boolean, default: false },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id
                delete ret._id
                delete ret.__v
                return ret
            }
        }
    })

// const secretKey = process.env.ENCRYPT_SECRET_KEY
// const encryptFields = ['cpf']

// function saltGenerator() {
//     return process.env.SALT_GENERATOR_VALUE
// }

// userSchema.plugin(MongooseFieldEncryption.fieldEncryption, {
//     fields: encryptFields,
//     secret: secretKey,
//     saltGenerator
// })

// userSchema.pre(['find', 'findOne'], function (_next) {
//     const next = getNext(_next)

//     try {
//         const hash = crypto.createHash('sha256').update(`${process.env.ENCRYPT_SECRET_KEY}`).digest('hex').substring(0, 32)
//         const filter = this.getFilter()
//         if (filter) {
//             for (const field of Object.keys(filter)) {
//                 if (field === '$and' || field === '$or') {
//                     filter[field] = filter[field]?.map(fieldItem => {
//                         for (const fieldItemKey of Object.keys(fieldItem)) {
//                             if (encryptFields.indexOf(fieldItemKey) > -1 && fieldItem[fieldItemKey]) {
//                                 fieldItem[fieldItemKey] =
//                                     MongooseFieldEncryption.encrypt(String(fieldItem[fieldItemKey]), hash, saltGenerator)
//                             }
//                         }
//                         return fieldItem
//                     })
//                 } else if (encryptFields.indexOf(field) > -1 && filter[field]) {
//                     filter[field] = MongooseFieldEncryption.encrypt(String(filter[field]), hash, saltGenerator)
//                 }
//             }
//         }
//         next()
//     } catch (err) {
//         next(err)
//     }
// })

// userSchema.pre('findOneAndUpdate', function (_next) {
//     const next = getNext(_next)
//     try {
//         const updateParams = this.getUpdate()

//         const municipalitiesKey = 'municipalities'

//         if (updateParams) {
//             if (updateParams.hasOwnProperty(municipalitiesKey)) {
//                 // Building municipalitiesKey object parameters.
//                 const nestedParameters = SchemaUtils.buildNestedParameters({ municipalities: updateParams[municipalitiesKey] })
//                 for (const key of Object.keys(nestedParameters)) {
//                     updateParams[key] = nestedParameters[key]
//                 }
//                 delete updateParams[municipalitiesKey]
//             }

//             // Building $unset parameter to remove optional fields.
//             for (const key of Object.keys(updateParams)) {
//                 if (updateParams[key] === '') {
//                     const unsetKey = '$unset'
//                     if (!updateParams[unsetKey]) updateParams[unsetKey] = {}
//                     updateParams[unsetKey][key] = 1
//                     delete updateParams[key]
//                 }
//             }
//         }
//         next()
//     } catch (err) {
//         next(err)
//     }
// })

// For mongoose 4/5 compatibility.
// function nextErr(err) {
//     if (err) throw err
// }

// function getNext(next) {
//     if (typeof next !== 'function') return nextErr
//     return next
// }

export const UserRepoModel = Mongoose.model<IUserModel>('User', userSchema)

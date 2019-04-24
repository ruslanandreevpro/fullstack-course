const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function (req, res) {

    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        // Пользователь существует
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)

        if (passwordResult) {
            // Пароли совпали, генерируем токен
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60})
            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            // Пароль не верный
            res.status(401).json({
                message: 'Пароль неверный'
            })
        }
    } else {
        // Пользователя нет
        res.status(404).json({
            message: 'Такого пользователя не существует'
        })
    }
}

module.exports.register = async function (req, res) {

    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        // Пользователь существует, нужно выдать ошибку
        res.status(409).json({
            message: 'Такой пользователь уже существует.'
        })
    } else {
        // Возможно создание нового пользователя
        const salt = bcrypt.genSaltSync(16)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        try {
            await user.save()
            res.status(201).json({user})
        } catch(e) {
            // Обработка ошибки
            errorHandler(res, e)
        }
    }
}
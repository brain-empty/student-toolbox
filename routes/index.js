const express = require ('express')
const router = express.Router()

router.get('/', (req,res) => {
    res.render('index')
})

router.get('/courseyard', (req,res) => {
    res.render('features/courseyard/courseyard')
})

router.get('/dictionary', (req,res) => {
    res.render('features/dictionary')
})

module.exports = router
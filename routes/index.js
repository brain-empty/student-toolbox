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

router.get ('/timer', (req,res) => {
    res.render('features/timer')
})

module.exports = router
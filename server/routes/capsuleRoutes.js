const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {requestPair, confirmPair} = require('../controllers/userController')
const {createCapsule, deleteCapsule, getCapsules} = require('../controllers/capsuleController')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } }) // 20MB

router.post('/capsules', auth, upload.single('file'), createCapsule)
router.get('/capsules', auth, getCapsules)
router.post('/pairs/request', auth, requestPair)
router.delete('/capsules/delete/:capsuleId', auth, deleteCapsule)
router.post('/pairs/:pairId/confirm', auth, confirmPair)

module.exports = router
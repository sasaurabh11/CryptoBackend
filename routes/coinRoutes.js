import express from 'express'
import { fetchAllCoins, conversion, companyList } from '../controller/coinControllers.js'

const router = express.Router()

router.route('/coins').get(fetchAllCoins)
router.route('/convert_coin').post(conversion)
router.route('/company_list').post(companyList)

export default router

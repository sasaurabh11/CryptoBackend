import asyncHandler from 'express-async-handler'
import axios from 'axios'
import Currency from '../model/db.js'
import isValidDate from '../utils/dateValidator.js'

const fetchAllCoins = asyncHandler(async (req, res) => {
    try {
        const response = await axios.get(process.env.COIN_LIST_API).catch((err) => {
            return res.status(400).json({ success: false, message: 'Error fetching data', error: err })
        })
        const coins = response.data

        const dbCoins = await Currency.find({}, { id: 1 }).catch((err) => {
            return res.status(400).json({ success: false, message: 'Error fetching coins', error: err})
        })

        const newCoins = coins.filter((coin) => !dbCoins.includes(coin.id))

        if (newCoins.length > 0) {
            await Currency.insertMany(newCoins).catch((err) => {
                return res.status(400).json({ success: false, message: 'Error fetching coins from database', error: err })
            })
            return res.status(201).json({ success: true, message: 'Coins fetched successfully' })
        } 
        else {    
            return res.status(200).json({ success: false, message: 'No new coins' })
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Internal error', error: error })
    }
})

const conversion = asyncHandler(async (req, res) => {
    try {
        const { fromCurrency, toCurrency, date } = req.body

        if (!isValidDate(date)) {
            return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        const dbCoins = await Currency.find({ id: { $in: [fromCurrency, toCurrency] } })
        if (dbCoins.length !== 2) {
            return res.status(400).json({ success: false, message: 'Currencies not available' })
        }

        const requestData = {
            date,
            localization: false
        }
        const responseFromCurrency = await axios.get(`${process.env.PRICE_API}/${fromCurrency}/history`, { params: requestData }).catch((err) => {
            return res.status(400).json({ success: false, message: 'Error fetching data', error: err })
        })
        const responseToCurrency = await axios.get(`${process.env.PRICE_API}/${toCurrency}/history`, { params: requestData }).catch((err) => {
            return res.status(400).json({ success: false, message: 'Error fetching data', error: err })
        })

        const usdValueFromCurrency = responseFromCurrency.data.market_data.current_price.usd
        const usdValueToCurrency = responseToCurrency.data.market_data.current_price.usd

        const convertedPrice = usdValueFromCurrency/usdValueToCurrency
        const data = {
            fromCurrency: dbCoins[0].id,
            toCurrency: dbCoins[1].id,
            date: date,
            conversionPrice: convertedPrice
        }

        res.status(201).json({ success: true, message: 'Data fetched successfully', data: data })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error })
    }
})

const companyList = asyncHandler(async (req, res) => {
    try {
        const { currency } = req.body

        if (currency !== 'bitcoin' && currency !== 'ethereum') {
            return res.status(400).json({ success: false, message: "Please enter 'bitcoin' or 'ethereum' as currency"})
        }

        const response = await axios.get(`${process.env.PUBLIC_TREASURY_API}/${currency}`).catch((err) => {
            return res.status(400).json({ success: false, message: 'Error fetching data', error: err })
        })

        const companyData = response.data.companies

        res.status(201).json({ success: true, message: "Data fetched successfully", data: companyData })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error })
    }
})

export { fetchAllCoins, conversion, companyList }

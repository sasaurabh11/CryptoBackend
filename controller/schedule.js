import asyncHandler from 'express-async-handler'
import axios from 'axios'
import Currency from '../model/db.js'

const scheduler = asyncHandler(async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/list')
        const coins = response.data

        const dbCoins = await Currency.find({}, { id: 1 }).catch((err) => {
            console.log("Error fetching coins: ", err)
        })
        const newCoins = coins.filter((coin) => {!dbCoins.includes(coin.id)})

        if (newCoins.length > 0) {
            await Currency.insertMany(newCoins);
            console.log('Coins fetched successfully');
        } else {
            console.log('No new coins');
        }
    } catch (error) {
        console.error('Error in scheduler');
    }
})

export default scheduler
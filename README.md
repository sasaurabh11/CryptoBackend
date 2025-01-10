## API Reference

#### Get all cryptocurrencies
Fetches all available cryptocurrencies from an Coingecko's API and updates the database.
```http
  GET /api/coins
```

#### Cryptocurrency conversion
```http
  POST /api/convert-coin
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `fromCurrency`| `string` | **Required**. From Currency |
| `toCurrency` | `string` | **Required**. To Currency |
| `date` | `string` | **Required**. Format: DD-MM-YYYY |

#### List comapnies holding a cryptocurrency

```http
  POST /api/company-list
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `currency` | `string` | **Required**. Name of currency |



# Shipping-Rate-API

## Digital Backend Assignment (In development)

- Tested with Postman API
- API endpoint: `localhost:3000/api/v1/shipping-rates/domestic`
- Post format for raw .json:

```json 
{
"origin_postcode": 79000,
"origin_country": "MY",
"origin_state": "Johor",
"destination_country": "MY",
"destination_state": "Selangor",
"destination_postcode": 43900,
"length": 50,
"width": 50,
"height": 50,
"selected_type": 1,
"parcel_weight": 6,
"document_weight": 0
}
```

- Supported courier
  - CityLink
  - SkyNet

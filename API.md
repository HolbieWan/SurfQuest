# StormGlass API

## Key: 7ca336b0-ec84-11ef-ae24-0242ac130003-7ca3371e-ec84-11ef-ae24-0242ac130003

## URL: GET https://api.stormglass.io/v2

```python
import requests

response = requests.get(
  'https://api.stormglass.io/v2/weather/point',
  params={
    'lat': 58.7984,
    'lng': 17.8081,
    'params': 'windSpeed',
  },
  headers={
    'Authorization': 'example-api-key'
  }
)

# Do something with response data.
json_data = response.json()
```
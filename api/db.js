import { tether } from '../lib/util.js'

export default async (req, res) => {
  if (req.method !== 'GET')
    return res.status(400).json({ msg: 'Invalid request' })

  try {
    const data = await tether.get('https://data.mongodb-api.com/app/data-karip/endpoint/data/v1/action/find', {
      headers: {
        'Access-Control-Request-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'api-key': 'Exim9xNKtgiG4iYZwa4cfkQa1zKQUxM5P4Ox9IWA6CRoOASff3AUKY7BWNhNP9XO',
      },
      data: {
        dataSource: 'Test',
        database: 'sample_mflix',
        collection: 'comments',
        filter: {},
      },
    })

    return res.status(200).json({ msg: 'Database: Success!', data })
  }
  catch (err) {
    return res.status(500).json({ msg: 'Database: Error', err })
  }
}
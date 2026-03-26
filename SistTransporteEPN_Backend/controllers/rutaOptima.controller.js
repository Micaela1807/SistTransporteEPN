const axios = require('axios');

module.exports.getRutaOptima = async (req, res) => {
    const { coordenadas } = req.body; // Array de coordenadas [ [lat1, lng1], [lat2, lng2], ... ]
    
    try {
        const apiKey = '5b3ce3597851110001cf6248ffb794a1c5a64318abd21143a3508608';
        const response = await axios.post(
            'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
            {
                coordinates: coordenadas,
            },
            {
                headers: {
                    Authorization: apiKey,
                },
            }
        );

        const ruta = response.data.features[0].geometry.coordinates; // Coordenadas de la ruta
        res.json(ruta);
    } catch (error) {
        console.error('Error al obtener la ruta:', error);
        res.status(500).json({ message: 'Error al obtener la ruta' });
    }
};


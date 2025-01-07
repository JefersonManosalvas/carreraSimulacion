const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

// Configurar manualmente los encabezados CORS para permitir solicitudes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite todas las orígenes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Encabezados permitidos
    next();
});

// Manejar solicitudes preflight (OPTIONS)
app.options('*', (req, res) => {
    res.sendStatus(204); // No Content
});

let carreras = [];

// Obtener todas las carreras (GET)
app.get('/carreras', (req, res) => {
    res.json(carreras);
});

// Crear una nueva carrera (POST)
app.post('/carreras', (req, res) => {
    const { numCorredores, distancia } = req.body;

    if (!numCorredores || !distancia) {
        return res.status(400).json({ message: 'Faltan datos de la carrera' });
    }

    const carrera = {
        id: carreras.length + 1,
        numCorredores,
        distancia,
        resultados: []
    };

    // Simular velocidades y resultados
    for (let i = 0; i < numCorredores; i++) {
        const velocidad = Math.random() * (15 - 5) + 5; // Velocidad aleatoria entre 5 y 15 km/h
        const tiempo = distancia / velocidad; // Tiempo en horas
        carrera.resultados.push({ corredor: i + 1, velocidad: velocidad.toFixed(2), tiempo: tiempo.toFixed(2), distancia });
    }

    carreras.push(carrera);
    res.json(carrera);
});

// Actualizar una carrera por ID (PUT)
app.put('/carreras/:id', (req, res) => {
    const { id } = req.params;
    const { numCorredores, distancia } = req.body;

    const carrera = carreras.find(c => c.id == id);
    if (!carrera) {
        return res.status(404).json({ message: 'Carrera no encontrada' });
    }

    carrera.numCorredores = numCorredores || carrera.numCorredores;
    carrera.distancia = distancia || carrera.distancia;

    res.json({ message: 'Carrera actualizada', carrera });
});

// Eliminar una carrera por ID (DELETE)
app.delete('/carreras/:id', (req, res) => {
    const { id } = req.params;

    const index = carreras.findIndex(c => c.id == id);
    if (index === -1) {
        return res.status(404).json({ message: 'Carrera no encontrada' });
    }

    carreras.splice(index, 1);
    res.json({ message: 'Carrera eliminada' });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

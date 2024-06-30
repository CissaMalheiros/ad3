const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let tarefas = [];

app.get('/tarefas', (req, res) => {
    res.json(tarefas);
});

app.post('/tarefas', (req, res) => {
    const tarefa = req.body;
    tarefas.push(tarefa);
    res.status(201).json(tarefa);
});

app.put('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.feita = req.body.feita;
        res.json(tarefa);
    } else {
        res.status(404).send('Tarefa não encontrada');
    }
});

app.delete('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    tarefas = tarefas.filter(t => t.id !== id);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

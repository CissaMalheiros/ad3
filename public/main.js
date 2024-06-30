const novaTarefaInput = document.getElementById('novaTarefa');
const btnAdicionar = document.getElementById('btnAdicionar');
const listaTarefas = document.getElementById('listaTarefas');

async function carregarTarefas() {
    const response = await fetch('/tarefas');
    const tarefas = await response.json();
    listaTarefas.innerHTML = '';
    tarefas.forEach(adicionarTarefaNaLista);
}

async function criarTarefa() {
    const textoTarefa = novaTarefaInput.value;

    if (textoTarefa) {
        const tarefa = {
            id: Date.now(),
            texto: textoTarefa,
            feita: false
        };

        const response = await fetch('/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarefa)
        });

        if (response.ok) {
            adicionarTarefaNaLista(tarefa);
            novaTarefaInput.value = ''; // Limpar campo de entrada
        }
    }
}

function adicionarTarefaNaLista(tarefa) {
    const novoItem = document.createElement('li');
    novoItem.textContent = tarefa.texto;
    novoItem.dataset.id = tarefa.id;

    const btnFeito = document.createElement('button');
    btnFeito.classList.add('btnFeito');
    btnFeito.textContent = 'Feito';
    btnFeito.addEventListener('click', marcarFeito);

    const btnExcluir = document.createElement('button');
    btnExcluir.classList.add('btnExcluir');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.addEventListener('click', excluirTarefa);

    novoItem.appendChild(btnFeito);
    novoItem.appendChild(btnExcluir);

    if (tarefa.feita) {
        novoItem.classList.add('feito');
    }

    listaTarefas.appendChild(novoItem);
}

async function marcarFeito(event) {
    const item = event.target.parentNode;
    const id = parseInt(item.dataset.id);
    const tarefa = { feita: !item.classList.contains('feito') };

    const response = await fetch(`/tarefas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tarefa)
    });

    if (response.ok) {
        item.classList.toggle('feito');
    }
}

async function excluirTarefa(event) {
    const item = event.target.parentNode;
    const id = parseInt(item.dataset.id);

    const response = await fetch(`/tarefas/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        listaTarefas.removeChild(item);
    }
}

btnAdicionar.addEventListener('click', criarTarefa);

novaTarefaInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        criarTarefa();
    }
});

carregarTarefas();

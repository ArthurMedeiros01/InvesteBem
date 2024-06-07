document.addEventListener('DOMContentLoaded', () => {
    const formCriarMeta = document.getElementById('form-criar-meta');
    const metasLista = document.getElementById('metas-lista');
    const metasAcompanhamento = document.getElementById('metas-acompanhamento');
    const formAjustarMetas = document.getElementById('form-ajustar-metas');
    const selecionarMeta = document.getElementById('selecionar-meta');

    let metas = [];

    formCriarMeta.addEventListener('submit', (event) => {
        event.preventDefault();
        const nome = document.getElementById('nome-meta').value;
        const descricao = document.getElementById('descricao-meta').value;
        const valor = document.getElementById('valor-meta').value;
        const prazo = document.getElementById('prazo-meta').value;

        const meta = {
            id: Date.now(),
            nome,
            descricao,
            valor: parseFloat(valor),
            prazo,
            economizado: 0
        };

        metas.push(meta);
        atualizarUI();
        formCriarMeta.reset();
    });

    formAjustarMetas.addEventListener('submit', (event) => {
        event.preventDefault();
        const idMeta = parseInt(selecionarMeta.value);
        const novoValor = parseFloat(document.getElementById('novo-valor').value);
        const novoPrazo = document.getElementById('novo-prazo').value;

        const meta = metas.find(meta => meta.id === idMeta);
        if (meta) {
            meta.valor = novoValor;
            meta.prazo = novoPrazo;
            atualizarUI();
        }
    });

    function atualizarUI() {
        metasLista.innerHTML = '';
        metasAcompanhamento.innerHTML = '';
        selecionarMeta.innerHTML = '';

        metas.forEach(meta => {
            const metaElemento = document.createElement('div');
            metaElemento.classList.add('meta');
            metaElemento.innerHTML = `
                <h3>${meta.nome}</h3>
                <p>Descrição: ${meta.descricao}</p>
                <p>Valor: R$${meta.valor.toFixed(2)}</p>
                <p>Prazo: ${formatarData(meta.prazo)}</p>
                <button onclick="editarMeta(${meta.id})">Editar</button>
                <button onclick="excluirMeta(${meta.id})">Excluir</button>
            `;
            metasLista.appendChild(metaElemento);

            const acompanhamentoElemento = document.createElement('div');
            acompanhamentoElemento.classList.add('meta');
            acompanhamentoElemento.innerHTML = `
                <h3>${meta.nome}</h3>
                <p>Valor: R$${meta.valor.toFixed(2)}</p>
                <p>Valor Economizado: R$${meta.economizado.toFixed(2)}</p>
                <label for="valor-acompanhar-${meta.id}">Valor Economizado</label>
                <input type="number" id="valor-acompanhar-${meta.id}" value="${meta.economizado}" onchange="atualizarEconomizado(${meta.id}, this.value)">
                <button onclick="salvarEconomizado(${meta.id})">Salvar</button>
            `;
            metasAcompanhamento.appendChild(acompanhamentoElemento);

            const option = document.createElement('option');
            option.value = meta.id;
            option.textContent = meta.nome;
            selecionarMeta.appendChild(option);
        });
    }

    function formatarData(data) {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    window.editarMeta = (id) => {
        const meta = metas.find(meta => meta.id === id);
        if (meta) {
            document.getElementById('novo-valor').value = meta.valor;
            document.getElementById('novo-prazo').value = meta.prazo;
            selecionarMeta.value = meta.id;
        }
    };

    window.excluirMeta = (id) => {
        metas = metas.filter(meta => meta.id !== id);
        atualizarUI();
    };

    window.atualizarEconomizado = (id, valor) => {
        const meta = metas.find(meta => meta.id === id);
        if (meta) {
            meta.economizado = parseFloat(valor);
        }
    };

    window.salvarEconomizado = (id) => {
        const input = document.getElementById(`valor-acompanhar-${id}`);
        if (input) {
            atualizarEconomizado(id, input.value);
            atualizarUI();
        }
    };
});

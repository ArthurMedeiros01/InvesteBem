document.addEventListener('DOMContentLoaded', () => {
    const formFixas = document.getElementById('form-fixas');
    const fixasLista = document.getElementById('fixas-lista');
    const formVariaveis = document.getElementById('form-variaveis');
    const variaveisLista = document.getElementById('variaveis-lista');
    const visualizacaoLista = document.getElementById('visualizacao-lista');
    const totalReceitas = document.getElementById('total-receitas');
    const cancelarEdicaoFixa = document.getElementById('cancelar-edicao-fixa');
    const cancelarEdicaoVariavel = document.getElementById('cancelar-edicao-variavel');

    let receitasFixas = [];
    let receitasVariaveis = [];
    let editando = false;
    let receitaAtual = null;

    formFixas.addEventListener('submit', (e) => {
        e.preventDefault();
        const descricao = document.getElementById('descricao-fixa').value;
        const valor = parseFloat(document.getElementById('valor-fixa').value);
        const data = document.getElementById('data-fixa').value;

        if (editando && receitaAtual) {
            receitaAtual.descricao = descricao;
            receitaAtual.valor = valor;
            receitaAtual.data = data;
            resetarFormularioFixa();
        } else {
            const receita = {
                id: Date.now(),
                descricao,
                valor,
                data
            };
            receitasFixas.push(receita);
        }

        atualizarUI();
        formFixas.reset();
    });

    formVariaveis.addEventListener('submit', (e) => {
        e.preventDefault();
        const descricao = document.getElementById('descricao-variavel').value;
        const valor = parseFloat(document.getElementById('valor-variavel').value);
        const data = document.getElementById('data-variavel').value;
        const observacao = document.getElementById('observacao-variavel').value;

        if (editando && receitaAtual) {
            receitaAtual.descricao = descricao;
            receitaAtual.valor = valor;
            receitaAtual.data = data;
            receitaAtual.observacao = observacao;
            resetarFormularioVariavel();
        } else {
            const receita = {
                id: Date.now(),
                descricao,
                valor,
                data,
                observacao
            };
            receitasVariaveis.push(receita);
        }

        atualizarUI();
        formVariaveis.reset();
    });

    cancelarEdicaoFixa.addEventListener('click', resetarFormularioFixa);
    cancelarEdicaoVariavel.addEventListener('click', resetarFormularioVariavel);

    function atualizarUI() {
        fixasLista.innerHTML = '';
        variaveisLista.innerHTML = '';
        visualizacaoLista.innerHTML = '';

        receitasFixas.forEach(receita => {
            const receitaElemento = document.createElement('div');
            receitaElemento.classList.add('receita');
            receitaElemento.innerHTML = `
                <h3>${receita.descricao}</h3>
                <p>Valor Mensal: R$${receita.valor.toFixed(2)}</p>
                <p>Data de Início: ${formatarData(receita.data)}</p>
                <button onclick="editarReceita(${receita.id}, 'fixa')">Editar</button>
                <button onclick="excluirReceita(${receita.id}, 'fixa')">Excluir</button>
            `;
            fixasLista.appendChild(receitaElemento);

            const visualizacaoElemento = document.createElement('div');
            visualizacaoElemento.classList.add('receita');
            visualizacaoElemento.innerHTML = `
                <h3>${receita.descricao}</h3>
                <p>Valor: R$${receita.valor.toFixed(2)}</p>
            `;
            visualizacaoLista.appendChild(visualizacaoElemento);
        });

        receitasVariaveis.forEach(receita => {
            const receitaElemento = document.createElement('div');
            receitaElemento.classList.add('receita');
            receitaElemento.innerHTML = `
                <h3>${receita.descricao}</h3>
                <p>Valor: R$${receita.valor.toFixed(2)}</p>
                <p>Data: ${formatarData(receita.data)}</p>
                <p>Observação: ${receita.observacao}</p>
                <button onclick="editarReceita(${receita.id}, 'variavel')">Editar</button>
                <button onclick="excluirReceita(${receita.id}, 'variavel')">Excluir</button>
            `;
            variaveisLista.appendChild(receitaElemento);

            const visualizacaoElemento = document.createElement('div');
            visualizacaoElemento.classList.add('receita');
            visualizacaoElemento.innerHTML = `
                <h3>${receita.descricao}</h3>
                <p>Valor: R$${receita.valor.toFixed(2)}</p>
                <p>Observação: ${receita.observacao}</p>
            `;
            visualizacaoLista.appendChild(visualizacaoElemento);
        });

        const total = [...receitasFixas, ...receitasVariaveis].reduce((sum, receita) => sum + receita.valor, 0);
        totalReceitas.innerHTML = `Total das Receitas: R$${total.toFixed(2)}`;
    }

    window.editarReceita = (id, tipo) => {
        editando = true;
        if (tipo === 'fixa') {
            receitaAtual = receitasFixas.find(receita => receita.id === id);
            if (receitaAtual) {
                document.getElementById('descricao-fixa').value = receitaAtual.descricao;
                document.getElementById('valor-fixa').value = receitaAtual.valor;
                document.getElementById('data-fixa').value = receitaAtual.data;
                document.getElementById('cancelar-edicao-fixa').style.display = 'block';
            }
        } else if (tipo === 'variavel') {
            receitaAtual = receitasVariaveis.find(receita => receita.id === id);
            if (receitaAtual) {
                document.getElementById('descricao-variavel').value = receitaAtual.descricao;
                document.getElementById('valor-variavel').value = receitaAtual.valor;
                document.getElementById('data-variavel').value = receitaAtual.data;
                document.getElementById('observacao-variavel').value = receitaAtual.observacao;
                document.getElementById('cancelar-edicao-variavel').style.display = 'block';
            }
        }
    };

    window.excluirReceita = (id, tipo) => {
        if (tipo === 'fixa') {
            receitasFixas = receitasFixas.filter(receita => receita.id !== id);
        } else if (tipo === 'variavel') {
            receitasVariaveis = receitasVariaveis.filter(receita => receita.id !== id);
        }
        atualizarUI();
    };

    function resetarFormularioFixa() {
        editando = false;
        receitaAtual = null;
        formFixas.reset();
        document.getElementById('cancelar-edicao-fixa').style.display = 'none';
    }

    function resetarFormularioVariavel() {
        editando = false;
        receitaAtual = null;
        formVariaveis.reset();
        document.getElementById('cancelar-edicao-variavel').style.display = 'none';
    }

    function formatarData(data) {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }
});

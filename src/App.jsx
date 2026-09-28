import { ProdutoCard} from './components/ProdutoCard.jsx';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 2. trasformando a lista de produtos estática num "Estado" que pode mudar
 
  const [listaProdutos, setListaProdutos] = useState([]); // Inicia como lista vazia
  const [carregando, setCarregando] = useState(true); // Novo estado

  // Efeito colateral para carregar dados da API simulada na inicialização

  useEffect( ( ) =>{
    const buscarProdutos = async () => {
      try {
        // Simula um pequeno atraso de 1 segundo para vermos a mensagem "Carregando..."
        await new Promise(resolve => setTimeout(resolve, 1000));

        // NOVIDADE (Desafio Extra): Verifica se já existem dados salvos no navegador
        const dadosSalvos = localStorage.getItem( 'catalogo_produtos');
        if (dadosSalvos) {
          //Se existir, usa os dados do localStorage (Não precisa de fetch)
          setListaProdutos(JSON.parse(dadosSalvos));

        } else {
          //Se não existir, faz o fetch do JSON inicial
          const resposta = await fetch('/produtos.json');
          const dados = await resposta.json();
          setListaProdutos(dados);
          localStorage.setItem('catalogo_produtos', JSON.stringify(dados)); // Salva a carga inical
        }

      } catch (erro) {
        console.error('Erro ao caregar os produtos:', erro);
      } finally {
        setCarregando(false);
      }
    };
    buscarProdutos();
  },[]); // O array vazio garante  que roda apenas uma vez quando a página abre.
  //3. Criação dos estados para guardar temporariamente o que o usuário digitar no formulário.
  const [nome, setNome] = useState(' ');
  const [preco, setPreco] = useState(' ');
  const [emPromocao, setEmPromocao] = useState(false);
  const [categoria, setCategoria]=useState('Fones In-Ear');
  const [termoBusca, setTermoBusca] = useState(' ');
  const [filtroCategoria, setFiltroCategoria ] = useState ('Todas');

  //4. Função que é disparada quando clicamos no botão "Cadastrar".
  const adicionarProduto = (evento) => {
    evento.preventDefault(); //Impede que o navegador recarre a página

    //Monta o novo objeto do fone com os dados que estavam nos inputs.
    const novoProduto = {
      id: listaProdutos.length > 0 ? listaProdutos[listaProdutos.length -1].id + 1 : 1, // Previne erro de ID se a lista estiver vazia
      nome: nome,
      preco: parseFloat(preco), // Garante que o preço seja sempre  um número decimal
      categoria: categoria, // Alterado de "fones In-Ear" para a variável categoria 
      emPromocao: emPromocao
    };

      const novaLista = [...listaProdutos, novoProduto];
      setListaProdutos(novaLista); // Atualiza a tela
      localStorage.setItem('catalogo_produtos', JSON.stringify(novaLista)); // Desfio extra: Salva no navegador

      // Limpa os campos
      setNome(' ');
      setPreco(' ');
      setEmPromocao(false);
  };

   // 5. NOVA FUNÇÃO: Remover Produto
   const removerProduto = (idParaRemover) => {
    // filtra a lista, mantendo apenas os produtos que têm o Id diferente do que queremos remover
      const novaLista = listaProdutos.filter((produto) => produto.id !== idParaRemover);
      setListaProdutos(novaLista); //Atualiza a tela
      localStorage.setItem('catalogo_produtos', JSON.stringify(novaLista)); // Desafio Extra: Atualiza no navegador
   };



  // Cálculo do reduce agora olha para a "listaProdutos" (que é o estado)
  const precoTotal = listaProdutos.reduce((acumulador, produto) => acumulador + produto.preco, 0);

  // Lógica para fitrar a lista de produtos
    const produtosFiltrados = listaProdutos.filter((produto) => {
    const correspondeBusca = produto.nome.toLowerCase().includes(termoBusca.trim().toLowerCase());
    const correspondeCategoria = filtroCategoria === 'Todas' || produto.categoria.toLowerCase() === filtroCategoria.toLowerCase();
    return correspondeBusca && correspondeCategoria;
  });
  return (
    <div className='app-container'>
      <h1>Catálogo de equipamentos de Áudio</h1>

      {/* Exibe mensagem enquanto os dados não chegam */}
      {carregando && (
        <p className='mensagem-carregando'>
          carregando produtos...
        </p>
      )}

      {/* Resposta do requsito 1: Evolução do Front-End*/}
     <p className='texto-reflexao'>
        <strong>Reflexão - Evolução do Front-End:</strong> Manipular dados no console com JavaScript puro serve para testar a lógica oculta. Com o React, conseguimos pegar essa mesma lógica e transformá-la  em numa interface visual interativa para o utilizador, atualizando o ecrã de forma dinâmica (como no formulário abaixo) sem necessidade de recarregar a página.
      </p>

      <h2 className='titulo-valor'>
        Valor Total do Catálogo: R$ {precoTotal.toFixed(2)}
      </h2>

      {/* --- INÍCIO DO FORMULÁRIO --- */}
        <div className='formulario-container'>
          <h3>Adicionar Novo Equipamento</h3>

         {/* Quando o formulário é eviado, ele chama a função adicionarProduto */}
          <form onSubmit={adicionarProduto} className='formulario'>
            <select
             value={categoria}
             onChange={(e) => setCategoria(e.target.value)}
              className='input-form'
              >
              <option value= 'Fones In-ear'>Fones In-Ear</option>
              <option value= 'DACs e Amps'>Dacs e Amps</option>
              <option value= 'Cabos e Acessórios'>Cabos e Acessórios</option>
              <option value= 'Rádios Portáteis'>Rádios Portáteis</option>
           </select>  
           <input 
             type="text" 
             placeholder="Nome (ex: KZ PR3)" 
             value={nome}
             onChange={(e) => setNome(e.target.value)}
             required
             className='input-form'
         
            />
  
            <input 
              type="number" 
              laceholder="Preço (R$)" 
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
              min="0"
              step="0.01"
              className='input-form'
           />
  
            <label className='label-checkbox'>
              <input 
                type="checkbox" 
                checked={emPromocao}
                onChange={(e) => setEmPromocao(e.target.checked)}
                className='input-checkbox'
              />
              Em Promoção?
            </label>
  
            <button type="submit" className='btn-cadastrar'>
            Cadastrar

            </button>
          </form>
    </div>
    {/* ---FIM DO FORMULÁRIO ---}
    {/* Controle de Pesquisa e Filtro */}  
    <div className='filtros-container'>
      <input
        type='text'
        placeholder='buscar equipamento...'
        value={termoBusca}
        onChange={(e) => setTermoBusca(e.target.value)}
        className='campo-filtro input-busca'
      />
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className='campo-filtro select-categoria'
      
          >
          <option value="Todas">Todas as categorias</option>
          <option value="Fones In-Ear">Fones In-Ear</option>
          <option value="DACs e Amps">DACs e Amps</option>
          <option value="Cabos e Acessórios">Cabos e Acessórios</option>
          <option value="Rádios Portáteis">Rádios Portáteis</option>


        </select>
      </div>
      {/* Renderização dos cards */}

      <div className='catalogo-grid'>
        {produtosFiltrados.map(produto =>(
        <ProdutoCard
          key={produto.id}
          nome={produto.nome}
          preco={produto.preco}
          categoria={produto.categoria}
          emPromocao={produto.emPromocao}
         >
          {/* O conteúdo aqui dentro é passado automaticamente como "Children" */}
          <button className='btn-comprar'>
          Comprar
         </button>
        </ProdutoCard>
        ))}
      </div> 
   </div>
  );
}

export default App;

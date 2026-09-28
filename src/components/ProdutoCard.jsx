export function ProdutoCard({nome, preco, categoria,emPromocao, children}) {
    

        const classeDoCartao = emPromocao ? 'produto-card produto-promocao' : 'produto-card';
        
        
        return(
        <div className={classeDoCartao}> 

            <div>
                <h3 style={{margin: '0 0 10px 0'}}>{nome}</h3>
                <p style={{margin: '5px 0' }}>Categoria:{categoria}</p>
                <p style={{margin: '5px 0', fontSize: '1.2em'}}>
                <strong>R${preco.toFixed(2)}</strong>
            </p>
                 {/* Condicional JSX com Operador Ternário */}
                 {   emPromocao ? (
                <span style={{ color: '#4ade80', fontWeight: 'bold' }}>Em Promoção</span>
                ) : (
                <span style={{ color: '#a1a1aa' }}>Preço Normal</span>
                )}                                                      
            </div>

            {/*rederização da propriedade especial children (ex: Botão comprar ou Remover) */}
             <div style={{marginTop: '15px'}}>
               {children}
             </div>

        </div>


        );
            
}
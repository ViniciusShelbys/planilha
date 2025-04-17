import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const gastosFixos = [
  { descricao: 'Aluguel', valor: 2900, categoria: 'Moradia' },
  { descricao: 'Carro', valor: 1800, categoria: 'Transporte' },
  { descricao: 'Energia', valor: 350, categoria: 'Contas' },
  { descricao: 'Água', valor: 100, categoria: 'Contas' },
  { descricao: 'Comida', valor: 1500, categoria: 'Alimentação' },
  { descricao: 'Cartão', valor: 500, categoria: 'Financeiro' },
  { descricao: 'Plano de Saúde', valor: 440, categoria: 'Saúde' },
  { descricao: 'Streaming', valor: 140, categoria: 'Lazer' },
  { descricao: 'Rolê', valor: 400, categoria: 'Lazer' },
  { descricao: 'Internet', valor: 150, categoria: 'Contas' },
  { descricao: 'Plano Móvel', valor: 80, categoria: 'Contas' }
];

const App = () => {
  const receitaMensal = 9000;
  const [gastos, setGastos] = useState(() => {
    const data = localStorage.getItem('gastos');
    return data ? JSON.parse(data) : gastosFixos;
  });
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ descricao: '', valor: '', categoria: '' });

  useEffect(() => {
    localStorage.setItem('gastos', JSON.stringify(gastos));
  }, [gastos]);

  const adicionarOuEditar = () => {
    if (!form.descricao || !form.valor || !form.categoria) return;
    if (editando !== null) {
      const atualizados = [...gastos];
      atualizados[editando] = { ...form, valor: parseFloat(form.valor) };
      setGastos(atualizados);
      setEditando(null);
    } else {
      setGastos([...gastos, { ...form, valor: parseFloat(form.valor) }]);
    }
    setForm({ descricao: '', valor: '', categoria: '' });
  };

  const deletar = index => {
    const atualizado = gastos.filter((_, i) => i !== index);
    setGastos(atualizado);
  };

  const editar = index => {
    const gasto = gastos[index];
    setForm(gasto);
    setEditando(index);
  };

  const total = gastos.reduce((acc, item) => acc + item.valor, 0);
  const saldo = receitaMensal - total;

  const categorias = [...new Set(gastos.map(g => g.categoria))];
  const totaisPorCategoria = categorias.map(cat => ({
    categoria: cat,
    total: gastos.filter(g => g.categoria === cat).reduce((a, b) => a + b.valor, 0)
  }));

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>Planilha do Vinicius</h1>
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <Card titulo="Receita" valor={receitaMensal} cor="#4CAF50" />
        <Card titulo="Despesas" valor={total} cor="#F44336" />
        <Card titulo="Saldo" valor={saldo} cor={saldo >= 0 ? '#2196F3' : '#FF9800'} />
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>{editando !== null ? "Editar Lançamento" : "Novo Lançamento"}</h2>
        <input placeholder="Descrição" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
        <input type="number" placeholder="Valor" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
        <input placeholder="Categoria" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} />
        <button onClick={adicionarOuEditar}>{editando !== null ? "Salvar" : "Adicionar"}</button>
      </div>

      <h2 style={{ marginTop: 30 }}>Lançamentos</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', marginTop: 10 }}>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((gasto, i) => (
            <tr key={i}>
              <td>{gasto.descricao}</td>
              <td>R$ {gasto.valor.toFixed(2)}</td>
              <td>{gasto.categoria}</td>
              <td>
                <button onClick={() => editar(i)}>✏️</button>
                <button onClick={() => deletar(i)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 40 }}>Gráfico por Categoria</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15 }}>
        {totaisPorCategoria.map((cat, i) => (
          <div key={i} style={{ background: '#e0e0e0', padding: 10, borderRadius: 8 }}>
            <strong>{cat.categoria}</strong>: R$ {cat.total.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
};

const Card = ({ titulo, valor, cor }) => (
  <div style={{ flex: 1, backgroundColor: cor, color: 'white', padding: 20, borderRadius: 10 }}>
    <h3>{titulo}</h3>
    <p style={{ fontSize: 22, margin: 0 }}>R$ {valor.toFixed(2)}</p>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
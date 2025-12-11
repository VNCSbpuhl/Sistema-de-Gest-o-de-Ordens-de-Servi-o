import { initDatabase, executeQuery } from '../database/database';
import { OrdemServico } from '../types/OrdemServico';

// Inicializar banco na primeira vez
let dbInitialized = false;

const ensureDatabaseInitialized = async () => {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
};

export const ordemServicoService = {
  // Buscar todas as ordens
  async getAll(): Promise<OrdemServico[]> {
    try {
      await ensureDatabaseInitialized();
      const result = await executeQuery(
        'SELECT * FROM ordens_servico ORDER BY id DESC'
      );
      
      const rows = result.rows;
      const ordens: OrdemServico[] = [];
      
      for (let i = 0; i < rows.length; i++) {
        const item = rows.item(i);
        ordens.push({
          id: item.id,
          data: item.data,
          nome_cliente: item.nome_cliente,
          nome_aparelho: item.nome_aparelho,
          numero_serie: item.numero_serie || '',
          motivo_reparo: item.motivo_reparo || '',
          servico_realizado: item.servico_realizado || '',
          valor_servico: item.valor_servico || 0,
          finalizado: item.finalizado === 1,
        });
      }
      
      return ordens;
    } catch (error) {
      console.error('Erro ao buscar ordens:', error);
      return [];
    }
  },

  // Salvar uma nova ordem
  async save(ordem: OrdemServico): Promise<void> {
    try {
      await ensureDatabaseInitialized();
      await executeQuery(
        `INSERT INTO ordens_servico 
         (data, nome_cliente, nome_aparelho, numero_serie, motivo_reparo, servico_realizado, valor_servico, finalizado)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ordem.data,
          ordem.nome_cliente,
          ordem.nome_aparelho,
          ordem.numero_serie || '',
          ordem.motivo_reparo || '',
          ordem.servico_realizado || '',
          ordem.valor_servico,
          ordem.finalizado ? 1 : 0,
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar ordem:', error);
      throw error;
    }
  },

  // Atualizar uma ordem existente
  async update(ordem: OrdemServico): Promise<void> {
    try {
      await ensureDatabaseInitialized();
      await executeQuery(
        `UPDATE ordens_servico SET
         data = ?,
         nome_cliente = ?,
         nome_aparelho = ?,
         numero_serie = ?,
         motivo_reparo = ?,
         servico_realizado = ?,
         valor_servico = ?,
         finalizado = ?
         WHERE id = ?`,
        [
          ordem.data,
          ordem.nome_cliente,
          ordem.nome_aparelho,
          ordem.numero_serie || '',
          ordem.motivo_reparo || '',
          ordem.servico_realizado || '',
          ordem.valor_servico,
          ordem.finalizado ? 1 : 0,
          ordem.id,
        ]
      );
    } catch (error) {
      console.error('Erro ao atualizar ordem:', error);
      throw error;
    }
  },

  // Deletar uma ordem
  async delete(id: number): Promise<void> {
    try {
      await ensureDatabaseInitialized();
      await executeQuery('DELETE FROM ordens_servico WHERE id = ?', [id]);
    } catch (error) {
      console.error('Erro ao deletar ordem:', error);
      throw error;
    }
  },

  // Gerar próximo ID
  async getNextId(): Promise<number> {
    try {
      await ensureDatabaseInitialized();
      const result = await executeQuery(
        'SELECT MAX(id) as maxId FROM ordens_servico'
      );
      
      const maxId = result.rows.item(0)?.maxId || 0;
      return maxId + 1;
    } catch (error) {
      console.error('Erro ao gerar próximo ID:', error);
      return 1;
    }
  },
};

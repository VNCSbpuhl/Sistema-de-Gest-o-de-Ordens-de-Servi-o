import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrdemServico } from '../types/OrdemServico';

const STORAGE_KEY = '@ordens_servico';

export const ordemServicoService = {
  // Buscar todas as ordens
  async getAll(): Promise<OrdemServico[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar ordens:', error);
      return [];
    }
  },

  // Salvar uma nova ordem
  async save(ordem: OrdemServico): Promise<void> {
    try {
      const ordens = await this.getAll();
      ordens.push(ordem);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ordens));
    } catch (error) {
      console.error('Erro ao salvar ordem:', error);
      throw error;
    }
  },

  // Atualizar uma ordem existente
  async update(ordem: OrdemServico): Promise<void> {
    try {
      const ordens = await this.getAll();
      const index = ordens.findIndex(o => o.id === ordem.id);
      if (index !== -1) {
        ordens[index] = ordem;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ordens));
      }
    } catch (error) {
      console.error('Erro ao atualizar ordem:', error);
      throw error;
    }
  },

  // Deletar uma ordem
  async delete(id: number): Promise<void> {
    try {
      const ordens = await this.getAll();
      const filtered = ordens.filter(o => o.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Erro ao deletar ordem:', error);
      throw error;
    }
  },

  // Gerar próximo ID
  async getNextId(): Promise<number> {
    try {
      const ordens = await this.getAll();
      if (ordens.length === 0) return 1;
      const maxId = Math.max(...ordens.map(o => o.id));
      return maxId + 1;
    } catch (error) {
      console.error('Erro ao gerar próximo ID:', error);
      return 1;
    }
  },
};


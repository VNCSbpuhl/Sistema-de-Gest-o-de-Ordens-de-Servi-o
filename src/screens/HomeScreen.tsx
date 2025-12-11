import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect, NativeStackNavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { ordemServicoService } from '../services/ordemServicoService';
import { OrdemServico } from '../types/OrdemServico';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrdens = async () => {
    try {
      const data = await ordemServicoService.getAll();
      // Ordenar por ID decrescente (mais recentes primeiro)
      const sorted = data.sort((a, b) => b.id - a.id);
      setOrdens(sorted);
    } catch (error) {
      console.error('Erro ao carregar ordens:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrdens();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrdens();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    return dateString;
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const renderItem = ({ item }: { item: OrdemServico }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Cadastro', { ordem: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardId}>#{item.id}</Text>
        <View
          style={[
            styles.statusBadge,
            item.finalizado ? styles.statusFinalizado : styles.statusPendente,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.finalizado ? styles.statusTextFinalizado : styles.statusTextPendente,
            ]}
          >
            {item.finalizado ? 'Finalizado' : 'Pendente'}
          </Text>
        </View>
      </View>
      <Text style={styles.cardCliente}>{item.nome_cliente}</Text>
      <Text style={styles.cardAparelho}>{item.nome_aparelho}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardData}>{formatDate(item.data)}</Text>
        <Text style={styles.cardValor}>{formatCurrency(item.valor_servico)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ordens de Serviço</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.addButtonText}>+ Nova Ordem</Text>
        </TouchableOpacity>
      </View>

      {ordens.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma ordem cadastrada</Text>
          <Text style={styles.emptySubtext}>Toque em "Nova Ordem" para começar</Text>
        </View>
      ) : (
        <FlatList
          data={ordens}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusFinalizado: {
    backgroundColor: '#d4edda',
  },
  statusPendente: {
    backgroundColor: '#fff3cd',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextFinalizado: {
    color: '#155724',
  },
  statusTextPendente: {
    color: '#856404',
  },
  cardCliente: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardAparelho: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cardData: {
    fontSize: 13,
    color: '#999',
  },
  cardValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});


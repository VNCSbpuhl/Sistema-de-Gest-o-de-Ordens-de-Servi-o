import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { ordemServicoService } from '../services/ordemServicoService';
import { OrdemServico } from '../types/OrdemServico';

type CadastroScreenRouteProp = RouteProp<RootStackParamList, 'Cadastro'>;

export default function CadastroScreen() {
  const navigation = useNavigation();
  const route = useRoute<CadastroScreenRouteProp>();
  const ordemEdit = route.params?.ordem;

  const [id, setId] = useState<number>(0);
  const [data, setData] = useState<string>('');
  const [nomeCliente, setNomeCliente] = useState<string>('');
  const [nomeAparelho, setNomeAparelho] = useState<string>('');
  const [numeroSerie, setNumeroSerie] = useState<string>('');
  const [motivoReparo, setMotivoReparo] = useState<string>('');
  const [servicoRealizado, setServicoRealizado] = useState<string>('');
  const [valorServico, setValorServico] = useState<string>('');
  const [finalizado, setFinalizado] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ordemEdit) {
      setId(ordemEdit.id);
      setData(ordemEdit.data);
      setNomeCliente(ordemEdit.nome_cliente);
      setNomeAparelho(ordemEdit.nome_aparelho);
      setNumeroSerie(ordemEdit.numero_serie);
      setMotivoReparo(ordemEdit.motivo_reparo);
      setServicoRealizado(ordemEdit.servico_realizado);
      setValorServico(ordemEdit.valor_servico.toString());
      setFinalizado(ordemEdit.finalizado);
    } else {
      // Nova ordem - definir data atual e gerar ID
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      setData(`${day}/${month}/${year}`);
      
      ordemServicoService.getNextId().then((nextId) => {
        setId(nextId);
      });
    }
  }, [ordemEdit]);

  const handleSave = async () => {
    // Validações
    if (!nomeCliente.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o nome do cliente');
      return;
    }
    if (!nomeAparelho.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o nome do aparelho');
      return;
    }

    const valor = parseFloat(valorServico.replace(',', '.')) || 0;

    setLoading(true);
    try {
      const ordem: OrdemServico = {
        id,
        data,
        nome_cliente: nomeCliente.trim(),
        nome_aparelho: nomeAparelho.trim(),
        numero_serie: numeroSerie.trim(),
        motivo_reparo: motivoReparo.trim(),
        servico_realizado: servicoRealizado.trim(),
        valor_servico: valor,
        finalizado,
      };

      if (ordemEdit) {
        await ordemServicoService.update(ordem);
        Alert.alert('Sucesso', 'Ordem atualizada com sucesso!');
      } else {
        await ordemServicoService.save(ordem);
        Alert.alert('Sucesso', 'Ordem cadastrada com sucesso!');
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a ordem');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {ordemEdit ? 'Editar Ordem' : 'Nova Ordem de Serviço'}
          </Text>
          <Text style={styles.headerSubtitle}>ID: #{id}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Entrada *</Text>
            <TextInput
              style={styles.input}
              value={data}
              onChangeText={setData}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Cliente *</Text>
            <TextInput
              style={styles.input}
              value={nomeCliente}
              onChangeText={setNomeCliente}
              placeholder="Digite o nome do cliente"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Aparelho *</Text>
            <TextInput
              style={styles.input}
              value={nomeAparelho}
              onChangeText={setNomeAparelho}
              placeholder="Ex: iPhone 12, Samsung Galaxy..."
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número de Série</Text>
            <TextInput
              style={styles.input}
              value={numeroSerie}
              onChangeText={setNumeroSerie}
              placeholder="Digite o número de série"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Motivo do Reparo</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={motivoReparo}
              onChangeText={setMotivoReparo}
              placeholder="Descreva o motivo do reparo"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Serviço Realizado</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={servicoRealizado}
              onChangeText={setServicoRealizado}
              placeholder="Descreva o serviço realizado"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valor do Serviço (R$)</Text>
            <TextInput
              style={styles.input}
              value={valorServico}
              onChangeText={setValorServico}
              placeholder="0,00"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                {finalizado ? 'Finalizado' : 'Pendente'}
              </Text>
              <Switch
                value={finalizado}
                onValueChange={setFinalizado}
                trackColor={{ false: '#d0d0d0', true: '#81b0ff' }}
                thumbColor={finalizado ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.backButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Salvando...' : ordemEdit ? 'Atualizar' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  switchGroup: {
    marginBottom: 30,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 6,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 6,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


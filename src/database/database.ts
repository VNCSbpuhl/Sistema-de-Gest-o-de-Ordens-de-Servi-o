import * as SQLite from 'expo-sqlite';

// Abrir conexão com o banco de dados
const db = SQLite.openDatabase('ordens_servico.db');

// Inicializar o banco de dados e criar tabela se não existir
export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ordens_servico (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            nome_cliente TEXT NOT NULL,
            nome_aparelho TEXT NOT NULL,
            numero_serie TEXT,
            motivo_reparo TEXT,
            servico_realizado TEXT,
            valor_servico REAL NOT NULL,
            finalizado INTEGER NOT NULL DEFAULT 0
          );`,
          [],
          () => {
            console.log('Tabela ordens_servico criada/verificada com sucesso');
            resolve();
          },
          (_, error) => {
            console.error('Erro ao criar tabela:', error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Erro na transação:', error);
        reject(error);
      }
    );
  });
};

// Obter instância do banco de dados
export const getDatabase = () => db;

// Executar query genérica
export const executeQuery = (
  query: string,
  params: any[] = []
): Promise<SQLite.SQLResultSet> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          query,
          params,
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            console.error('Erro ao executar query:', error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Erro na transação:', error);
        reject(error);
      }
    );
  });
};


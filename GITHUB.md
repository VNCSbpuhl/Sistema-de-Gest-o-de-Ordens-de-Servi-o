# 📤 Como Enviar para o GitHub

## Passo a Passo

### 1. Criar repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Escolha um nome (ex: `ordens-servico-app`)
4. **NÃO** marque "Initialize with README" (já temos um)
5. Clique em "Create repository"

### 2. Preparar o projeto local

```powershell
# Verificar status
git status

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit: App de Ordens de Serviço"
```

### 3. Conectar ao repositório remoto

```powershell
# Substitua SEU_USUARIO e NOME_DO_REPOSITORIO pelos seus valores
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git

# Verificar se foi adicionado
git remote -v
```

### 4. Enviar para o GitHub

```powershell
# Enviar para o branch main/master
git branch -M main
git push -u origin main
```

## Comandos Úteis

### Ver o que será commitado
```powershell
git status
```

### Adicionar arquivos específicos
```powershell
git add arquivo.ts
```

### Ver diferenças
```powershell
git diff
```

### Fazer commit
```powershell
git commit -m "Descrição das mudanças"
```

### Enviar mudanças
```powershell
git push
```

### Atualizar do GitHub
```powershell
git pull
```

## ⚠️ Importante

- **NUNCA** faça commit de:
  - `node_modules/` (já está no .gitignore)
  - `.expo/` (já está no .gitignore)
  - Arquivos de ambiente `.env`
  - Arquivos temporários

- **SEMPRE** faça commit de:
  - Código fonte (`.tsx`, `.ts`)
  - Arquivos de configuração (`package.json`, `app.json`)
  - Documentação (`README.md`)
  - Scripts úteis (`.ps1`)

## 🔐 Autenticação

Se pedir usuário/senha:
- Use um **Personal Access Token** (não sua senha)
- Crie em: GitHub → Settings → Developer settings → Personal access tokens

Ou use SSH:
```powershell
git remote set-url origin git@github.com:SEU_USUARIO/NOME_DO_REPOSITORIO.git
```


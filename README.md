# Te Declarei - Frontend

Frontend do sistema Te Declarei, uma plataforma para criação de cartões de amor, aniversário e pedidos de namoro.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **shadcn/ui** - Componentes de UI baseados em Radix
- **Framer Motion** - Animações fluidas
- **Lucide React** - Ícones modernos

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend rodando (ver `/back`)

## 🔧 Instalação

1. Entre na pasta do frontend:

```bash
cd frontv2
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🏃 Executando

### Desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:3001`

### Produção

```bash
npm run build
npm run start
```

## 📁 Estrutura do Projeto

```
src/
├── app/                      # App Router (páginas)
│   ├── auth/                 # Página de login/registro
│   ├── create/[templateType] # Editor de templates
│   ├── profile/              # Perfil do usuário
│   ├── public-templates/     # Galeria de templates públicos
│   ├── templates/            # Meus templates
│   ├── view/[shareToken]/    # Visualização de template
│   ├── globals.css           # Estilos globais
│   ├── layout.tsx            # Layout raiz
│   └── page.tsx              # Página inicial
├── components/               # Componentes reutilizáveis
│   ├── ui/                   # Componentes shadcn/ui
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   └── tabs.tsx
│   ├── footer.tsx
│   ├── navbar.tsx
│   └── particle-background.tsx
├── contexts/                 # Contextos React
│   └── auth-context.tsx      # Autenticação
└── lib/                      # Utilitários
    ├── api.ts                # Chamadas à API
    └── utils.ts              # Funções auxiliares
```

## 🎨 Páginas

### Home (`/`)
- Hero section com animações
- Cards de tipos de templates
- Seções de features, como funciona e galeria
- Call to action

### Autenticação (`/auth`)
- Login e registro com tabs
- Validação de formulários
- Integração com JWT

### Meus Templates (`/templates`)
- Lista de templates do usuário
- Ações: editar, copiar, excluir, compartilhar
- Criação de novos templates

### Templates Públicos (`/public-templates`)
- Galeria de templates públicos
- Filtro por tipo (amor, aniversário, proposta)
- Busca por texto
- Copiar templates para sua conta

### Editor (`/create/[templateType]`)
- Canvas drag-and-drop
- Adicionar textos, fotos e botões
- Personalizar cores e gradientes
- Configurar efeitos de partículas
- Upload de imagens

### Visualização (`/view/[shareToken]`)
- Visualização pública de templates
- Efeitos de partículas
- Botões interativos (inclusive o que foge!)
- Celebração com confetti

### Perfil (`/profile`)
- Editar nome e avatar
- Desativar conta

## 🔌 Integração com Backend

O frontend se comunica com o backend através da camada `lib/api.ts`:

```typescript
// Autenticação
authApi.login({ email, password })
authApi.register({ email, password, name })

// Templates
templatesApi.getAll(token)
templatesApi.create(token, data)
templatesApi.update(token, id, data)
templatesApi.delete(token, id)

// Templates Públicos
publicTemplatesApi.getAll(type?)
publicTemplatesApi.getById(id)

// Uploads
uploadsApi.upload(token, file, folder)
```

## 🎭 Recursos

- ✅ Autenticação JWT com persistência
- ✅ Editor drag-and-drop
- ✅ Upload de imagens
- ✅ Compartilhamento via link
- ✅ Efeitos de partículas animadas
- ✅ Botão que foge (para propostas)
- ✅ Celebração com confetti
- ✅ Design responsivo
- ✅ Animações fluidas
- ✅ Tema rosa/roxo romântico

## 📱 Responsividade

O design é totalmente responsivo:
- Mobile: Menu hambúrguer, layout em coluna
- Tablet: Layout adaptativo
- Desktop: Sidebar + área de trabalho

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

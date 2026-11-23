# Nutridash

Dashboard de nutrição em React, convertido a partir do protótipo HTML original
em `../Nutridash`. Toda a estilização foi migrada para Tailwind CSS (com daisyUI
v5 como plugin) e a UI foi quebrada em componentes reutilizáveis.

## Stack

- Vite 6 + React 19 + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- daisyUI v5 (plugin do Tailwind)
- @phosphor-icons/react para os ícones
- ESLint 9 (flat config) + typescript-eslint

## Estrutura

```text
src/
├── components/
│   ├── cards/      # AddMealCard, TotalMealsCard
│   ├── forms/      # FormField
│   ├── layout/     # Sidebar, SidebarBrand, SidebarItem, Header, SimpleHeader
│   ├── macros/     # MacroStat, MacroStatsBar
│   ├── meals/      # MealActionButton, MealFab, MealsList/Table…
│   └── modal/      # AddMealModal, AddFoodModal e suas sub-partes
├── constants/      # MEAL_CATEGORIES, NAV_ITEMS
├── context/        # AuthContext
├── hooks/          # useMealModal
├── layouts/        # AppLayout
├── lib/            # cliente HTTP axios (api) e getApiError
├── pages/          # DashboardPage, DietFood, LoginPage
├── routes/         # Router e ProtectRoute
├── services/       # chamadas à API (foodService, mealService)
├── styles/         # tailwind + tema sinutre
├── types/          # tipos de domínio (food, meal, user)
├── utils/          # formatação e helpers de data e números (date, number)
├── App.tsx
└── main.tsx
```

## Scripts

```bash
npm install     # instala dependências
npm run dev     # servidor de desenvolvimento (vite)
npm run build   # build de produção (tsc -b + vite build)
npm run lint    # ESLint em todo o projeto
npm run preview # preview do build
```

## Tema

O tema customizado `sinutre` (paleta verde) está definido em
`src/styles/theme.css` usando a sintaxe `@plugin 'daisyui/theme'` do daisyUI v5.

---

## Melhorias e Correções no Código Base (Frontend e Backend)

Antes da implementação das novas funcionalidades do Projeto Final, foi realizada uma refatoração completa no código-base dos dois repositórios (`sinutre-frontend` e `sinutre-backend`) para melhorar a organização, eliminar código morto e corrigir defeitos pré-existentes:

> **Documentação detalhada (Notion):** Para mais detalhes técnicos (Melhorias 1 a 5), acesse o registro completo no Notion: [Ver detalhamento das melhorias](https://app.notion.com/p/Melhorias-no-c-digo-existente-Sinutre-realizadas-antes-das-adi-es-41bc373854db809b9883f0757dd4b96c?source=copy_link).

### 1. Limpeza de arquivos duplicados, código morto e consolidação de rotas (Frontend)
- **Problema:** O frontend possuía pastas/arquivos duplicados sem uso (`src/contexts/AuthContext.tsx` e `src/routes/ProtectedRoute.tsx`), dados mockados obsoletos (`src/data/mockData.ts`), uma função `apiFetch` não utilizada em `src/lib/api.ts`, comentários de código morto e dois blocos idênticos de `<ProtectedRoute><AppLayout /></ProtectedRoute>` em `src/routes/index.tsx`.
- **O que foi feito:**
  - Removidos os arquivos/pastas não utilizados (`src/contexts/`, `src/routes/ProtectedRoute.tsx` e `src/data/mockData.ts`).
  - Removida a função redundante `apiFetch` em `src/lib/api.ts`, padronizando todas as chamadas HTTP no cliente `axios` (`api`).
  - Removidos comentários mortos e props sem uso (`onSave` em `AddMealModal` e `DashboardPage`, comentários em `Sidebar.tsx` e `mealCategories.ts`).
  - Unificadas as rotas autenticadas (`/`, `/foods`) sob um único bloco `<ProtectedRoute><AppLayout /></ProtectedRoute>` em `src/routes/index.tsx`.

### 2. Correção das regras de Hooks (`B3`), padronização de serviços e unificação de tipos (Frontend)
- **Problema:** `DashboardPage.tsx` e `AddMealModal.tsx` possuíam um `return` condicional antes das chamadas de Hooks (`useState`, `useEffect`, `useMemo`, `useMealModal`), gerando 9 erros no ESLint (`react-hooks/rules-of-hooks`) e risco de quebra em runtime. Além disso, `DashboardPage.tsx` chamava `api.get('/meals')` diretamente em vez de usar `mealService.ts`, e havia tipos duplicados entre `src/types/meal.ts` e `src/types/mealSummary.ts`.
- **O que foi feito:**
  - Movidos todos os Hooks para o topo de `DashboardPage.tsx` e `AddMealModal.tsx`.
  - Adicionado reset/sincronização de estado via `useEffect` em `AddMealModal.tsx` e transformados os inputs de `MealMetadataForm.tsx` em controlados (`value=...`), evitando dados residuais ao alternar categorias de refeição.
  - Centralizada a busca de refeições em `getMeals()` dentro de `src/services/mealService.ts`.
  - Unificadas as interfaces `Meal`, `MealItem` e `CreateMealPayload` em `src/types/meal.ts`, removendo a duplicata `src/types/mealSummary.ts`.

### 3. Modularização em camadas (`Routes → Controllers → Services`) e tratamento global de erros (`B1`) (Backend)
- **Problema:** No Express 4, erros lançados em rotas `async` (como o `throw` ao cadastrar refeição com alimento inexistente ou falhas do Prisma) não eram capturados e derrubavam o servidor. Além disso, `food.routes.ts` misturava rota e queries Prisma sem controller/service, `auth.me.ts` estava isolado em um arquivo separado de `auth.controller.ts` e os arquivos em `src/dto/` não estavam sendo utilizados.
- **O que foi feito:**
  - Criado `src/middlewares/error.middleware.ts` com `HttpError` (com suporte opcional a `fields`), `asyncHandler` e `errorHandler` registrado ao final de `src/app.ts`.
  - Criada a camada `src/services/` (`food.service.ts`, `meal.service.ts`, `auth.service.ts`) separando regras de negócio e queries Prisma da camada HTTP.
  - Criado `src/controllers/food.controller.ts` e enxugado `src/routes/food.routes.ts`.
  - Consolidada a função `me` em `src/controllers/auth.controller.ts`, removendo `src/controllers/auth.me.ts`.
  - Ativados e alinhados os DTOs em `src/dto/` (`foodDTO.ts`, `mealDTO.ts`, `mealSummaryDTO.ts`) e envolvidas todas as rotas assíncronas com `asyncHandler`.

### 4. Correções de consultas (`B4`, `B5`), preservação de histórico (`B6`) e integridade em refeições (Backend)
- **Problema:** `GET /foods` aplicava `take: 10` fixo mesmo sem busca (ocultando alimentos após o 10º); `GET /meals` recalculava os totais nutricionais a partir da tabela `Food` atual em vez de usar os valores históricos gravados em `MealFood`; `createMeal` não validava categoria, data, itens vazios ou gramas inválidas e falhava quando o mesmo `foodId` era enviado mais de uma vez.
- **O que foi feito:**
  - Em `src/services/food.service.ts`, aplicado o filtro por nome e o limite `take: 10` apenas quando há termo de busca não vazio (`B4`), além de deixar preparado o ponto de ajuste `mode: 'insensitive'` para o uso com PostgreSQL (`B5`).
  - Em `src/services/meal.service.ts`, corrigido `listMeals` para somar diretamente `foodG`, `calories`, `carbs`, `protein` e `fat` armazenados em `MealFood` (`B6`), preservando o histórico nutricional das refeições antigas.
  - Em `createMeal`, adicionadas validações explícitas com `HttpError(400, ...)` para `type` (usando `MEAL_CHOICES`), `eatTime`, lista `items` não vazia e `grams > 0`, além da consolidação de `foodId` duplicados antes da transação.

### 5. Correções de data (`B2`), tema (`B7`), arredondamento (`B8`) e tratamento de erros na interface (Frontend)
- **Problema:** O cálculo de calorias do dia em `DashboardPage.tsx` comparava `getDay()` (dia da semana, 0–6) em vez de `getDate()`; `MacroStat.tsx` e `DashboardPage.tsx` usavam cores fixas (`bg-red-700`, `text-gray-500`) que não acompanhavam temas; `MacroStatsBar.tsx` sinalizava erro com `<` (pintando de vermelho quando igual à meta); cálculos em ponto flutuante exibiam dízimas na tela (ex.: `5.800000000000001 g`); e os modais não exibiam mensagens de erro retornadas pela API.
- **O que foi feito:**
  - Criados os helpers `isSameLocalDay` e `isSameLocalMonth` em `src/utils/date.ts` e corrigido o filtro diário em `DashboardPage.tsx` (`B2`).
  - Substituídas as cores fixas por tokens semânticos do tema daisyUI (`bg-error`, `text-error-content`, `text-base-content/60`) em `MacroStat.tsx` e `DashboardPage.tsx` (`B7`), e ajustada a condição de meta ultrapassada para `>` em `MacroStatsBar.tsx`.
  - Criado o helper `formatNumber` em `src/utils/number.ts` e aplicado em `MacroStat`, `MealMacrosSummary`, `MealItemsTable`, `MealsTableRow` e `MealListItem` (`B8`).
  - Implementado `getApiError` em `src/lib/api.ts` e adicionado tratamento de erro com feedback visual (`alert alert-error`) e estado de carregamento em `AddMealModal.tsx` e `AddFoodModal.tsx`.
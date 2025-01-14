# Saber AMM Interface

Interfaz de usuario para Saber, un automated market maker para trading de pares de activos estables en Solana.

## Requisitos del Sistema

- Node.js v[20.17.0]
- PNPM v[9.15.2]
- Next.js v[15.1.4]

## Tecnologías Principales

- **Framework**: Next.js 13+ (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Blockchain**: Solana Web3.js
- **Estado**: React Hook Form, SWR

## Estructura del Proyecto
plaintext
src/
├── app/ # App Router de Next.js
│ ├── page.tsx # Página principal
│ ├── not-found.tsx # Página 404 personalizada
│ └── gov/ # Rutas de gobernanza
├── components/ # Componentes React
│ └── saber/
│ └── tribeca/
├── hooks/ # Custom hooks
├── types/ # Definiciones de TypeScript
└── utils/ # Utilidades y helpers


## Configuración

El proyecto utiliza varias configuraciones importantes:

- **Webpack**: Configurado con polyfills para compatibilidad con Web3
- **Aliases**: `@/` configurado para apuntar a `src/`
- **CSP**: Políticas de seguridad de contenido configuradas
- **Favicon**: Generación automática de favicons

## Scripts Disponibles

# Desarrollo

```bash
pnpm run dev
```

# Build

```bash
pnpm run build
```

# Deploy

```bash
pnpm run deploy
```

Analysys

```bash
ANALYZE=true pnpm run build
pnpm run analyze
```


## Características Principales

- Soporte completo para Solana Web3
- Integración con wallets
- Sistema de rutas dinámicas
- Carga dinámica de componentes
- Manejo de estado global
- Soporte para múltiples pools de liquidez
- Sistema de filtrado y ordenamiento
- Estadísticas en tiempo real



# Web Pública - Inmobiliaria

Sitio web público para visualizar propiedades y gestionar consultas.

## Estructura

- **Inicio**: Barra de búsqueda, filtros por tipo de propiedad y operación, propiedades destacadas
- **Comprar**: Listado de propiedades en venta
- **Alquiler**: Listado de propiedades en alquiler
- **Alquiler Temporario**: Listado de propiedades en alquiler temporario
- **Vender**: Formulario para consultas de propiedades a vender
- **Contactanos**: Formulario de contacto + datos de la inmobiliaria

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Redux Toolkit
- Axios
- React Router v6
- React Icons

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

El servidor levanta en `http://localhost:3003`

## Build

```bash
npm run build
```

## API

Se conecta a `http://localhost:8000` (backend PHP)

Endpoints utilizados:
- `GET /properties` - Listado de propiedades
- `GET /properties/featured` - Propiedades destacadas
- `GET /catalog/property-types` - Tipos de propiedades
- `GET /catalog/operation-types` - Tipos de operaciones
- `POST /inquiries` - Crear consulta de venta
- `POST /contact` - Enviar mensaje de contacto

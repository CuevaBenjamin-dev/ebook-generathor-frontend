# Frontend

Interfaz Astro del Generador de eBooks IA.

```bash
npm install
cp .env.example .env
npm run dev
```

El frontend consume `PUBLIC_API_BASE_URL` y nunca llama directamente a OpenAI.

En Vercel, configura `PUBLIC_API_BASE_URL` con la URL publica HTTPS del backend, por ejemplo:

```env
PUBLIC_API_BASE_URL=https://api-tu-dominio.com/api/v1
```

La vista previa estática usa `/ebooks/view?id=UUID_DEL_EBOOK`.

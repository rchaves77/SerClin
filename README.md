# Instituto SerClin — site institucional

Site multipágina em português para o Instituto SerClin, com caminhos B2C e B2B separados. As rotas incluem Início, Famílias, Empresas, Avaliação Neuropsicológica, Planos, Contato e uma página de confirmação não indexável.

## Stack e rotas

- React, TypeScript, Vite e Tailwind CSS; conteúdo público estático, sem backend próprio ou banco de dados.
- `scripts/prerender.mjs` renderiza cada rota para HTML no build, preservando conteúdo e metadados antes de JavaScript.
- O formulário empresarial usa Salesforce Web-to-Lead. O caminho para Famílias é pelo WhatsApp; os dados de consentimento acompanham a descrição enviada ao formulário.
- `client/public/manus-routes.json`, `sitemap.xml`, `robots.txt`, favicon, logo e 404 são mantidos no projeto.

## Desenvolvimento

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
pnpm preview
```

`pnpm build` executa o pré-render e gera a saída estática em `dist/`. A configuração `vercel.json` publica esse diretório sem fallback catch-all, para que caminhos desconhecidos continuem recebendo 404.

O site contém somente os serviços, condições e preços autorizados para divulgação. Não submeta o formulário de produção como parte de verificações técnicas.

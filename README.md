# Mapa Amaré | Praia do Ervino

Mapa colaborativo de imóveis da Praia do Ervino (São Francisco do Sul/SC).

## Publicar gratuitamente com GitHub Pages

1. Criar repositório público no GitHub, por exemplo `mapa-amare-ervino`.
2. Colocar na raiz do repositório os arquivos `index.html` e `.nojekyll`.
3. Abrir Settings > Pages, escolher Deploy from a branch, branch `main`, pasta `/ (root)` e salvar.
4. Depois que a publicação terminar, o endereço será do tipo `https://SEU-USUARIO.github.io/mapa-amare-ervino/`.

## Acesso da equipe

O mapa utiliza autenticação e tabelas no banco em nuvem do projeto.
O e-mail de administradora previsto é `imoveisamare@gmail.com`.
Visitantes podem consultar; corretores convidados precisam criar conta e entrar.
A confirmação de e-mail pode exigir adicionar o domínio público nas configurações
de URLs de redirecionamento do serviço de autenticação.

## Observações

- Hospedagem gratuita do GitHub Pages não inclui banco de dados; a sincronização
  depende do backend Supabase/Lovable Cloud, que pode ter limites de uso gratuitos.
- O carregamento das 19.164 parcelas requer conexão à base existente.
- O mapa de satélite e ruas depende dos termos e da disponibilidade da Esri.
- O cadastro e a edição por terceiros exigem testar login, permissões RLS
  e sincronização após a publicação; publicar o site não confirma esses testes.
- Não inclua no repositório arquivos com senhas ou chaves secretas.

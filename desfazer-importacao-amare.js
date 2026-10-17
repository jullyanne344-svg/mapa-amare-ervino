/* Amaré: remoção controlada SOMENTE dos imóveis importados do My Maps
   em 17/10/2026 (prefixo único codigo_externo: MYMAPS-AMARE:20261017:).
   Não interfere na geometria dos 19.164 lotes nem em cadastros de outra origem.
   A exclusão requer conta administradora e duas confirmações.
*/
(() => {
  'use strict';
  const prefixo = 'MYMAPS-AMARE:20261017:';
  function iniciar() {
    const ancora = document.getElementById('migrateBtn');
    if (!ancora || typeof db === 'undefined' || typeof isAdmin !== 'function' || typeof loadRecords !== 'function') {
      console.warn('Amaré: painel ou banco de dados ainda não disponíveis.');
      return;
    }
    if (document.getElementById('desfazerImportacaoAmare')) return;

    const botao = document.createElement('button');
    botao.id = 'desfazerImportacaoAmare';
    botao.type = 'button';
    botao.className = 'danger';
    botao.textContent = '🗑 Desfazer importação do My Maps';
    ancora.parentElement.appendChild(botao);

    const aviso = document.createElement('p');
    aviso.className = 'mini';
    aviso.style.marginTop = '8px';
    aviso.setAttribute('role', 'status');
    ancora.parentElement.insertAdjacentElement('afterend', aviso);

    botao.addEventListener('click', async () => {
      if (!isAdmin()) {
        alert('Entre com a conta de administradora aprovada para excluir imóveis importados.');
        return;
      }
      botao.disabled = true;
      aviso.textContent = 'Conferindo quantos cadastros vieram dessa importação...';
      try {
        const filtro = prefixo + '%';
        const {count, error: erroContagem} = await db.from('imoveis')
          .select('id', {head:true, count:'exact'}).like('codigo_externo', filtro);
        if (erroContagem) throw erroContagem;
        if (!count) {
          aviso.textContent = 'Nenhum cadastro dessa importação foi encontrado. O mapa já está livre desses imóveis.';
          return;
        }
        if (!confirm(`Desfazer a importação do My Maps?\n\nSerão apagados ${count} imóveis identificados pelo código ${prefixo}\n\nOs 19.164 lotes cadastrais, usuários e outros imóveis serão preservados.\n\nEssa exclusão não pode ser desfeita automaticamente.`)) {
          aviso.textContent = 'Operação cancelada. Nenhum imóvel foi excluído.';
          return;
        }
        const digitado = prompt(`Para confirmar a exclusão desses ${count} imóveis, digite EXCLUIR (em letras maiúsculas):`);
        if (digitado !== 'EXCLUIR') {
          aviso.textContent = 'Operação cancelada. Nenhum imóvel foi excluído.';
          return;
        }
        aviso.textContent = `Excluindo os ${count} imóveis importados... Aguarde sem fechar a página.`;
        // O filtro é aplicado no próprio banco de dados. Ele NÃO afeta outras origens.
        const {error: erroRemocao} = await db.from('imoveis').delete()
          .like('codigo_externo', filtro);
        if (erroRemocao) throw erroRemocao;
        const {count: restantes, error: erroVerificacao} = await db.from('imoveis')
          .select('id', {head:true, count:'exact'}).like('codigo_externo', filtro);
        if (erroVerificacao) throw erroVerificacao;
        await loadRecords();
        aviso.textContent = restantes === 0
          ? `✅ Concluído! Os ${count} imóveis importados foram retirados. Os lotes cadastrais permanecem intactos.`
          : `⚠️ Restam ${restantes} imóveis dessa importação. Verifique as permissões do banco antes de tentar novamente.`;
      } catch (erro) {
        console.error('Erro ao desfazer importação:', erro);
        aviso.textContent = 'Não foi possível concluir: ' + (erro?.message || String(erro)) + '. Nenhum outro tipo de cadastro foi selecionado para exclusão.';
      } finally {
        botao.disabled = false;
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();

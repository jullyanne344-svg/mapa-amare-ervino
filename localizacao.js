
(() => {
  if (typeof L === 'undefined' || typeof map === 'undefined') return;

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.textContent = '📍 Minha localização';
  botao.title = 'Ativar GPS ou centralizar no mapa';
  botao.style.cssText = 'padding:9px 12px;cursor:pointer;background:white;color:#222;border:1px solid #aaa;border-radius:5px;font-weight:bold;';

  const parar = document.createElement('button');
  parar.type = 'button';
  parar.textContent = '✕ Parar GPS';
  parar.style.cssText = botao.style.cssText;
  parar.hidden = true;

  const barra = document.querySelector('.topbar');
  if (barra) {
    barra.prepend(parar);
    barra.prepend(botao);
  } else {
    const Controle = L.Control.extend({
      options: { position: 'topleft' },
      onAdd() {
        const caixa = L.DomUtil.create('div', 'leaflet-bar');
        caixa.append(botao, parar);
        L.DomEvent.disableClickPropagation(caixa);
        return caixa;
      }
    });
    map.addControl(new Controle());
  }

  const icone = L.divIcon({
    className: '',
    html: '<span style="display:block;width:18px;height:18px;background:#2189ff;border:3px solid white;border-radius:50%;box-shadow:0 0 0 6px #2189ff55;"></span>',
    iconSize: [24, 24], iconAnchor: [12, 12]
  });

  let acompanhamento = null;
  let ponto = null;
  let circulo = null;
  let centralizou = false;

  function desligar() {
    if (acompanhamento !== null) navigator.geolocation.clearWatch(acompanhamento);
    acompanhamento = null;
    if (ponto) map.removeLayer(ponto);
    if (circulo) map.removeLayer(circulo);
    ponto = circulo = null;
    centralizou = false;
    botao.disabled = false;
    botao.textContent = '📍 Minha localização';
    parar.hidden = true;
  }

  botao.addEventListener('click', () => {
    if (ponto) {
      map.setView(ponto.getLatLng(), Math.max(map.getZoom(), 17));
      return;
    }
    if (!navigator.geolocation || !window.isSecureContext) {
      alert('Abra o mapa em HTTPS e ative a localização do aparelho.');
      return;
    }
    if (acompanhamento !== null) return;
    botao.textContent = '⏳ Localizando...';
    parar.hidden = false;
    acompanhamento = navigator.geolocation.watchPosition(posicao => {
      const { latitude, longitude, accuracy } = posicao.coords;
      const local = [latitude, longitude];
      if (!ponto) ponto = L.marker(local, { icon: icone, interactive: false }).addTo(map);
      else ponto.setLatLng(local);
      if (!circulo) circulo = L.circle(local, { radius: accuracy, color: '#2189ff', fillOpacity: 0.1, interactive: false }).addTo(map);
      else { circulo.setLatLng(local); circulo.setRadius(accuracy); }
      botao.textContent = '🎯 Centralizar GPS';
      if (!centralizou) { map.setView(local, 17); centralizou = true; }
    }, erro => {
      desligar();
      alert(erro.code === 1 ? 'Permita o acesso à localização nas configurações do navegador.' : 'Não foi possível obter o GPS. Tente novamente.');
    }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 });
  });

  parar.addEventListener('click', desligar);
  window.addEventListener('pagehide', desligar);
})();

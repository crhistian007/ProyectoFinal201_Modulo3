
const markdownInput = document.querySelector("#markdown-input");
const markdownPreview = document.querySelector("#markdown-preview");


let history = [];
let historyIndex = -1;

function GuardarHistoria() {                                                         
    history.splice(historyIndex + 1);                                   
    history.push(markdownInput.value);
    historyIndex = history.length - 1;
}


function regresar() {                                                              
    if (historyIndex > 0) {
        historyIndex--;
        markdownInput.value = history[historyIndex];
        renderizarHtml();
    }
}


function adelantar() {                                                                 
    if (historyIndex < history.length - 1) {
        historyIndex++;
        markdownInput.value = history[historyIndex];
        renderizarHtml();
    }
}


window.addEventListener('keydown', (event) => {
    if ((event.ctrlKey ) && !event.shiftKey && event.key === 'z') {
        event.preventDefault();
        regresar();
    } else if ((event.ctrlKey ) && (event.key === 'y' || (event.shiftKey && event.key === 'Z'))) {
        event.preventDefault();
        adelantar();
    }
});

try {
    const contenidoGuardado = localStorage.getItem('markdownContent');
    if (contenidoGuardado) {
        const confirmar = confirm('Se encontró un contenido guardado previamente. ¿Deseas recuperarlo?');
        if (confirmar) {
            markdownInput.value = contenidoGuardado;
        }
    }
    // Guardar primer estado en el historial
    GuardarHistoria();
    renderizarHtml();

    // Crear botón de exportar
    const headerEl = document.querySelector('.header');
    const exportBtn = document.createElement('button');
    exportBtn.id = 'export-btn';
    exportBtn.textContent = 'Exportar HTML';
    exportBtn.style.marginLeft = '10px';
    headerEl.appendChild(exportBtn);

    // Evento de exportación
    exportBtn.addEventListener('click', () => {
        try {
            const htmlContent = markdownPreview.innerHTML;
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'documento.html';
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al exportar el HTML:', error);
            alert('Ocurrió un error al exportar el archivo.');
        }
    });
} catch (error) {
    console.error('Error al recuperar el autosave:', error);
    alert('Ocurrió un error al recuperar el contenido guardado.');
}



markdownInput.addEventListener("input", renderizarHtml);

function renderizarHtml(event) {
   try {

       GuardarHistoria();

       const markdownText = markdownInput.value;

       localStorage.setItem('markdownContent', markdownText);

       const htmlText = marked.parse(markdownText);
       markdownPreview.innerHTML = htmlText;
   } catch (error) {
       console.error('Error al procesar el Markdown:', error);
       alert('Ocurrió un error al procesar el Markdown.');
   }
}

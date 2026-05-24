/* 
 * =========================================================================
 * SCRIPT DE RADICACIÓN DE SOLICITUDES CIUDADANAS (INTEGRACIÓN CON MAKE)
 * Alcaldía Municipal de Springfield (Cundinamarca, Colombia)
 * Autor: Desarrollador Frontend Senior
 * =========================================================================
 */

// --- CONFIGURACIÓN DE INTEGRACIÓN ---
// URL del Webhook de Make para la automatización (Debe ser configurada por el usuario)
const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/0hcarb51cnl1z5o7o7evlmc9whtlap7d";

// --- SELECCIÓN DE ELEMENTOS DEL DOM ---
const form = document.getElementById('radicacionForm');
const submitBtn = document.getElementById('submitBtn');
const responseMsg = document.getElementById('responseMessage');
const descInput = document.getElementById('descripcion');
const charCountSpan = document.getElementById('ccount');
const fileInput = document.getElementById('archivos');
const dragZone = document.getElementById('dragZone');
const fileListContainer = document.getElementById('listaAdjuntos');

// Colección local para controlar los archivos seleccionados y validados
let selectedFilesArray = [];

// --- EVENTO: CONTADOR DE CARACTERES EN DESCRIPCIÓN ---
if (descInput) {
    descInput.addEventListener('input', () => {
        const textLength = descInput.value.length;
        charCountSpan.textContent = textLength;
        
        // Indicador visual de cumplimiento de longitud mínima
        if (textLength >= 20) {
            charCountSpan.style.color = "#16A34A"; // Verde
        } else {
            charCountSpan.style.color = "var(--color-accent-red)"; // Rojo/Alerta
        }
    });
}

// --- EVENTOS: DRAG & DROP PARA ARCHIVOS ---
if (dragZone && fileInput) {
    ['dragenter', 'dragover'].forEach(eventName => {
        dragZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dragZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dragZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dragZone.classList.remove('dragover');
        }, false);
    });

    dragZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFilesSelection(files);
    });

    fileInput.addEventListener('change', () => {
        handleFilesSelection(fileInput.files);
    });
}

// --- MANEJO Y VALIDACIÓN DE ARCHIVOS ---
function handleFilesSelection(filesList) {
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx'];
    const maxTotalSizeBytes = 4.5 * 1024 * 1024; // Límite total de 4.5 MB

    // Ocultar alertas previas para una interacción limpia
    responseMsg.style.display = 'none';

    for (let i = 0; i < filesList.length; i++) {
        const file = filesList[i];
        const extension = file.name.split('.').pop().toLowerCase();
        
        // Validación 1: Formato/Extensión
        if (!allowedExtensions.includes(extension)) {
            showInlineAlert(`El formato del archivo "${file.name}" no está permitido. Formatos soportados: PDF, JPG, JPEG, PNG, DOC, DOCX, XLS, XLSX.`, "error");
            return;
        }

        // Evitar adjuntar duplicados idénticos
        if (selectedFilesArray.some(f => f.name === file.name && f.size === file.size)) {
            continue;
        }

        // Calcular peso acumulado con este archivo propuesto
        const currentTotalSize = selectedFilesArray.reduce((acc, f) => acc + f.size, 0);
        if (currentTotalSize + file.size > maxTotalSizeBytes) {
            showInlineAlert(`No es posible agregar "${file.name}". El peso total de todos los archivos superaría el límite de 4.5 MB establecido (Peso actual: ${(currentTotalSize / (1024 * 1024)).toFixed(2)} MB).`, "error");
            return;
        }

        // Agregar a la colección local
        selectedFilesArray.push(file);
    }

    renderFileList();
}

// RENDERIZADO VISUAL DE LA LISTA DE ARCHIVOS
function renderFileList() {
    fileListContainer.innerHTML = '';
    
    selectedFilesArray.forEach((file, index) => {
        const li = document.createElement('li');
        li.className = 'file-item';
        
        const sizeReadable = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        
        li.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span><strong>${escapeHTML(file.name)}</strong> (${sizeReadable})</span>
            </div>
            <button type="button" onclick="removeSelectedFile(${index})" aria-label="Eliminar archivo adjunto">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Quitar
            </button>
        `;
        fileListContainer.appendChild(li);
    });
}

// ELIMINACIÓN DE UN ARCHIVO DE LA LISTA
window.removeSelectedFile = function(index) {
    selectedFilesArray.splice(index, 1);
    renderFileList();
    responseMsg.style.display = 'none';
};

// --- MÓDULO VISUAL DE NOTIFICACIONES ---
function showInlineAlert(message, type) {
    responseMsg.className = `response-message ${type}`;
    
    let iconHtml = '';
    if (type === 'success') {
        iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    } else {
        iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    }

    responseMsg.innerHTML = `${iconHtml}<div>${message}</div>`;
    responseMsg.style.display = 'flex';
}

// --- SANITIZACIÓN DE CARACTERES ESPECIALES ---
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// --- EVENTO: ENVÍO Y VALIDACIÓN DEL FORMULARIO ---
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        responseMsg.style.display = 'none';

        // 1. CAPTURA DE VALORES
        const nombresVal = document.getElementById('nombres_apellidos').value.trim();
        const tipoDocVal = document.getElementById('tipo_documento').value;
        const numDocVal = document.getElementById('numero_documento').value.trim();
        const correoVal = document.getElementById('correo').value.trim();
        const tipoSolVal = document.getElementById('tipo_solicitud').value;
        const asuntoVal = document.getElementById('asunto').value.trim();
        const descVal = document.getElementById('descripcion').value.trim();
        const aceptaDatosVal = document.getElementById('acepta_datos').checked;

        // 2. VALIDACIONES DE CAMPOS OBLIGATORIOS
        if (!nombresVal) {
            showInlineAlert("Por favor, escribe tus nombres y apellidos completos. Este campo es obligatorio.", "error");
            document.getElementById('nombres_apellidos').focus();
            return;
        }

        if (!tipoDocVal) {
            showInlineAlert("Selecciona el tipo de documento de identidad oficial.", "error");
            document.getElementById('tipo_documento').focus();
            return;
        }

        if (!numDocVal) {
            showInlineAlert("Por favor, ingresa el número de documento de identidad.", "error");
            document.getElementById('numero_documento').focus();
            return;
        }

        if (!correoVal) {
            showInlineAlert("Se requiere una dirección de correo electrónico para notificarte de manera oficial.", "error");
            document.getElementById('correo').focus();
            return;
        }

        // Validación de sintaxis básica y estructura del Email
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(correoVal)) {
            showInlineAlert("La dirección de correo electrónico ingresada no es válida. Ejemplo: nombre@correo.com", "error");
            document.getElementById('correo').focus();
            return;
        }

        if (!tipoSolVal) {
            showInlineAlert("Selecciona el tipo de solicitud para orientar tu trámite.", "error");
            document.getElementById('tipo_solicitud').focus();
            return;
        }

        if (!asuntoVal) {
            showInlineAlert("Por favor, escribe un asunto breve que resuma la solicitud.", "error");
            document.getElementById('asunto').focus();
            return;
        }

        if (!descVal || descVal.length < 20) {
            showInlineAlert(`La descripción detallada debe tener un mínimo de 20 caracteres para procesarse. (Redactados actualmente: ${descVal.length} caracteres).`, "error");
            document.getElementById('descripcion').focus();
            return;
        }

        if (!aceptaDatosVal) {
            showInlineAlert("Debes autorizar el tratamiento de datos personales conforme a la Ley 1581 de 2012 para radicar la solicitud.", "error");
            document.getElementById('acepta_datos').focus();
            return;
        }

        // 3. VALIDACIÓN ADICIONAL DE ARCHIVOS (PESO TOTAL)
        const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx'];
        const maxTotalSizeBytes = 4.5 * 1024 * 1024;
        let finalFilesWeight = 0;

        for (let file of selectedFilesArray) {
            const ext = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(ext)) {
                showInlineAlert(`El formato del archivo "${file.name}" no está permitido.`, "error");
                return;
            }
            finalFilesWeight += file.size;
        }

        if (finalFilesWeight > maxTotalSizeBytes) {
            showInlineAlert(`El peso total de todos los archivos adjuntos supera el límite permitido de 4.5 MB. (Límite máximo: ${(maxTotalSizeBytes / (1024 * 1024)).toFixed(2)} MB. Su peso total: ${(finalFilesWeight / (1024 * 1024)).toFixed(2)} MB).`, "error");
            return;
        }

        // 4. VERIFICACIÓN DE CONFIGURACIÓN DEL WEBHOOK DE MAKE (ESTRICTA, SIN SIMULADOR DE RADICADO FALSO)
        if (MAKE_WEBHOOK_URL === "PEGAR_AQUI_LA_URL_DEL_WEBHOOK_DE_MAKE" || MAKE_WEBHOOK_URL.trim() === "" || MAKE_WEBHOOK_URL.startsWith("PEGAR_AQUI")) {
            showInlineAlert("Falta configurar la URL del webhook de Make en el archivo script.js.", "error");
            return;
        }

        // 5. CAMBIO ESTADO DEL BOTÓN DE ENVÍO
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
            Enviando solicitud...
        `;

        // Generar style dinámico para spinner si no existe
        if (!document.getElementById('spin-style-def')) {
            const spinStyle = document.createElement('style');
            spinStyle.id = 'spin-style-def';
            spinStyle.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
            document.head.appendChild(spinStyle);
        }

        // 6. CONSTRUCCIÓN DEL FORM DATA DIRECTO
        const formData = new FormData(form);

        // Eliminamos el campo original "archivos" para poblarlo manualmente de manera controlada y evitar duplicados o vacíos
        formData.delete("archivos");

        // Adjuntar archivos desde la lista de control local bajo el mismo campo repetible
        selectedFilesArray.forEach((file) => {
            formData.append("archivos", file, file.name);
        });

        // 7. AGREGAR CAMPOS AUTOMÁTICOS COMPLEMENTARIOS
        formData.append('fecha_envio', new Date().toISOString());
        formData.append('canal', 'Web institucional');
        formData.append('municipio', 'Municipio de Springfield');
        formData.append('estado_inicial', 'Recibido');
        formData.append('origen', 'Formulario web GitHub Pages');

        // Id de cliente temporal robusto
        let randomUuid;
        try {
            randomUuid = crypto.randomUUID();
        } catch (uuidErr) {
            randomUuid = 'temp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
        }
        formData.append('id_cliente_temporal', randomUuid);

        formData.append('user_agent', navigator.userAgent);
        formData.append('url_origen', window.location.href);
        formData.append('idioma_navegador', navigator.language);

        // Resumen base estructurado con datos obligatorios
        const dependenciaSugeridaText = document.getElementById('dependencia_sugerida').value;
        const resumenText = `${tipoSolVal} sobre ${asuntoVal}. Solicitante: ${nombresVal}. Dependencia sugerida: ${dependenciaSugeridaText}.`;
        formData.append('resumen_base', resumenText);

        // 8. ENVÍO REAL MEDIANTE FETCH
        try {
            const response = await fetch(MAKE_WEBHOOK_URL, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("HTTP Status Error: " + response.status);
            }

            // Procesar respuesta JSON de Make
            let responseData = null;
            try {
                responseData = await response.json();
            } catch (jsonErr) {
                // El webhook puede no devolver un JSON estructurado, manejamos la respuesta correctamente
                console.info("La respuesta del Webhook de Make no es de tipo JSON, se asume proceso correcto estándar.");
            }

            // Evaluar número de radicado devuelto por Make
            if (responseData && responseData.radicado) {
                showInlineAlert(`Su solicitud fue radicada exitosamente con el número: <strong>${escapeHTML(responseData.radicado)}</strong>`, "success");
            } else {
                showInlineAlert("Su solicitud fue recibida correctamente. El número de radicado será enviado al correo registrado.", "success");
            }

            // LIMPIAR FORMULARIO TRAS ENVÍO EXITOSO
            form.reset();
            selectedFilesArray = [];
            renderFileList();
            if (charCountSpan) {
                charCountSpan.textContent = "0";
                charCountSpan.style.color = "var(--color-text-muted)";
            }

        } catch (error) {
            console.error("Error al enviar la solicitud al Webhook:", error);
            showInlineAlert("No fue posible enviar la solicitud. Por favor intente nuevamente o comuníquese con la Alcaldía.", "error");
        } finally {
            // REACTIVAR BOTÓN AL CONCLUIR
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            
            // Scroll suave hacia la zona de alerta de respuesta
            responseMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

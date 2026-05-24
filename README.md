# Web Municipal del Municipio de Springfield 🏛️
### Portal de Trámites y Radicación Electrónica de Solicitudes (Cundinamarca, Colombia)

Este proyecto académico simula y demuestra el diseño y funcionamiento de un portal institucional moderno, completamente funcional y preparado para implementaciones reales de automatización de flujos de trabajo (*workflows*). 

Está específicamente optimizado para conectarse con **Make** (anteriormente Integromat) mediante un Webhook que recibe y procesa peticiones ciudadanas, las almacena en **Google Sheets** y envía alertas personalizadas de confirmación a través de **Gmail**.

---

## 📂 Contenido del Proyecto

El sitio web está estructurado bajo el paradigma de **sitio estático puro** (Pure Vanilla HTML, CSS y JS sin dependencias, ni frameworks de compilación), lo que permite que sea sumamente ágil y compatible con cualquier hosting estático gratuito:

*   `index.html`: Página principal o inicio institucional de la Alcaldía de Springfield (Cundinamarca). Incluye secciones clave de contacto, trámites destacados, noticias de la administración y enlaces rápidos orientados a la ciudadanía.
*   `contacto.html`: Formulario oficial separado para la radicación formal de PQRS-D, estructurado con accesibilidad en mente, validaciones en tiempo real y soporte para adjuntar múltiples archivos.
*   `styles.css`: Hoja de estilos con enfoque geométrico contemporáneo, tipografía clara de sistema, foco visual delimitado, responsive y con alta legibilidad en pantallas móviles y computadoras.
*   `script.js`: Controlador principal de validaciones y de envío dinámico de formularios mediante la API Fetch al Webhook de Make.

---

## 🚀 Cómo Abrir el Sitio Localmente

Como es un sitio web estático puro, abrirlo es sumamente sencillo:

1.  **Descarga los archivos** o clona el repositorio en tu computador local.
2.  Haz doble clic en el archivo `index.html` para abrir la página principal directamente en cualquier navegador de internet actual (Google Chrome, Microsoft Edge, Mozilla Firefox o Safari).
3.  ¡Listo! Puedes navegar libremente entre el Home y la página de Radicación.

*Opcional para desarrollo activo:* Puedes abrir la carpeta del proyecto en editores de código como **Visual Studio Code** y usar la extensión **Live Server** para previsualizar los cambios en tiempo real en entorno local.

---

## 🌐 Cómo Publicarlo en GitHub Pages

GitHub Pages brinda la infraestructura ideal para alojar este portal gratis:

1.  Crea un nuevo repositorio público en tu cuenta de GitHub (ej. `municipio-springfield`).
2.  Sube los archivos principales del proyecto (`index.html`, `contacto.html`, `styles.css`, `script.js` y `README.md`) directamente a la rama principal (`main` o `master`).
3.  Ingresa a los **Settings** (Configuración) de tu repositorio en GitHub.
4.  En el menú lateral izquierdo, haz clic en **Pages**.
5.  En la sección *Build and deployment*, bajo *Source*, selecciona **Deploy from a branch**.
6.  En el menú desplegable del campo *Branch*, selecciona tu rama principal (`main` o `master`), asegúrate de que esté seleccionada la carpeta de la raíz `/(root)` y haz clic en **Save**.
7.  Transcurridos un par de minutos, GitHub generará tu enlace público (por ejemplo: `https://tu-usuario.github.io/municipio-springfield/`).

---

## 🔌 Integración Paso a Paso con Make

El formulario envía toda la información recopilada directamente a un Webhook personalizado de Make. Para enlazar tu formulario sigue estos pasos:

### 1. Pegar la URL del Webhook de Make
Abre el archivo `script.js` con un editor de texto y localiza la constante en la parte superior:

```javascript
const MAKE_WEBHOOK_URL = "PEGAR_AQUI_LA_URL_DEL_WEBHOOK_DE_MAKE";
```

Reemplaza `"PEGAR_AQUI_LA_URL_DEL_WEBHOOK_DE_MAKE"` por la dirección del Webhook público que te asigne Make al crear tu escenario (Scenario). Guarda los cambios en tu archivo y súbelos a tu servidor/GitHub.

### ❓ ¿Qué hacer si aparece el error de Webhook no configurado?
Si intentas presionar el botón de envío sin cambiar el placeholder por una URL real, el sistema mostrará inmediatamente el mensaje en color rojo:
> **"Falta configurar la URL del webhook de Make en el archivo script.js."**

Para remediarlo, asegúrate de crear el Webhook en tu cuenta de Make e insertarlo en el archivo JavaScript. Este comportamiento evita el envío de datos fallidos y las simulaciones de radicación académicas irreales.

---

## 📝 Campos Enviados por el Formulario

Cuando se envía el formulario con éxito, Make recibe un objeto de tipo `FormData` que incluye:

### Campos completados por el solicitante:
*   `nombres_apellidos`: Nombres y apellidos completos del solicitante.
*   `tipo_documento`: Tipo de identificación (ej. Cédula de Ciudadanía, etc.).
*   `numero_documento`: Número de identificación del ciudadano.
*   `correo`: Correo electrónico donde se remitirán las alertas.
*   `telefono`: Número telefónico de contacto.
*   `direccion`: Dirección de domicilio del ciudadano.
*   `barrio_vereda`: Sector o vereda del municipio donde reside.
*   `tipo_solicitud`: Tipo de petición (Petición, Queja, Reclamo, Sugerencia, Denuncia, Solicitud de información, Otro).
*   `dependencia_sugerida`: Dependencia sugerida por el ciudadano (Atención al Ciudadano, Planeación, Hacienda, Gobierno, Salud, Educación, Obras Públicas, No sabe).
*   `asunto`: Resumen verbal corto de la PQRS-D.
*   `descripcion`: Detalle exhaustivo de la situación (mínimo 20 caracteres).
*   `medio_respuesta`: Medio primario para notificaciones oficiales (Correo electrónico, Teléfono, Dirección física).
*   `acepta_datos`: Indica si el ciudadano aceptó los términos legales ("S").

### Campos automáticos complementarios:
Además de lo ingresado por el ciudadano, el código genera y envía de manera transparente excelentes parámetros de auditoría y análisis estadístico:
*   `fecha_envio`: Fecha y hora exacta de presentación en formato estándar ISO 8601.
*   `canal`: `"Web institucional"`.
*   `municipio`: `"Municipio de Springfield"`.
*   `estado_inicial`: `"Recibido"`.
*   `origen`: `"Formulario web GitHub Pages"`.
*   `id_cliente_temporal`: Identificador único UUID de trazabilidad generado por el navegador mediante `crypto.randomUUID()`.
*   `user_agent`: Cabecera del agente de usuario del navegador.
*   `url_origen`: URL exacta desde la cual se realizó el envío.
*   `idioma_navegador`: Idioma preferente del navegador del visitante.
*   `resumen_base`: Texto compuesto dinámicamente que facilita la vista preliminar del gestor (ej. *"Petición sobre Alumbrado público. Solicitante: Juan Pérez. Dependencia sugerida: Obras Públicas."*)

### Adjuntar Archivos y Reglas de Peso
*   **Archivos admitidos:** Soporta adjuntar múltiples soportes documentales de forma simultánea.
*   **Formatos válidos de archivo:** Se permite adjuntar únicamente documentos y formatos de oficina estándar: **`PDF`**, **`JPG`**, **`JPEG`**, **`PNG`**, **`DOC`**, **`DOCX`**, **`XLS`**, **`XLSX`**.
*   **Límite de tamaño:** El peso máximo **total combinado de todos los archivos** adjuntos no debe superar los **`4.5 MB`**. Esta limitación está garantizada bajo JavaScript para cumplir perfectamente con los umbrales estándar de payload de Make y el tráfico óptimo de red.

Lado de Make: Los archivos adjuntos se transmiten de manera pura bajo un campo repeatable llamado:
`archivos`

---

## 📤 Respuesta Esperada desde Make

Al final de tu flujo de automatización (después de agregar las filas a Google Sheets y despachar notificaciones institucionales), puedes configurar el módulo **Webhook Response** de Make para devolver una estructura de éxito HTTP 200 en formato JSON:

```json
{
  "ok": true,
  "radicado": "SPR-2026-000001",
  "mensaje": "Solicitud registrada correctamente"
}
```

*   Si Make responde con el campo `radicado`, el formulario borrará sus campos y presentará el mensaje verde: 
    > **"Su solicitud fue radicada exitosamente con el número: SPR-2026-000001"**
*   Si Make responde con éxito, pero tu flujo no define un número de radicado personalizado dentro del JSON, el sistema mostrará la notificación predeterminada:
    > **"Su solicitud fue recibida correctamente. El número de radicado será enviado al correo registrado."**

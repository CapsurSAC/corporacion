import ComputerIcon from '@mui/icons-material/Computer';
import React from 'react';
import { ChatInterface, KnowledgeItem } from '@/components/capacitado/chat-interface';

const INFORMATICA_KNOWLEDGE: KnowledgeItem[] = [
    {
        keywords: ['aula virtual', 'plataforma', 'moodle', 'chamilo', 'acceso', 'link', 'url'],
        title: 'Aulas Virtuales y Plataformas Educativas',
        answer: `En **Grupo CAPSUR**, las plataformas virtuales están asignadas por instituto:
- **Acceso:** Cada comercio o instituto cuenta con su enlace directo a su aula virtual (configurado en el catálogo corporativo).
- **Usuario Inicial:** Generalmente es el número de **DNI** del estudiante.
- **Contraseña Inicial:** Se genera automáticamente al matricularse (usualmente el DNI o una clave temporal enviada por correo).
- **Disponibilidad:** El aula virtual opera 24/7 y contiene grabaciones de clases, material de lectura y evaluaciones.`,
    },
    {
        keywords: ['contraseña', 'clave', 'olvido', 'bloqueo', 'recuperar', 'reset'],
        title: 'Recuperación y Reseteo de Contraseñas',
        answer: `Si un alumno o docente no puede ingresar al aula virtual:
1. **Opción Autoservicio:** Indicarle pulsar *"¿Olvidó su contraseña?"* en la pantalla de inicio del aula virtual para recibir un enlace en su correo.
2. **Soporte TI Directo:** Si no llega el correo, el personal de TI puede resetear la contraseña desde el panel de administración a la clave estándar temporal *"Capsur2026*" y forzar el cambio en el primer inicio.`,
    },
    {
        keywords: ['incidencia', 'ticket', 'error', 'falla', 'caida', 'sistema'],
        title: 'Reporte de Incidencias Técnicas',
        answer: `Protocolo para registrar incidencias de TI:
- **Datos Requeridos:** Captura de pantalla del error, URL exacta donde ocurre, usuario afectado y navegador utilizado.
- **Canal de TI:** Se registra en la bitácora o canal interno de soporte de Sistemas de Grupo CAPSUR.
- **Prioridad:**
  - *Alta (SLA 30 min):* Caída de aula virtual durante una clase en vivo.
  - *Media (SLA 4 hrs):* Error de visualización de material o subida de tareas.
  - *Baja (SLA 24 hrs):* Actualización de datos de perfil o solicitudes no urgentes.`,
    },
    {
        keywords: ['requisito', 'tecnico', 'internet', 'navegador', 'zoom', 'meet', 'camara'],
        title: 'Requisitos Técnicos para Clases',
        answer: `Para garantizar una experiencia formativa óptima se recomienda a los usuarios:
- **Navegador:** Google Chrome, Mozilla Firefox o Microsoft Edge (última versión).
- **Conexión:** Velocidad mínima de descarga de 10 Mbps para transmisión de video en vivo.
- **Aplicaciones:** Zoom o Google Meet instalado para las sesiones sincrónicas.
- **Dispositivos:** Compatible con laptops, PCs de escritorio, tablets y smartphones Android/iOS.`,
    },
];

export default function InformaticaPage() {
    return (
        <ChatInterface
            areaKey="informatica"
            areaTitle="Informática"
            botName="Asistente de Inducción en Informática & TI"
            description="Consulta sobre plataformas educativas, credenciales de acceso, soporte técnico y políticas de TI de Grupo Capsur."
            color="#7c3aed"
            icon={<ComputerIcon fontSize="small" />}
            initialBotMessage={`¡Saludos! Soy tu **Asistente de Inducción para el Área de Informática & TI** de Grupo CAPSUR.

Estoy capacitado para instruirte sobre:
- Plataformas de **Aulas Virtuales** de cada instituto educativo.
- Procedimiento para **recuperación y reseteo de contraseñas**.
- Flujo de reporte y atención de **incidencias técnicas**.
- Requisitos técnicos recomendados para docentes y estudiantes.

Escribe tu consulta o haz clic en cualquiera de las preguntas frecuentes:`}
            suggestedPrompts={[
                '¿Cómo se accede a las aulas virtuales de cada instituto?',
                '¿Qué hacer si un alumno olvida o bloquea su contraseña?',
                '¿Cuál es el protocolo para reportar una falla en el sistema?',
                '¿Cuáles son los requisitos técnicos recomendados para las clases?',
            ]}
            knowledgeBase={INFORMATICA_KNOWLEDGE}
        />
    );
}

InformaticaPage.layout = () => ({
    breadcrumbs: [
        {
            title: 'Portal de Capacitaciones',
            href: '/capacitado/venta',
        },
        {
            title: 'Informática',
            href: '/capacitado/informatica',
        },
    ],
});

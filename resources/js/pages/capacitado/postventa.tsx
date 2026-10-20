import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import React from 'react';
import { ChatInterface, KnowledgeItem } from '@/components/capacitado/chat-interface';

const POSTVENTA_KNOWLEDGE: KnowledgeItem[] = [
    {
        keywords: ['certificado', 'diploma', 'emision', 'entrega', 'tiempo', 'demora'],
        title: 'Tiempos de Emisión de Certificados',
        answer: `El procedimiento para emisión y entrega de diplomas/certificados en **Grupo CAPSUR** es:
1. **Requisitos:** El estudiante debe haber completado el 100% de los módulos y tener nota mínima aprobatoria (14/20), sin deudas pendientes.
2. **Certificado Digital con QR:** Se emite en un plazo de **3 a 5 días hábiles** tras el cierre de actas y se envía al correo registrado.
3. **Diploma Físico:** En caso de solicitar envío en físico, se coordina mediante Olva Courier o recojo en la Sede Central (Tacna) en un plazo de 7 a 10 días hábiles.`,
    },
    {
        keywords: ['reclamo', 'queja', 'nota', 'problema', 'inconformidad', 'profesor', 'docente'],
        title: 'Gestión de Reclamos e Incidencias',
        answer: `Protocolo para atender reclamos de alumnos en Postventa:
- **Escucha Activa y Registro:** Recibir al alumno con empatía, solicitar su DNI, nombre del programa y detalle de la situación.
- **Canalización:** Si es por notas o docentes, se eleva a Coordinación Académica en un plazo máximo de **24 horas**.
- **Respuesta al Alumno:** Brindar seguimiento por WhatsApp o correo antes de que transcurran 48 horas con la resolución o informe del docente.`,
    },
    {
        keywords: ['congelamiento', 'retiro', 'traslado', 'pausar', 'dejar'],
        title: 'Solicitudes de Congelamiento o Traslado',
        answer: `Directrices para congelamientos y traslados:
- **Congelamiento de Estudios:** Permitido por motivos laborales o de salud acreditados, por un periodo de hasta 6 meses sin perder lo avanzado.
- **Condición:** Debe encontrarse al día en sus cuotas hasta la fecha de solicitud.
- **Traslado de Programa:** Puede solicitar cambio a otro diplomado o curso similar abonando únicamente la diferencia de arancel si existiera.`,
    },
    {
        keywords: ['fidelizacion', 'encuesta', 'satisfaccion', 'renovacion', 'continuidad'],
        title: 'Fidelización y Continuidad Formativa',
        answer: `Estrategias de Postventa para retención y fidelización:
- **Encuestas de Calidad:** Se envían a mitad y final de cada programa para evaluar contenidos y metodología docente.
- **Beneficio Exalumno:** Descuento exclusivo del 25% en su siguiente diplomado o curso de actualización dentro de la corporación.
- **Red de Egresados:** Acceso a bolsa de trabajo y talleres gratuitos de actualización.`,
    },
];

export default function PostventaPage() {
    return (
        <ChatInterface
            areaKey="postventa"
            areaTitle="Postventa"
            botName="Asistente de Inducción en Postventa"
            description="Consulta de protocolos de atención al alumno, entrega de certificados, reclamos y fidelización."
            color="#0284c7"
            icon={<SupportAgentIcon fontSize="small" />}
            initialBotMessage={`¡Bienvenido! Soy tu **Asistente de Inducción para el Área de Postventa** de Grupo CAPSUR.

Puedo instruirte sobre:
- Procedimiento y plazos para entrega de **certificados y diplomas**.
- Protocolo de atención ante **reclamos de notas o incidencias**.
- Requisitos para **congelamientos y traslados** de matrícula.
- Estrategias de **fidelización y seguimiento** a egresados.

Escribe tu pregunta o selecciona uno de los temas sugeridos:`}
            suggestedPrompts={[
                '¿Cuál es el plazo de entrega de certificados y diplomas?',
                '¿Cómo proceder ante un reclamo de notas de un alumno?',
                '¿Cuáles son los requisitos para un congelamiento de estudios?',
                '¿Qué beneficios tienen los exalumnos para continuar capacitándose?',
            ]}
            knowledgeBase={POSTVENTA_KNOWLEDGE}
        />
    );
}

PostventaPage.layout = () => ({
    breadcrumbs: [
        {
            title: 'Portal de Capacitaciones',
            href: '/capacitado/venta',
        },
        {
            title: 'Postventa',
            href: '/capacitado/postventa',
        },
    ],
});

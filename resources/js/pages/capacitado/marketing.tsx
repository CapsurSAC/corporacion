import CampaignIcon from '@mui/icons-material/Campaign';
import React from 'react';
import { ChatInterface, KnowledgeItem } from '@/components/capacitado/chat-interface';

const MARKETING_KNOWLEDGE: KnowledgeItem[] = [
    {
        keywords: ['marca', 'logo', 'color', 'identidad', 'manual', 'paleta', 'tipografia'],
        title: 'Identidad Visual y Lineamientos de Marca',
        answer: `Directrices de marca en **Grupo CAPSUR**:
- **Colores Institucionales:**
  - *Grupo CAPSUR:* Azul Corporativo principal (\`#0c43a3\`).
  - *ESCIFOR:* Azul Marino y Rojo Institucional (\`#0c43a3\` y \`#dc2626\`).
  - *MULTIMARCA:* Verde Esmeralda y Naranja Industrial (\`#059669\` y \`#ea580c\`).
  - *GLOBALEX:* Azul Celeste y Cian de Innovación (\`#0284c7\`).
- **Logotipos:** Siempre deben usarse las versiones en alta resolución sin distorsión ni alteración de proporciones. Los archivos oficiales están centralizados en el módulo de Logos del sistema.`,
    },
    {
        keywords: ['lead', 'campaña', 'redes', 'facebook', 'instagram', 'tiktok', 'publicidad'],
        title: 'Campañas Publicitarias y Captación de Leads',
        answer: `Estrategia de atracción de postulantes en Marketing:
- **Canales Activos:** Pauta pagada en Meta Ads (Facebook e Instagram), Google Search y TikTok Ads.
- **Flujo de Leads:** El prospecto completa un formulario web o hace clic en el anuncio, siendo derivado automáticamente al WhatsApp corporativo o CRM de ventas.
- **Tiempo de Respuesta Ideal:** Menos de 5 minutos desde que ingresa el lead para maximizar la tasa de conversión.`,
    },
    {
        keywords: ['publico', 'audiencia', 'segmento', 'perfil', 'alumno', 'estudiante'],
        title: 'Público Objetivo por Instituto',
        answer: `Segmentación de mercado para cada división:
- **ESCIFOR:** Hombres y mujeres de 22 a 48 años, miembros de la PNP, peritos, abogados, psicólogos y estudiantes de derecho a nivel nacional.
- **MULTIMARCA (MATPEL):** Personal operativo, supervisores de seguridad y salud en el trabajo (SST), bomberos y trabajadores de empresas mineras e industriales.
- **GLOBALEX:** Jóvenes de 17 a 32 años que buscan carreras técnicas rápidas o profesionales que requieren diplomados de actualización en gestión y tecnología.`,
    },
    {
        keywords: ['material', 'flyer', 'brochure', 'video', 'post', 'redes sociales'],
        title: 'Material Publicitario y Contenido Digital',
        answer: `Recursos y piezas aprobadas por Marketing:
- **Brochures Oficiales:** Documentos PDF actualizados con temarios, plana docente, certificación y precios oficiales.
- **Testimonios:** Videos cortos y fotografías de ceremonias de graduación y entrega de diplomas en Tacna y sedes regionales.
- **Solicitud de Nuevas Piezas:** Toda solicitud de diseño o publicidad especial debe coordinarse con al menos 48 horas de anticipación.`,
    },
];

export default function MarketingPage() {
    return (
        <ChatInterface
            areaKey="marketing"
            areaTitle="Marketing"
            botName="Asistente de Inducción en Marketing & Medios"
            description="Consulta de identidad institucional de marcas, captación de leads, pauta publicitaria y perfiles de audiencia de Grupo Capsur."
            color="#ea580c"
            icon={<CampaignIcon fontSize="small" />}
            initialBotMessage={`¡Hola! Soy tu **Asistente de Inducción para el Área de Marketing** de Grupo CAPSUR.

Puedo instruirte sobre:
- Lineamientos del **manual de marca e identidad visual** de cada instituto.
- Gestión de **campañas digitales (Meta Ads, Google, TikTok)** y derivación de leads.
- Definición del **público objetivo y perfiles de estudiante**.
- Material gráfico oficial, **brochures y piezas publicitarias**.

Haz una pregunta o selecciona una de las sugerencias directas:`}
            suggestedPrompts={[
                '¿Cuáles son los lineamientos de color e identidad para cada marca?',
                '¿Cómo funciona el flujo de captación de leads de redes sociales?',
                '¿Cuál es el público objetivo de ESCIFOR, MULTIMARCA y GLOBALEX?',
                '¿Dónde se solicitan o consultan los brochures oficiales?',
            ]}
            knowledgeBase={MARKETING_KNOWLEDGE}
        />
    );
}

MarketingPage.layout = () => ({
    breadcrumbs: [
        {
            title: 'Portal de Capacitaciones',
            href: '/capacitado/venta',
        },
        {
            title: 'Marketing',
            href: '/capacitado/marketing',
        },
    ],
});

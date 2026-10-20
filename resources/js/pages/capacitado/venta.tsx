import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import React from 'react';
import { ChatInterface, KnowledgeItem } from '@/components/capacitado/chat-interface';

const VENTA_KNOWLEDGE: KnowledgeItem[] = [
    {
        keywords: ['instituto', 'marca', 'escifor', 'multimarca', 'globalex', 'diferencia'],
        title: 'División de Institutos',
        answer: `En **Grupo CAPSUR** contamos con 3 marcas educativas clave para la venta:
1. **ESCIFOR:** Especializado en Ciencias Forenses, Criminalística, Peritaje y Derecho. Ideal para policías, abogados, peritos y estudiantes de ciencias jurídicas.
2. **MULTIMARCA (MATPEL / CECAVA):** Enfocado en Seguridad Industrial, Manejo de Materiales Peligrosos (MATPEL) y Seguridad Minera. Dirigido al sector minero, industrial y de hidrocarburos.
3. **GLOBALEX:** Carreras técnicas superiores y diplomados ejecutivos de alta empleabilidad. Orientado a profesionales jóvenes y actualización laboral rápida.`,
    },
    {
        keywords: ['pago', 'metodo', 'cuota', 'financiamiento', 'precio', 'costo', 'yape', 'banco'],
        title: 'Formas de Pago y Financiamiento',
        answer: `Para facilitar la matrícula de los postulantes, ofrecemos las siguientes modalidades:
- **Medios Digitales:** Yape y Plin directo al número corporativo autorizado (+51 963 147 270).
- **Cuentas Bancarias:** BCP, BBVA e Interbank a nombre de la corporación.
- **Planes en Cuotas:** Matrícula inicial + cuotas mensuales sin intereses durante el periodo formativo.
- **Descuentos Corporativos:** 10% a 20% de descuento por pronto pago o convenios institucionales.`,
    },
    {
        keywords: ['virtual', 'online', 'modalidad', 'validez', 'presencial', 'oficial'],
        title: 'Modalidad Virtual y Validez',
        answer: `**Objeción común:** "¿El certificado virtual tiene la misma validez que uno presencial?"
**Respuesta sugerida:**
*"Sí, exactamente la misma validez legal y académica. Nuestros certificados y diplomas emitidos bajo modalidad virtual cuentan con horas académicas, créditos, código QR de verificación en línea y respaldo de nuestras instituciones aliadas según la normativa educativa vigente."*`,
    },
    {
        keywords: ['cierre', 'paso', 'flujo', 'matricular', 'inscribir', 'requisito'],
        title: 'Flujo de Cierre de Matrícula',
        answer: `El protocolo estándar para cerrar una matrícula en ventas es:
1. **Detección de Interés:** Identificar el programa exacto que busca el postulante.
2. **Envío de Ficha Técnica:** Compartir brochure y plan de estudios en PDF.
3. **Solicitud de Datos:** Pedir Nombres completos, DNI, correo electrónico y celular.
4. **Validación de Pago:** Solicitar voucher de transferencia o captura de Yape/Plin.
5. **Bienvenida e Inducción:** Registrar en el sistema interno y enviar la carta de bienvenida con fecha de inicio.`,
    },
];

export default function VentaPage() {
    return (
        <ChatInterface
            areaKey="venta"
            areaTitle="Venta"
            botName="Asistente de Inducción en Ventas"
            description="Consulta de argumentarios comerciales, planes de financiamiento, cierre de matrículas y oferta de Grupo Capsur."
            color="#059669"
            icon={<TrendingUpIcon fontSize="small" />}
            initialBotMessage={`¡Hola! Soy tu **Asistente de Inducción para el Área de Ventas** de Grupo CAPSUR.

Estoy aquí para capacitarte sobre:
- La propuesta de valor de nuestros 3 institutos (**ESCIFOR, MULTIMARCA y GLOBALEX**).
- Métodos de pago, facilidades de cuotas y promociones vigentes.
- Manejo de objeciones comunes de postulantes.
- El flujo paso a paso para cerrar matrículas exitosas.

Puedes escribir cualquier duda en el chat o pulsar una de las sugerencias rápidas:`}
            suggestedPrompts={[
                '¿Cuáles son las diferencias entre ESCIFOR, MULTIMARCA y GLOBALEX?',
                '¿Cuáles son las formas de pago y facilidades?',
                '¿Cómo responder a la objeción sobre la modalidad virtual?',
                '¿Cuál es el flujo para registrar una matrícula?',
            ]}
            knowledgeBase={VENTA_KNOWLEDGE}
        />
    );
}

VentaPage.layout = () => ({
    breadcrumbs: [
        {
            title: 'Portal de Capacitaciones',
            href: '/capacitado/venta',
        },
        {
            title: 'Venta',
            href: '/capacitado/venta',
        },
    ],
});

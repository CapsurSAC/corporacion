import SchoolIcon from '@mui/icons-material/School';
import React from 'react';
import { ChatInterface, KnowledgeItem } from '@/components/capacitado/chat-interface';

const ACADEMICO_KNOWLEDGE: KnowledgeItem[] = [
    {
        keywords: ['programa', 'tipo', 'diferencia', 'carrera', 'diplomado', 'curso', 'especialidad'],
        title: 'Tipos de Oferta Formativa',
        answer: `En **Grupo CAPSUR**, la oferta formativa se divide en 3 modalidades principales:
1. **Carreras Técnicas:** Programas de formación profesional de 2 a 3 años de duración. Otorgan título a nombre de la institución con valor oficial para el ejercicio técnico.
2. **Diplomados de Especialización:** Programas intensivos de 3 a 6 meses de duración (120 a 360 horas académicas). Dirigidos a actualización profesional con créditos académicos.
3. **Cursos y Talleres:** Capacitaciones cortas de 1 a 4 semanas (20 a 60 horas académicas), con certificación modular enfocada en competencias prácticas inmediatas.`,
    },
    {
        keywords: ['malla', 'curricular', 'plan de estudio', 'silabo', 'modulo'],
        title: 'Mallas Curriculares y Planes de Estudio',
        answer: `Estructura de las mallas curriculares en Grupo CAPSUR:
- **Enfoque Modular:** Cada programa está estructurado en módulos independientes y progresivos.
- **Acceso:** Las mallas oficiales se encuentran publicadas en la ficha de cada comercio en nuestro catálogo web (enlace directo a *"Ver Malla Curricular"*).
- **Actualización:** Las coordinaciones académicas revisan y actualizan los contenidos anualmente para responder a las exigencias laborales vigentes.`,
    },
    {
        keywords: ['evaluacion', 'calificacion', 'nota', 'aprobacion', 'minimo', 'escala', 'asistencia'],
        title: 'Criterios de Evaluación y Calificación',
        answer: `Sistema de evaluación académica institucional:
- **Escala de Calificación:** Escala vigesimal de 0 a 20 puntos.
- **Nota Mínima Aprobatoria:** **14** (catorce) en diplomados y carreras técnicas; **13** en cursos cortos.
- **Asistencia Mínima:** 80% de participación en clases en vivo o visualización de sesiones grabadas en el aula virtual.
- **Evaluación Final:** Proyecto aplicativo, monografía o examen final según la naturaleza del programa.`,
    },
    {
        keywords: ['certificacion', 'validez', 'qr', 'registro', 'resolucion', 'firma'],
        title: 'Certificación y Respaldo Académico',
        answer: `Respaldo de las certificaciones emitidas:
- **Código QR Único:** Cada diploma cuenta con un código QR que enlaza al sistema oficial de verificación de certificados de Grupo CAPSUR.
- **Horas y Créditos:** Especificación detallada de horas cronológicas, pedagógicas y créditos académicos en el reverso del diploma.
- **Firmas Institucionales:** Suscrito por la Dirección General y la Coordinación Académica del instituto emisor.`,
    },
];

export default function AcademicoPage() {
    return (
        <ChatInterface
            areaKey="academico"
            areaTitle="Académico"
            botName="Asistente de Inducción Académica & Curricular"
            description="Consulta de mallas curriculares, tipos de programas formativos, criterios de calificación y certificación institucional de Grupo Capsur."
            color="#0c43a3"
            icon={<SchoolIcon fontSize="small" />}
            initialBotMessage={`¡Bienvenido! Soy tu **Asistente de Inducción para el Área Académica** de Grupo CAPSUR.

Puedo orientarte en:
- Diferencias entre **Carreras Técnicas, Diplomados y Cursos**.
- Estructura y consulta de **Mallas Curriculares** por instituto.
- Criterios de **evaluación, calificación mínima y asistencia**.
- Proceso de **certificación oficial y validación con código QR**.

Escribe tu pregunta en el chat o pulsa una sugerencia rápida:`}
            suggestedPrompts={[
                '¿Cuál es la diferencia entre Carrera, Diplomado y Curso?',
                '¿Dónde se consultan las mallas curriculares de los programas?',
                '¿Cuáles son los criterios de evaluación y la nota mínima?',
                '¿Cómo se valida la autenticidad de un certificado con QR?',
            ]}
            knowledgeBase={ACADEMICO_KNOWLEDGE}
        />
    );
}

AcademicoPage.layout = () => ({
    breadcrumbs: [
        {
            title: 'Portal de Capacitaciones',
            href: '/capacitado/venta',
        },
        {
            title: 'Académico',
            href: '/capacitado/academico',
        },
    ],
});

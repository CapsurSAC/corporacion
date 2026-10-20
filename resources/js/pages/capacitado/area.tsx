import { CapacitadoFileViewer } from '@/components/capacitado-file-viewer';
import { FloatingChat } from '@/components/capacitado/floating-chat';
import type { FileNode } from '@/components/file-tree';

interface AreaProps {
    area: {
        name: string;
        slug: string;
        description?: string | null;
        color: string;
        bot_name?: string | null;
        initial_message?: string | null;
    };
    fileNodes?: FileNode[];
}

export default function DynamicTrainingArea({ area, fileNodes = [] }: AreaProps) {
    return (
        <>
            <CapacitadoFileViewer area={area} nodes={fileNodes} />
            <FloatingChat
                areaKey={area.slug}
                areaTitle={area.name}
                botName={area.bot_name || `Asistente de ${area.name}`}
                description={area.description || 'Asistente de capacitación basado en documentos oficiales del área.'}
                color={area.color}
                icon={<span aria-hidden="true">AI</span>}
                initialBotMessage={area.initial_message || `¡Bienvenido! Soy el asistente de capacitación de ${area.name}. Puedes consultar los documentos oficiales del área.`}
                suggestedPrompts={[]}
                knowledgeBase={[]}
            />
        </>
    );
}

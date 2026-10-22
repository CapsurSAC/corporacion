import { Head, usePage } from '@inertiajs/react';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PersonIcon from '@mui/icons-material/Person';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import {
    Avatar,
    Box,
    Button,
    Chip,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

export interface KnowledgeItem {
    keywords: string[];
    title: string;
    answer: string;
}

export interface ChatInterfaceProps {
    areaKey: string;
    areaTitle: string;
    botName: string;
    description: string;
    color: string;
    icon: React.ReactNode;
    initialBotMessage: string;
    suggestedPrompts: string[];
    knowledgeBase: KnowledgeItem[];
}

interface Message {
    id: string;
    sender: 'bot' | 'user';
    text: string;
    timestamp: string;
}

function renderMessageText(text: string): React.ReactNode {
    return text.split('\n').map((line, lineIndex) => (
        <React.Fragment key={`line-${lineIndex}`}>
            {lineIndex > 0 && <br />}
            {line.split(/(\*\*[^*]+\*\*)/g).map((segment, segmentIndex) => {
                const isBold = segment.startsWith('**') && segment.endsWith('**');

                return isBold ? (
                    <strong key={`segment-${lineIndex}-${segmentIndex}`}>
                        {segment.slice(2, -2)}
                    </strong>
                ) : (
                    <React.Fragment key={`segment-${lineIndex}-${segmentIndex}`}>{segment}</React.Fragment>
                );
            })}
        </React.Fragment>
    ));
}

const MAX_MESSAGE_LENGTH = 1500;

class ChatRequestError extends Error {
    constructor(
        public status: number,
        public serverMessage?: string,
    ) {
        super(`Server returned ${status}`);
    }
}

function chatErrorMessage(error: unknown): string {
    const prefix = '⚠️ **No se pudo procesar tu consulta.**';

    if (!(error instanceof ChatRequestError)) {
        return `${prefix} No hay conexión con el servidor. Revisa tu conexión a Internet e inténtalo nuevamente.`;
    }

    if (error.status === 419 || error.status === 401) {
        return `${prefix} Tu sesión expiró. Recarga la página e inicia sesión nuevamente.`;
    }

    if (error.status === 403) {
        return `${prefix} ${error.serverMessage || 'No tienes autorización para consultar esta área.'}`;
    }

    if (error.status === 422) {
        return `${prefix} ${error.serverMessage || 'Revisa tu mensaje e inténtalo nuevamente.'}`;
    }

    return `${prefix} El asistente no está disponible en este momento. Inténtalo nuevamente en unos minutos o consulta a tu jefatura de área.`;
}

export function ChatInterface({
    areaKey,
    areaTitle,
    botName,
    description,
    color = '#0c43a3',
    icon,
    initialBotMessage,
    suggestedPrompts = [],
    knowledgeBase = [],
}: ChatInterfaceProps) {
    const { auth } = usePage().props as { auth?: { user?: any } };
    const userName = auth?.user?.name || 'Capacitado';

    const getInitialMessage = (): Message => ({
        id: 'msg-init-1',
        sender: 'bot',
        text: initialBotMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const findAnswer = (query: string): string => {
        const cleanQuery = query.toLowerCase().trim();

        // 1. Coincidencia por palabras clave en la base de conocimientos
        for (const item of knowledgeBase) {
            const hasMatch = item.keywords.some((kw) => cleanQuery.includes(kw.toLowerCase()));
            if (hasMatch) {
                return item.answer;
            }
        }

        // 2. Saludos comunes
        if (cleanQuery.includes('hola') || cleanQuery.includes('buenos dias') || cleanQuery.includes('buenas tardes') || cleanQuery.includes('saludos')) {
            return `¡Hola ${userName}! Con gusto te asisto. Estoy programado para resolver cualquier duda sobre los procedimientos, herramientas y lineamientos del área de **${areaTitle}** en Grupo CAPSUR. ¿Qué te gustaría consultar?`;
        }

        // 3. Agradecimientos
        if (cleanQuery.includes('gracias') || cleanQuery.includes('muchas gracias') || cleanQuery.includes('excelente')) {
            return '¡De nada! Recuerda que estoy disponible las 24 horas para ayudarte en tu proceso de inducción y aprendizaje continuo en Grupo CAPSUR. ¿Deseas hacer otra consulta sobre este departamento?';
        }

        // 4. Quién es o qué hace la empresa
        if (cleanQuery.includes('capsur') || cleanQuery.includes('empresa') || cleanQuery.includes('corporacion') || cleanQuery.includes('instituto')) {
            return `**Grupo CAPSUR** es una corporación educativa líder fundada en Tacna, Perú, integrada por 3 divisiones comerciales principales:
- **ESCIFOR:** Formación técnica y profesional especializada en peritaje, seguridad y criminalística.
- **MULTIMARCA:** Consorcio técnico enfocado en seguridad industrial, MATPEL y certificaciones técnicas.
- **GLOBALEX:** Alianza formativa orientada a carreras profesionales de alta demanda y actualización laboral.

En esta área de **${areaTitle}**, apoyamos directamente los objetivos estratégicos de la corporación.`;
        }

        // 5. Respuesta inteligente contextual por defecto
        return `He registrado tu consulta sobre: *"${query}"*.

Para brindarte una instrucción precisa sobre el área de **${areaTitle}**, te recomiendo verificar los siguientes canales:
1. **Manual Operativo de ${areaTitle}:** Documento guía disponible con tu coordinador de área.
2. **Supervisor del Área:** Puedes elevar casos específicos a la jefatura de **${areaTitle}**.
3. **Preguntas sugeridas:** También puedes hacer clic en los temas sugeridos arriba para conocer los procedimientos más consultados.

¿Te gustaría que te oriente sobre algún tema o proceso en específico?`;
    };

    const handleSendMessage = async (textToSend?: string) => {
        const text = (textToSend !== undefined ? textToSend : inputValue).trim();
        if (!text || isTyping) {
            return;
        }

        const userMsg: Message = {
            id: `usr-${Date.now()}`,
            sender: 'user',
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        if (textToSend === undefined) {
            setInputValue('');
        }
        setIsTyping(true);

        try {
            const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';

            const res = await fetch('/capacitado/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    area: areaKey,
                    message: text,
                    history: updatedMessages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
                }),
            });

            if (res.ok) {
                const data = await res.json();
                const botMsg: Message = {
                    id: `bot-${Date.now()}`,
                    sender: 'bot',
                    text: data.reply || findAnswer(text),
                    timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setMessages((prev) => [...prev, botMsg]);
            } else {
                const data = await res.json().catch(() => null);

                throw new ChatRequestError(res.status, data?.message);
            }
        } catch (error) {
            console.error('Error en consulta al asistente IA:', error);
            // Se avisa del fallo en lugar de inventar una respuesta local: el usuario debe saber que su consulta no llegó.
            const botMsg: Message = {
                id: `bot-${Date.now()}`,
                sender: 'bot',
                text: chatErrorMessage(error),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, botMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleResetChat = () => {
        setMessages([getInitialMessage()]);
        setInputValue('');
        setIsTyping(false);
    };

    return (
        <>
            <Head title={`Asistente de ${areaTitle} - Grupo Capsur`} />

            <Box
                sx={{
                    p: { xs: 1.5, sm: 2.5 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                    flex: 1,
                    minHeight: 'calc(100vh - 4.5rem)',
                    boxSizing: 'border-box',
                }}
            >
                {/* CABECERA DE LA SECCIÓN (IDÉNTICO A PANEL PRINCIPAL) */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 1.5, sm: 1.8 },
                        px: { xs: 2, sm: 2.5 },
                        borderRadius: 1.5,
                        bgcolor: 'background.paper',
                        border: 0,
                        boxShadow: 'none',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 1.5,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                                sx={{
                                    bgcolor: color,
                                    color: '#ffffff',
                                    width: 38,
                                    height: 38,
                                    borderRadius: 1,
                                }}
                            >
                                {icon}
                            </Avatar>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 800,
                                            color: 'text.primary',
                                            letterSpacing: '-0.02em',
                                            fontSize: '1.05rem',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {areaTitle}
                                    </Typography>
                                    <Chip
                                        label="GRUPO CAPSUR"
                                        size="small"
                                        sx={{
                                            bgcolor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(12, 67, 163, 0.25)'
                                                    : 'rgba(12, 67, 163, 0.08)',
                                            color: 'primary.main',
                                            fontWeight: 800,
                                            fontSize: '0.65rem',
                                            height: 20,
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'rgba(12, 67, 163, 0.4)'
                                                    : 'rgba(12, 67, 163, 0.2)',
                                        }}
                                    />
                                    <Chip
                                        icon={<SmartToyIcon sx={{ fontSize: '12px !important' }} />}
                                        label="CHATBOT ACTIVO"
                                        size="small"
                                        sx={{
                                            bgcolor: `${color}15`,
                                            color: color,
                                            fontWeight: 800,
                                            fontSize: '0.65rem',
                                            height: 20,
                                            borderRadius: 1,
                                        }}
                                    />
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
                                    {description}
                                </Typography>
                            </Box>
                        </Box>

                        <Tooltip title="Reiniciar conversación" arrow>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={handleResetChat}
                                startIcon={<RestartAltIcon fontSize="small" />}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.78rem',
                                    borderRadius: 1,
                                }}
                            >
                                Nueva Consulta
                            </Button>
                        </Tooltip>
                    </Box>
                </Paper>

                {/* VENTANA PRINCIPAL DE CHATBOT */}
                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 1.5,
                        border: 0,
                        bgcolor: 'background.paper',
                        boxShadow: 'none',
                        overflow: 'hidden',
                        position: 'relative',
                        minHeight: { xs: 460, md: 540 },
                    }}
                >
                    {/* Borde superior de acento */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            bgcolor: color,
                            zIndex: 2,
                        }}
                    />

                    {/* Barra de estado del Asistente */}
                    <Box
                        sx={{
                            px: 2.5,
                            py: 1.2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: 0,
                            bgcolor: (theme) =>
                                theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.02)'
                                    : 'rgba(0, 0, 0, 0.01)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: `${color}20`, color: color }}>
                                    <SmartToyIcon sx={{ fontSize: 18 }} />
                                </Avatar>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        width: 9,
                                        height: 9,
                                        borderRadius: '50%',
                                        bgcolor: '#10b981',
                                        border: '1.5px solid #ffffff',
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.86rem', lineHeight: 1.2 }}>
                                    {botName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                    Instrucción y asistencia en tiempo real para {areaTitle}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Sugerencias Rápidas de Preguntas */}
                    {suggestedPrompts.length > 0 && (
                        <Box
                            sx={{
                                px: 2.5,
                                py: 1,
                                bgcolor: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? 'rgba(30, 41, 59, 0.3)'
                                        : 'rgba(241, 245, 249, 0.5)',
                                borderBottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                overflowX: 'auto',
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': { display: 'none' },
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', flexShrink: 0 }}>
                                <LightbulbIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.72rem' }}>
                                    Sugerencias:
                                </Typography>
                            </Box>
                            {suggestedPrompts.map((prompt, idx) => (
                                <Chip
                                    key={idx}
                                    label={prompt}
                                    size="small"
                                    onClick={() => handleSendMessage(prompt)}
                                    sx={{
                                        cursor: 'pointer',
                                        fontSize: '0.72rem',
                                        fontWeight: 600,
                                        flexShrink: 0,
                                        borderRadius: 1,
                                        transition: 'all 0.15s ease',
                                        '&:hover': {
                                            bgcolor: `${color}18`,
                                            color: color,
                                            borderColor: color,
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    )}

                    {/* Contenedor de Mensajes */}
                    <Box
                        sx={{
                            flex: 1,
                            p: { xs: 2, sm: 2.5 },
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            maxHeight: { xs: 'calc(100vh - 21rem)', md: 'calc(100vh - 19.5rem)' },
                        }}
                    >
                        {messages.map((msg) => {
                            const isBot = msg.sender === 'bot';

                            return (
                                <Box
                                    key={msg.id}
                                    sx={{
                                        display: 'flex',
                                        gap: 1.5,
                                        alignItems: 'flex-start',
                                        alignSelf: isBot ? 'flex-start' : 'flex-end',
                                        maxWidth: { xs: '92%', md: '82%' },
                                        flexDirection: isBot ? 'row' : 'row-reverse',
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            bgcolor: isBot ? color : 'primary.main',
                                            color: '#ffffff',
                                            fontSize: '0.75rem',
                                            fontWeight: 800,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {isBot ? <SmartToyIcon sx={{ fontSize: 17 }} /> : <PersonIcon sx={{ fontSize: 17 }} />}
                                    </Avatar>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isBot ? 'flex-start' : 'flex-end' }}>
                                        <Box
                                            sx={{
                                                p: 1.8,
                                                px: 2,
                                                borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                                                bgcolor: (theme) => {
                                                    if (!isBot) {
                                                        return theme.palette.mode === 'dark' ? '#0c43a3' : '#0056d6';
                                                    }
                                                    return theme.palette.mode === 'dark'
                                                        ? 'rgba(30, 41, 59, 0.7)'
                                                        : 'rgba(241, 245, 249, 0.9)';
                                                },
                                                color: (theme) => {
                                                    if (!isBot) {
                                                        return '#ffffff';
                                                    }
                                                    return theme.palette.mode === 'dark' ? '#f1f5f9' : '#0f172a';
                                                },
                                                border: 0,
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    lineHeight: 1.6,
                                                    fontSize: '0.86rem',
                                                    whiteSpace: 'pre-line',
                                                    '& strong': {
                                                        fontWeight: 800,
                                                        color: isBot ? 'inherit' : '#ffffff',
                                                    },
                                                }}
                                            >
                                                {renderMessageText(msg.text)}
                                            </Typography>
                                        </Box>

                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.4, px: 0.5, fontSize: '0.68rem' }}>
                                            {isBot ? botName : userName} · {msg.timestamp}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}

                        {/* Indicador de escribiendo */}
                        {isTyping && (
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', alignSelf: 'flex-start' }}>
                                <Avatar sx={{ width: 28, height: 28, bgcolor: `${color}25`, color: color }}>
                                    <SmartToyIcon sx={{ fontSize: 16 }} />
                                </Avatar>
                                <Box
                                    sx={{
                                        p: 1.2,
                                        px: 1.8,
                                        borderRadius: '4px 12px 12px 12px',
                                        bgcolor: (theme) =>
                                            theme.palette.mode === 'dark'
                                                ? 'rgba(30, 41, 59, 0.7)'
                                                : 'rgba(241, 245, 249, 0.9)',
                                        border: 0,
                                        display: 'flex',
                                        gap: 0.6,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, animation: 'pulse 1s infinite alternate' }} />
                                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, animation: 'pulse 1s infinite alternate 0.2s' }} />
                                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, animation: 'pulse 1s infinite alternate 0.4s' }} />
                                </Box>
                            </Box>
                        )}

                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Barra de Entrada de Texto */}
                    <Box sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: 'background.paper' }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder={`Pregúntale al Asistente de ${areaTitle} sobre procesos, directrices o herramientas...`}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                            onKeyDown={handleKeyDown}
                            disabled={isTyping}
                            slotProps={{
                                htmlInput: { maxLength: MAX_MESSAGE_LENGTH },
                                input: {
                                    sx: {
                                        borderRadius: 1.5,
                                        fontSize: '0.88rem',
                                        bgcolor: (theme) =>
                                            theme.palette.mode === 'dark'
                                                ? 'rgba(255, 255, 255, 0.03)'
                                                : 'rgba(0, 0, 0, 0.02)',
                                    },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleSendMessage()}
                                                disabled={!inputValue.trim() || isTyping}
                                                size="small"
                                                sx={{
                                                    bgcolor: inputValue.trim() ? color : 'transparent',
                                                    color: inputValue.trim() ? '#ffffff' : 'inherit',
                                                    '&:hover': {
                                                        bgcolor: inputValue.trim() ? color : 'transparent',
                                                        opacity: 0.9,
                                                    },
                                                }}
                                            >
                                                <SendIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, px: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                Presiona <strong>Enter</strong> para enviar.
                                {inputValue.length > MAX_MESSAGE_LENGTH * 0.8 && ` (${inputValue.length}/${MAX_MESSAGE_LENGTH})`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                Asistente Virtual de Inducción · Grupo CAPSUR 2026
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </>
    );
}

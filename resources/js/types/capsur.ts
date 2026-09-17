export type TipoPrograma = 'carrera' | 'diplomado' | 'curso' | 'taller' | 'especialidad';
export type ModalidadPrograma = 'virtual' | 'presencial' | 'semipresencial' | 'asincrono';
export type EstadoPrograma = 'activo' | 'inactivo' | 'en_convocatoria';

export interface Grupo {
    id: number;
    nombre: string;
    slug: string;
    descripcion: string | null;
    activo: boolean;
    comercios_count?: number;
    carreras_count?: number;
    comercios?: Comercio[];
    created_at?: string;
    updated_at?: string;
}

export interface Comercio {
    id: number;
    grupo_id: number;
    nombre: string;
    slug: string;
    codigo: string | null;
    sigla: string | null;
    color_hex: string | null;
    logo_modo_claro?: string | null;
    logo_modo_oscuro?: string | null;
    pagina_web: string | null;
    plataforma_carrera: string | null;
    certificado_url: string | null;
    resolucion_revalidacion: string | null;
    resolucion_creacion: string | null;
    escale_minedu: string | null;
    link_directo_escale: string | null;
    malla_curricular_url: string | null;
    catalogo_url?: string | null;
    brochure_vacaciones_utiles?: string | null;
    como_ingresar_plataforma?: string | null;
    reconocimiento_director: string | null;
    seminario: string | null;
    convenio: string | null;
    promocion_vigente?: string | null;
    canales_youtube: string[] | null;
    fotos: string[] | null;
    custom_attributes?: Record<string, any> | null;
    descripcion: string | null;
    activo: boolean;
    grupo?: Grupo;
    carreras_count?: number;
    carreras?: Carrera[];
    diplomados_count?: number;
    diplomados?: Diplomado[];
    cursos_count?: number;
    cursos?: Curso[];
    especialidades_count?: number;
    especialidades?: Especialidad[];
    created_at?: string;
    updated_at?: string;
}

export interface Carrera {
    id: number;
    comercio_id: number;
    nombre: string;
    slug?: string;
    url_malla_curricular?: string | null;
    url_declaracion_jurada?: string | null;
    modelo_certificado?: string | null;
    codigo?: string | null;
    tipo?: TipoPrograma;
    modalidad?: ModalidadPrograma;
    duracion?: string | null;
    descripcion?: string | null;
    resolucion?: string | null;
    brochure?: string | null;
    flyer?: string | null;
    modelo_titulo?: string | null;
    estado?: EstadoPrograma;
    comercio?: Comercio;
    diplomados_count?: number;
    diplomados?: Diplomado[];
    cursos_count?: number;
    cursos?: Curso[];
    especialidades_count?: number;
    especialidades?: Especialidad[];
    created_at?: string;
    updated_at?: string;
}

export interface Estado {
    id: number;
    nombre: string;
    clave: string;
    color_hex?: string | null;
    descripcion?: string | null;
    activo: boolean;
    orden: number;
    created_at?: string;
    updated_at?: string;
}

export interface Diplomado {
    id: number;
    comercio_id: number;
    carrera_id?: number | null;
    estado_id?: number | null;
    nombre: string;
    slug: string;
    tipo?:
        | 'ambientales'
        | 'calidad_isos'
        | 'mineros'
        | 'administracion'
        | 'arquitectura_ingenieria'
        | 'osha'
        | 'comercio_exterior'
        | 'rubro_legal'
        | 'no_actualizados'
        | 'nombramiento'
        | 'secundaria'
        | 'generico'
        | string;
    rubros?: string | null;
    flyer?: string | null;
    brochure?: string | null;
    youtube?: string | null;
    precio?: string | null;
    actualizado_drive?: string | null;
    comercio?: Comercio;
    carrera?: Carrera | null;
    estado?: Estado | null;
    created_at?: string;
    updated_at?: string;
}

export interface Curso {
    id: number;
    comercio_id: number;
    carrera_id?: number | null;
    estado_id?: number | null;
    nombre: string;
    slug: string;
    tipo?:
        | 'tradicional'
        | 'especializado'
        | 'ambientales'
        | 'calidad_isos'
        | 'mineros'
        | 'administracion'
        | 'arquitectura_ingenieria'
        | 'osha'
        | 'comercio_exterior'
        | 'rubro_legal'
        | 'no_actualizados'
        | 'nombramiento'
        | 'secundaria'
        | 'generico'
        | string;
    rubros?: string | null;
    flyer?: string | null;
    brochure?: string | null;
    youtube?: string | null;
    precio?: string | null;
    actualizado_drive?: string | null;
    comercio?: Comercio;
    carrera?: Carrera | null;
    estado?: Estado | null;
    created_at?: string;
    updated_at?: string;
}

export interface Especialidad {
    id: number;
    comercio_id: number;
    carrera_id?: number | null;
    rubro_id: number;
    estado_id?: number | null;
    nombre: string;
    slug: string;
    flyer?: string | null;
    brochure?: string | null;
    youtube?: string | null;
    precio?: string | null;
    actualizado_drive?: string | null;
    comercio?: Comercio;
    carrera?: Carrera | null;
    rubro?: Rubro;
    estado?: Estado | null;
    created_at?: string;
    updated_at?: string;
}

export interface CapsurStats {
    totalGrupos: number;
    totalComercios: number;
    totalCarreras: number;
    carrerasActivas: number;
    carrerasEnConvocatoria: number;
    totalEspecialidades?: number;
}

export interface Rubro {
    id: number;
    nombre: string;
    clave: string;
    color_hex?: string | null;
    categoria?: string | null;
    descripcion?: string | null;
    activo: boolean;
    orden: number;
    diplomados_count?: number;
    cursos_count?: number;
    especialidades_count?: number;
    especialidades?: Especialidad[];
    created_at?: string;
    updated_at?: string;
}



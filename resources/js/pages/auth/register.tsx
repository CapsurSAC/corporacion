import { Form, Head } from '@inertiajs/react';
import { ChevronDownIcon } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type RolOption = {
    id: number;
    nombre: string;
    slug: string;
    descripcion?: string | null;
};

type Props = {
    passwordRules: string;
    roles?: RolOption[];
    trainingAreas?: { id: number; name: string; slug: string }[];
};

export default function Register({ passwordRules, roles = [], trainingAreas = [] }: Props) {
    const availableRoles =
        roles.length > 0
            ? roles
            : [
                  { id: 1, nombre: 'CAPACITADO', slug: 'capacitado' },
                  { id: 2, nombre: 'ADMIN', slug: 'admin' },
              ];

    return (
        <>
            <Head title="Registrarse" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre Completo</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nombre y Apellidos"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="training_area_id">Área de Capacitación (solo CAPACITADO)</Label>
                                <select
                                    id="training_area_id"
                                    name="training_area_id"
                                    tabIndex={4}
                                    defaultValue=""
                                    className="border-input text-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm cursor-pointer dark:bg-[#0c0c0e] dark:border-zinc-800"
                                >
                                    <option value="">Sin área</option>
                                    {trainingAreas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}
                                </select>
                                <InputError message={errors.training_area_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="correo@ejemplo.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="rol_id">Rol de Usuario</Label>
                                <div className="relative">
                                    <select
                                        id="rol_id"
                                        name="rol_id"
                                        required
                                        tabIndex={3}
                                        defaultValue=""
                                        className="border-input text-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full appearance-none rounded-md border bg-transparent px-3 py-1 pr-8 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm cursor-pointer dark:bg-[#0c0c0e] dark:border-zinc-800"
                                    >
                                        <option
                                            value=""
                                            disabled
                                            className="text-muted-foreground dark:bg-zinc-900"
                                        >
                                            Selecciona un rol
                                        </option>
                                        {availableRoles.map((r) => (
                                            <option
                                                key={r.id}
                                                value={r.id}
                                                className="dark:bg-zinc-900 dark:text-zinc-100"
                                            >
                                                {r.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-2.5 size-4 opacity-50" />
                                </div>
                                <InputError message={errors.rol_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Ingresa tu contraseña"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmar Contraseña
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Repite tu contraseña"
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={6}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Crear Cuenta
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            ¿Ya tienes una cuenta?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={7}
                            >
                                Iniciar Sesión
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Crear una Cuenta',
    description: 'Ingresa tus datos a continuación para registrarte en el catálogo',
};

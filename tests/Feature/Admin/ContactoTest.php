<?php

namespace Tests\Feature\Admin;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ContactoTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_contacto_admin(): void
    {
        $response = $this->get('/admin/contacto');
        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_view_contacto_admin(): void
    {
        $user = User::factory()->create();

        Setting::set('contact_phone', '+51 987 654 321');
        Setting::set('contact_email', 'informes@capsur.pe');

        $response = $this->actingAs($user)->get('/admin/contacto');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('admin/contacto/index')
            ->where('contact.phone', '+51 987 654 321')
            ->where('contact.email', 'informes@capsur.pe')
        );
    }

    public function test_admin_can_update_contacto_settings(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->put('/admin/contacto', [
            'address' => 'Av. Bolognesi N° 500',
            'address_detail' => 'Tacna, Perú',
            'phone' => '+51 955 444 333',
            'phone_detail' => 'Atención al cliente',
            'whatsapp' => '+51 955 444 333',
            'whatsapp_message' => 'Hola, deseo informes',
            'email' => 'soporte@capsur.edu.pe',
            'email_detail' => 'Consultas generales',
            'schedule' => 'Lun - Vie · 9:00 AM - 6:00 PM',
            'schedule_detail' => 'Horario regular',
            'maps_url' => 'https://maps.google.com/?q=Tacna',
            'maps_embed_url' => '<iframe src="https://maps.google.com/embed?pb=123" width="600"></iframe>',
            'banner_title' => 'Formación con futuro',
            'banner_subtitle' => 'Sede Tacna',
        ]);

        $response->assertRedirect();
        $this->assertEquals('Av. Bolognesi N° 500', Setting::get('contact_address'));
        $this->assertEquals('+51 955 444 333', Setting::get('contact_phone'));
        $this->assertEquals('soporte@capsur.edu.pe', Setting::get('contact_email'));
        $this->assertEquals('https://maps.google.com/embed?pb=123', Setting::get('contact_maps_embed_url'));
        $this->assertEquals('Formación con futuro', Setting::get('contact_banner_title'));
    }

    public function test_welcome_page_receives_updated_contact_info(): void
    {
        Setting::set('contact_phone', '+51 911 222 333');
        Setting::set('contact_email', 'contacto-test@capsur.edu.pe');
        Setting::set('contact_address', 'Calle San Martín 123');

        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('contactInfo.phone', '+51 911 222 333')
            ->where('contactInfo.email', 'contacto-test@capsur.edu.pe')
            ->where('contactInfo.address', 'Calle San Martín 123')
        );
    }
}

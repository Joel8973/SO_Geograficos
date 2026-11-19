<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Establishment;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['emprendedor' => 'Emprendedor', 'comercio' => 'Comercio', 'admin' => 'Administrador'] as $name => $label) {
            Role::updateOrCreate(['name' => $name], ['display_name' => $label]);
        }
        foreach (['Alimentos', 'Bebidas', 'Lácteos', 'Leche', 'Queso', 'Yogurt', 'Mantequilla',
            'Limpieza', 'Cuidado personal', 'Panadería', 'Otros'] as $name) {
            Category::firstOrCreate(['name' => $name], ['slug' => Str::slug($name)]);
        }

        $ruta = base_path('../data/establecimientos.json');
        if (!is_file($ruta)) throw new RuntimeException('No existe data/establecimientos.json en la raíz del repositorio.');
        $datos = json_decode(file_get_contents($ruta), true, 512, JSON_THROW_ON_ERROR);
        if (!is_array($datos)) throw new RuntimeException('El JSON de establecimientos es inválido.');

        $tipos = ['Tienda'=>'tienda', 'Minimercado'=>'minimercado', 'Supermercado'=>'supermercado'];
        foreach ($datos as $fila) {
            $rec = match ($fila['recepcion'] ?? '') {
                'Recibe propuestas' => 'si', 'No recibe por ahora' => 'no', default => 'confirmar'
            };
            $art = match (Str::lower((string)($fila['artesanales'] ?? ''))) {
                'si','sí' => 'si', 'no' => 'no', default => 'confirmar'
            };
            $frio = match (Str::lower((string)($fila['refrigeracion'] ?? ''))) {
                'si','sí' => true, 'no' => false, default => null
            };
            $locales = match (Str::lower((string)($fila['vendeLocales'] ?? ''))) {
                'si','sí' => true, 'no' => false, default => null
            };
            $freq = match (Str::lower((string)($fila['frecuencia'] ?? ''))) {
                'diario' => 'diario', 'semanal' => 'semanal', 'quincenal' => 'quincenal',
                'mensual' => 'mensual', '' => null, default => 'otro'
            };
            $productos = array_values(array_filter((array)($fila['categoriaProductos'] ?? []), 'is_string'));
            $e = Establishment::updateOrCreate(
                ['external_code' => 'xlsx-'.(string)$fila['id']],
                [
                    'name' => $fila['nombre'], 'slug' => Str::slug($fila['nombre']),
                    'type' => $tipos[$fila['tipo'] ?? ''] ?? 'otro', 'type_original' => $fila['tipoOriginal'] ?? null,
                    'address' => $fila['direccion'] ?? null, 'business_hours' => $fila['horario'] ?? null,
                    'parish' => $fila['parroquia'] ?? null, 'sector' => $fila['sector'] ?? null,
                    'latitude' => $fila['lat'] ?? null, 'longitude' => $fila['lon'] ?? null,
                    'receives_suppliers' => $rec, 'artisanal_interest' => $art,
                    'has_refrigeration' => $frio, 'refrigeration_capacity' => $fila['capacidadFrio'] ?? null,
                    'weekly_volume' => $fila['volumen'] ?? null, 'supply_frequency' => $freq,
                    'current_supplier' => $fila['proveedorActual'] ?? null,
                    'main_demand_product' => $fila['mayorDemanda'] ?? null,
                    'sells_local_producers' => $locales, 'products_sold' => $productos,
                    'ownership' => $fila['local'] ?? null,
                    'customers_per_day' => is_numeric($fila['clientesDia'] ?? null) ? (int)$fila['clientesDia'] : null,
                    'observations' => $fila['observaciones'] ?? null,
                    'verification_status' => 'pendiente', 'source' => 'excel_lacteos_2026',
                ]
            );
            $ids = Category::whereIn('name', $productos)->pluck('id')->all();
            $e->categories()->sync($ids);
            // No se publican teléfonos ni correos del Excel sin consentimiento de su titular.
        }
        $this->command?->info('Importados/actualizados '.count($datos).' establecimientos de Latacunga.');
    }
}

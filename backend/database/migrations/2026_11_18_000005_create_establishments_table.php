<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('establishments', function (Blueprint $table) {
            $table->id();
            $table->string('external_code', 50)->nullable()->index()
                ->comment('N° del archivo Excel consolidado');
            $table->string('name');
            $table->string('slug')->index();
            $table->enum('type', ['tienda', 'minimercado', 'supermercado', 'otro']);
            $table->string('type_original', 50)->nullable();
            $table->string('address')->nullable();
            $table->string('province', 100)->default('Cotopaxi');
            $table->string('canton', 100)->default('Latacunga');
            $table->string('parish', 100)->nullable();
            $table->string('sector', 100)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->enum('receives_suppliers', ['si', 'no', 'confirmar'])->default('confirmar');
            $table->enum('artisanal_interest', ['si', 'no', 'confirmar'])->default('confirmar');
            $table->boolean('has_refrigeration')->nullable();
            $table->string('refrigeration_capacity')->nullable();
            $table->string('weekly_volume')->nullable();
            $table->enum('supply_frequency', ['diario', 'semanal', 'quincenal', 'mensual', 'otro'])->nullable();
            $table->string('current_supplier')->nullable();
            $table->string('main_demand_product')->nullable();
            $table->boolean('sells_local_producers')->nullable();
            $table->json('products_sold')->nullable();
            $table->string('ownership', 50)->nullable();
            $table->unsignedInteger('customers_per_day')->nullable();
            $table->text('observations')->nullable();
            $table->enum('decision_center', ['sucursal', 'oficina_central'])->nullable()
                ->comment('Supermercados: dónde se toma la decisión de compra');
            $table->boolean('has_account')->default(false);
            $table->boolean('supplier_confirmed')->default(false)
                ->comment('Distinto de "registrado en el mapa"');
            $table->timestamp('verified_at')->nullable();
            $table->enum('verification_status', ['verificado', 'pendiente', 'correccion_requerida'])
                ->default('pendiente');
            $table->timestamp('last_updated_at')->nullable();
            $table->string('source', 100)->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['type', 'receives_suppliers']);
            $table->index(['parish', 'sector']);
            $table->index(['latitude', 'longitude']);
            $table->fullText(['name', 'address', 'sector']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('establishments');
    }
};

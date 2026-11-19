<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('opportunities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('establishment_id')->constrained()->cascadeOnDelete();
            $table->enum('status', [
                'por_contactar', 'contactado', 'muestra_entregada', 'en_negociacion',
                'primer_pedido', 'punto_venta_activo', 'no_concretada',
            ])->default('por_contactar');
            $table->text('private_notes')->nullable();
            $table->date('next_follow_up_at')->nullable();
            $table->text('agreed_conditions')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['user_id', 'establishment_id']);
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('opportunities');
    }
};

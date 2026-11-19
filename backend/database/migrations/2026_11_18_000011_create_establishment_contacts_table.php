<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('establishment_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('establishment_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('area')->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('email')->nullable();
            $table->enum('channel', ['telefono', 'whatsapp', 'email', 'presencial', 'otro'])
                ->default('telefono')->comment('Medio autorizado de contacto');
            $table->boolean('is_authorized')->default(true);
            $table->boolean('is_primary')->default(false);
            $table->enum('decision_level', ['sucursal', 'oficina_central'])->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['establishment_id', 'is_primary']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('establishment_contacts');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('establishment_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('establishment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->enum('result', ['confirmado', 'correccion_requerida', 'sin_cambios'])
                ->default('confirmado');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['establishment_id', 'verified_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('establishment_verifications');
    }
};

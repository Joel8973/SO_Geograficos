<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proposal_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proposal_id')->constrained()->cascadeOnDelete();
            $table->foreignId('establishment_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete()
                ->comment('Usuario que registró la respuesta manualmente');
            $table->enum('response', [
                'me_interesa', 'solicito_informacion', 'agendar_visita', 'no_interesado',
            ]);
            $table->text('notes')->nullable();
            $table->boolean('is_manual')->default(false)
                ->comment('true si el emprendedor registró el resultado sin cuenta del comercio');
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proposal_responses');
    }
};

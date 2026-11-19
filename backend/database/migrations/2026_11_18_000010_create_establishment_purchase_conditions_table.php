<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('establishment_purchase_conditions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('establishment_id')->unique()->constrained()->cascadeOnDelete();
            $table->enum('payment_type', ['contado', 'credito', 'consignacion', 'otro'])->nullable();
            $table->string('initial_order')->nullable();
            $table->text('return_conditions')->nullable();
            $table->text('credit_terms')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('establishment_purchase_conditions');
    }
};

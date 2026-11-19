<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->index();
            $table->string('photo_path')->nullable();
            $table->text('description')->nullable();
            $table->string('presentation')->nullable();
            $table->decimal('price_to_business', 10, 2)->nullable();
            $table->decimal('suggested_price', 10, 2)->nullable();
            $table->string('minimum_order')->nullable();
            $table->string('weekly_capacity')->nullable();
            $table->string('shelf_life')->nullable();
            $table->text('conservation_conditions')->nullable();
            $table->json('delivery_zones')->nullable();
            $table->string('delivery_frequency')->nullable();
            $table->json('documentation')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'is_active']);
            $table->fullText(['name', 'description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

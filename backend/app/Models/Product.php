<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'category_id', 'name', 'slug', 'photo_path', 'description',
        'presentation', 'price_to_business', 'suggested_price', 'minimum_order',
        'weekly_capacity', 'shelf_life', 'conservation_conditions',
        'delivery_zones', 'delivery_frequency', 'documentation', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price_to_business' => 'decimal:2',
            'suggested_price' => 'decimal:2',
            'delivery_zones' => 'array',
            'documentation' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function proposalProducts()
    {
        return $this->hasMany(ProposalProduct::class);
    }
}

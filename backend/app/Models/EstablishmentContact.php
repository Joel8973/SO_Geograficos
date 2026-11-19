<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class EstablishmentContact extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'establishment_id', 'name', 'area', 'phone', 'email', 'channel',
        'is_authorized', 'is_primary', 'decision_level', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'is_authorized' => 'boolean',
            'is_primary' => 'boolean',
        ];
    }

    public function establishment(): BelongsTo
    {
        return $this->belongsTo(Establishment::class);
    }
}

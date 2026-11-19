<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EstablishmentPurchaseCondition extends Model
{
    use HasFactory;

    protected $fillable = [
        'establishment_id', 'payment_type', 'initial_order', 'return_conditions',
        'credit_terms', 'notes',
    ];

    public function establishment(): BelongsTo
    {
        return $this->belongsTo(Establishment::class);
    }
}

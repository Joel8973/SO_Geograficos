<?php

namespace App\Models;

use App\Enums\OpportunityStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Opportunity extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'establishment_id', 'status', 'private_notes',
        'next_follow_up_at', 'agreed_conditions', 'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => OpportunityStatus::class,
            'next_follow_up_at' => 'date',
            'closed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function establishment(): BelongsTo
    {
        return $this->belongsTo(Establishment::class);
    }

    public function histories(): HasMany
    {
        return $this->hasMany(OpportunityHistory::class);
    }

    /** Registra el cambio de estado en el historial. */
    public function changeStatus(OpportunityStatus $nuevo, ?string $nota = null, ?int $changedBy = null): void
    {
        $anterior = $this->status;

        $this->status = $nuevo;

        if (in_array($nuevo, [OpportunityStatus::NoConcretada, OpportunityStatus::PuntoVentaActivo], true)) {
            $this->closed_at = now();
        }

        $this->save();

        $this->histories()->create([
            'from_status' => $anterior->value,
            'to_status' => $nuevo->value,
            'note' => $nota,
            'changed_by' => $changedBy,
        ]);
    }
}

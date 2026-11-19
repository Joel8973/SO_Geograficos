<?php

namespace App\Models;

use App\Enums\ProposalResponseType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProposalResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'proposal_id', 'establishment_id', 'user_id', 'response', 'notes',
        'is_manual', 'responded_at',
    ];

    protected function casts(): array
    {
        return [
            'response' => ProposalResponseType::class,
            'is_manual' => 'boolean',
            'responded_at' => 'datetime',
        ];
    }

    public function proposal(): BelongsTo
    {
        return $this->belongsTo(Proposal::class);
    }

    public function establishment(): BelongsTo
    {
        return $this->belongsTo(Establishment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

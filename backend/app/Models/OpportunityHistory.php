<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OpportunityHistory extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'opportunity_id', 'from_status', 'to_status', 'note', 'changed_by',
    ];

    protected function casts(): array
    {
        return ['created_at' => 'datetime'];
    }

    public function opportunity(): BelongsTo
    {
        return $this->belongsTo(Opportunity::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}

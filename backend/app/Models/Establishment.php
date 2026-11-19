<?php

namespace App\Models;

use App\Enums\EstablishmentType;
use App\Enums\SupplierReception;
use App\Enums\VerificationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Establishment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'external_code', 'name', 'slug', 'type', 'type_original', 'address',
        'province', 'canton', 'parish', 'sector', 'latitude', 'longitude',
        'receives_suppliers', 'artisanal_interest', 'has_refrigeration',
        'refrigeration_capacity', 'weekly_volume', 'supply_frequency',
        'current_supplier', 'main_demand_product', 'sells_local_producers',
        'products_sold', 'ownership', 'customers_per_day', 'observations',
        'decision_center', 'has_account', 'supplier_confirmed',
        'verified_at', 'verification_status', 'last_updated_at', 'source',
        'created_by', 'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'type' => EstablishmentType::class,
            'receives_suppliers' => SupplierReception::class,
            'artisanal_interest' => SupplierReception::class,
            'verification_status' => VerificationStatus::class,
            'latitude' => 'float',
            'longitude' => 'float',
            'products_sold' => 'array',
            'has_refrigeration' => 'boolean',
            'sells_local_producers' => 'boolean',
            'has_account' => 'boolean',
            'supplier_confirmed' => 'boolean',
            'verified_at' => 'datetime',
            'last_updated_at' => 'datetime',
        ];
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_establishment');
    }

    public function needs(): HasMany
    {
        return $this->hasMany(EstablishmentNeed::class);
    }

    public function requirements(): HasMany
    {
        return $this->hasMany(EstablishmentRequirement::class);
    }

    public function purchaseCondition(): HasOne
    {
        return $this->hasOne(EstablishmentPurchaseCondition::class);
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(EstablishmentContact::class);
    }

    public function opportunities(): HasMany
    {
        return $this->hasMany(Opportunity::class);
    }

    public function proposals(): HasMany
    {
        return $this->hasMany(Proposal::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function verifications(): HasMany
    {
        return $this->hasMany(EstablishmentVerification::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /** Distancia en km usando la columna espacial (MySQL 8+). */
    public static function cercaDe(float $lat, float $lon, float $radioKm)
    {
        return static::whereNotNull('latitude')
            ->whereRaw(
                'ST_Distance_Sphere(`location`, ST_SRID(POINT(?, ?), 4326)) <= ?',
                [$lon, $lat, $radioKm * 1000]
            );
    }
}

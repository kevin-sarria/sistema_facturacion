<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_type',
        'document_number',
        'name',
        'last_name',
        'email',
        'phone',
        'address',
    ];

    protected $appends = [
        'full_name',
    ];

    public function getFullNameAttribute(): string
    {
        return trim("{$this->name} " . ($this->last_name ?? ''));
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function payments()
    {
        return $this->hasMany(CustomerPayment::class);
    }

    /**
     * Total fiado o deuda pendiente del cliente
     */
    public function getTotalDebtAttribute(): float
    {
        return (float) $this->sales()
            ->whereIn('payment_status', ['pending', 'partial'])
            ->sum('balance_due');
    }
}

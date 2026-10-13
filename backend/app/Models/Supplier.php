<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'tax_id',
        'contact_name',
        'phone',
        'contact_phone',
        'email',
        'address',
        'notes',
    ];

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }

    /**
     * Total pendiente por pagar a este proveedor
     */
    public function getTotalDebtAttribute(): float
    {
        return (float) $this->purchases()
            ->whereIn('payment_status', ['pending', 'partial'])
            ->sum('balance_due');
    }
}

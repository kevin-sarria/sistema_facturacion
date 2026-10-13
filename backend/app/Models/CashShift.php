<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashShift extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'opened_at',
        'closed_at',
        'initial_cash',
        'total_cash_sales',
        'total_electronic_sales',
        'expected_cash',
        'actual_cash',
        'difference',
        'notes',
        'status',
    ];

    protected $casts = [
        'opened_at' => 'datetime',
        'closed_at' => 'datetime',
        'initial_cash' => 'decimal:2',
        'total_cash_sales' => 'decimal:2',
        'total_electronic_sales' => 'decimal:2',
        'expected_cash' => 'decimal:2',
        'actual_cash' => 'decimal:2',
        'difference' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}

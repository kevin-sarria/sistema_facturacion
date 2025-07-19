<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{

    use HasFactory;

    protected $table = 'inventory';

    protected $fillable = [
        'name',
        'quantity',
        'presentation_id',
        'purchase_price',
        'profit_percentage',
        'sale_price',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'profit_percentage' => 'decimal:2',
        'sale_price' => 'decimal:2',
    ];

    public function presentation()
    {
        return $this->belongsTo(Presentation::class);
    }

}

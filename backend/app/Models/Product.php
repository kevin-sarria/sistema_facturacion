<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'barcode',
        'sku',
        'name',
        'description',
        'category_id',
        'presentation_id',
        'purchase_price',
        'profit_percentage',
        'sale_price',
        'stock',
        'min_stock',
        'has_iva',
        'iva_percentage',
        'is_active',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'profit_percentage' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'stock' => 'integer',
        'min_stock' => 'integer',
        'has_iva' => 'boolean',
        'iva_percentage' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function presentation()
    {
        return $this->belongsTo(Presentation::class);
    }

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }

    /**
     * Búsqueda optimizada por código de barras o texto
     * Si coincide el código de barras exacto, tiene prioridad absoluta
     */
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (empty($term)) {
            return $query;
        }

        $term = trim($term);

        return $query->where(function ($q) use ($term) {
            $q->where('barcode', $term)
              ->orWhere('sku', $term)
              ->orWhere('name', 'LIKE', "%{$term}%");
        });
    }

    /**
     * Scope para productos con bajo stock (alertas para compras)
     */
    public function scopeLowStock(Builder $query): Builder
    {
        return $query->whereColumn('stock', '<=', 'min_stock');
    }
}

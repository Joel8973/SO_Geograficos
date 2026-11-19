<?php

namespace App\Enums;

enum EstablishmentType: string
{
    case Tienda = 'tienda';
    case Minimercado = 'minimercado';
    case Supermercado = 'supermercado';
    case Otro = 'otro';

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        return [
            'tienda' => 'Tienda',
            'minimercado' => 'Minimercado',
            'supermercado' => 'Supermercado',
            'otro' => 'Otro',
        ];
    }
}

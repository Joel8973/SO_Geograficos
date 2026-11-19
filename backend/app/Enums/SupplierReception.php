<?php

namespace App\Enums;

enum SupplierReception: string
{
    case Si = 'si';
    case No = 'no';
    case Confirmar = 'confirmar';

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        return [
            'si' => 'Si',
            'no' => 'No',
            'confirmar' => 'Confirmar',
        ];
    }
}

<?php

namespace App\Enums;

enum UserRole: string
{
    case Emprendedor = 'emprendedor';
    case Comercio = 'comercio';
    case Admin = 'admin';

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        return [
            'emprendedor' => 'Emprendedor',
            'comercio' => 'Comercio',
            'admin' => 'Admin',
        ];
    }
}

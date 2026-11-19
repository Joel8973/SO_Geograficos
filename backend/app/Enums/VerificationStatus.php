<?php

namespace App\Enums;

enum VerificationStatus: string
{
    case Verificado = 'verificado';
    case Pendiente = 'pendiente';
    case CorreccionRequerida = 'correccion_requerida';

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        return [
            'verificado' => 'Verificado',
            'pendiente' => 'Pendiente',
            'correccion_requerida' => 'Correccion requerida',
        ];
    }
}

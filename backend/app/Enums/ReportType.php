<?php

namespace App\Enums;

enum ReportType: string
{
    case Ubicacion = 'ubicacion';
    case Direccion = 'direccion';
    case Telefono = 'telefono';
    case Horario = 'horario';
    case Recepcion = 'recepcion';
    case Otro = 'otro';

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        return [
            'ubicacion' => 'Ubicacion',
            'direccion' => 'Direccion',
            'telefono' => 'Telefono',
            'horario' => 'Horario',
            'recepcion' => 'Recepcion',
            'otro' => 'Otro',
        ];
    }
}

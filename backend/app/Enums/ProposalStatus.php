<?php

namespace App\Enums;

enum ProposalStatus: string
{
    case Enviada = 'enviada';
    case Aceptada = 'aceptada';
    case Rechazada = 'rechazada';
    case InformacionSolicitada = 'informacion_solicitada';
    case VisitaAgendada = 'visita_agendada';

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        return [
            'enviada' => 'Enviada',
            'aceptada' => 'Aceptada',
            'rechazada' => 'Rechazada',
            'informacion_solicitada' => 'Informacion solicitada',
            'visita_agendada' => 'Visita agendada',
        ];
    }
}
